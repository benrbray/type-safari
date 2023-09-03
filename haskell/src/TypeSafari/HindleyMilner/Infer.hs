-- Adapted from "Write You a Haskell" by Stephen Diehl
-- https://web.archive.org/web/20181017074008/http://dev.stephendiehl.com/fun/006_hindley_milner.html

{-# LANGUAGE OverloadedStrings #-}
module TypeSafari.HindleyMilner.Infer (
  TypeScheme (..),
  Type(..),
  TypeEnv (..),
  TV (..),
  MV (..),
  TypeError (..),
  Constraint (..),
  MonadTypeEnv (..),
  MonadConstraint (..),
  MonadTypeError (..),
  MonadFresh (..),
  MonadInfer (..),
  MonadDebug (..),
  extend,
  infer,
  solve,
  SubstMV,
  emptySubstMV,
  substMetaVars
) where

import Data.Map qualified as Map
import Data.Set qualified as Set
import TypeSafari.HindleyMilner.Syntax
import TypeSafari.Pretty (Pretty (..), nl, sp)
import TypeSafari.Core

---- types ---------------------------------------------------------------------

-- | A concrete type variable.
data TV
  -- | Bound type variables are _always_ bound by an enclosing @ForAll@.
  --   * may appear in type annotations in a source program
  --   * no well-formed @Type@ ever has a free @TvBound@. 
  = TvBound Name
  -- | Stands in for a constant, but unknown type.
  --   * never bound by a @forall@, and can be free in a `Type`.
  --   * the string is a hint used for documentation
  | TvSkolem Int Text
  deriving stock (Show, Eq, Ord)

-- | A type metavariable is a placeholder for an unknown monotype.
--   * Never quantified by a forall.
--   * Created only by the type inference engine during constraint generation.
--   * Metavariables are the _only_ targets of substitution.
--   * Successful type inference never leaves behind metavariables.
newtype MV
  = MV Name
  deriving stock (Show, Eq, Ord)

data Type
  = TypeVar TV        -- type variable
  | TypeMetaVar MV    -- type metavariable
  | TypeCon Text      -- type constructor
  | TypeArr Type Type -- arrow type
  deriving stock (Show, Eq, Ord)

-- type scheme models polymorphic types
data TypeScheme
  = Forall [TV] Type
  deriving stock (Eq, Show)

---- type constants ------------------------------------------------------------

typeInt :: Type
typeInt = TypeCon "Int"

typeBool :: Type
typeBool = TypeCon "Bool"

ops :: Map.Map Binop Type
ops = Map.fromList [
      (Add, (typeInt `TypeArr` (typeInt `TypeArr` typeInt)))
    , (Mul, (typeInt `TypeArr` (typeInt `TypeArr` typeInt)))
    , (Sub, (typeInt `TypeArr` (typeInt `TypeArr` typeInt)))
    , (Eql, (typeInt `TypeArr` (typeInt `TypeArr` typeBool)))
  ]

---- context -------------------------------------------------------------------

newtype TypeEnv
  = TypeEnv (Map Name TypeScheme)

extend :: TypeEnv -> (Name, TypeScheme) -> TypeEnv
extend (TypeEnv env) (x, s) =
  if Map.member x env
    then error $ "duplicate element in type env: " ++ (show x)
    else TypeEnv $ Map.insert x s env

---- metavariable substitution --------------------------------------------------------------

-- substitution is only performed on type variables
type SubstMV = Map MV Type

class MetaVarSubst a where
  substMetaVars :: SubstMV -> a -> a
  freeMetaVars :: a -> Set MV

instance MetaVarSubst Type where
  -- TODO (Ben @ 2023/08/30) address https://github.com/sdiehl/write-you-a-haskell/issues/116
  substMetaVars :: SubstMV -> Type -> Type
  substMetaVars _ t@(TypeCon _)     = t
  substMetaVars _ t@(TypeVar _)     = t
  substMetaVars s t@(TypeMetaVar m) = Map.findWithDefault t m s
  substMetaVars s (TypeArr t1 t2)   = TypeArr (substMetaVars s t1) (substMetaVars s t2)

  freeMetaVars :: Type -> Set MV
  freeMetaVars (TypeCon _)     = Set.empty
  freeMetaVars (TypeVar _)     = Set.empty
  freeMetaVars (TypeMetaVar m) = Set.singleton m
  freeMetaVars (TypeArr t1 t2) = freeMetaVars t1 <> freeMetaVars t2

instance MetaVarSubst TypeScheme where
  substMetaVars s0 (Forall tvs t)  = Forall tvs $ substMetaVars s0 t

  freeMetaVars :: TypeScheme -> Set MV
  freeMetaVars (Forall _ t) = freeMetaVars t

instance MetaVarSubst a => MetaVarSubst [a] where
  substMetaVars = fmap . substMetaVars
  freeMetaVars = foldr (Set.union . freeMetaVars) Set.empty

instance MetaVarSubst TypeEnv where
  substMetaVars s (TypeEnv env) = TypeEnv $ Map.map (substMetaVars s) env
  freeMetaVars (TypeEnv env) = freeMetaVars $ Map.elems env

instance MetaVarSubst Constraint where
  substMetaVars s (ConstrEqual t1 t2) =
    ConstrEqual (substMetaVars s t1) (substMetaVars s t2)
  -- TODO: are the defs below correct?  are they required?
  substMetaVars s (ConstrInstExplicit t sch) =
    ConstrInstExplicit (substMetaVars s t) (substMetaVars s sch)
  -- TODO: need any substitutions for monos?
  -- perhaps delete from @monos@ any metavars mentioned in the subst, since
  -- they will no longer be present in the constrained types?
  substMetaVars s (ConstrInstImplicit monos t1 t2) =
    ConstrInstImplicit monos (substMetaVars s t1) (substMetaVars s t2)

  freeMetaVars (ConstrEqual t1 t2) =
    (freeMetaVars t1) `Set.union` (freeMetaVars t2)
  -- TODO: are the defs below correct?  are they required?
  freeMetaVars (ConstrInstExplicit t sch) =
    (freeMetaVars t) `Set.union` (freeMetaVars sch)
  freeMetaVars (ConstrInstImplicit _monos t1 t2) =
    (freeMetaVars t1) `Set.union` (freeMetaVars t2)

emptySubstMV :: SubstMV
emptySubstMV = Map.empty

-- before merging, first apply @s1@ to all types mentioned in @s2@
-- QUESTION: in practice, is it important to allow overlap?  can we do without?
merge :: SubstMV -> SubstMV -> SubstMV
s1 `merge` s2 = (Map.map (substMetaVars s1) s2) `Map.union` s1

---- type variable substitution ------------------------------------------------

type SubstTV = Map TV Type

class TypeVarSubst a where
  substTypeVars :: SubstTV -> a -> a

instance TypeVarSubst TypeScheme where
  substTypeVars :: SubstTV -> TypeScheme -> TypeScheme
  substTypeVars s0 (Forall tv0 t) = Forall tv1 (substTypeVars s0 t)
    where
      -- keep any forall-bound type variables not mentioned in the subst
      tv1 = Set.toList $ Set.difference (Set.fromList tv0) (Map.keysSet s0)

instance TypeVarSubst Type where
  -- TODO (Ben @ 2023/08/30) address https://github.com/sdiehl/write-you-a-haskell/issues/116
  substTypeVars :: SubstTV -> Type -> Type
  substTypeVars _ t@(TypeCon _)     = t
  substTypeVars _ t@(TypeMetaVar _) = t
  substTypeVars s t@(TypeVar tv)    = Map.findWithDefault t tv s
  substTypeVars s (TypeArr t1 t2)   = TypeArr (substTypeVars s t1) (substTypeVars s t2)

---- infer monad ---------------------------------------------------------------

data TypeError
  = InfiniteType MV Type
  | UnificationFail Type Type
  | UnificationMismatch [Type] [Type]
  | TypeErrorOther Text
  | UnboundVariable Name
  deriving stock (Show)

data Constraint
  -- | @t1 = t2@ means the types should be equal, after replacing metavariables.
  = ConstrEqual Type Type
  -- | @t < σ@ means type @t@ should be an instance of type scheme @σ@, after
  -- replacing metavariables.  Useful if we know the type scheme of an expression
  -- before type inference begins.
  | ConstrInstExplicit Type TypeScheme
  -- | @t1 <(M)< t2@ means type @t1@ should be an instance of the type scheme
  -- obtained by generalizing @t2@.  The set $M$ contains the names of
  -- monomorphic type variables which should not be generalized over.  
  --
  -- As described by (Heeren 2002), this records the fact that in general, the
  -- (polymorphic) type of a declaration in a let-expression is unknown and must
  -- be inferred before it can be instantiated. Although there is no order in
  -- the set of constraints, an implicit instance constraint requires some
  -- constraints to be solved before it becomes solvable.
  | ConstrInstImplicit (Set MV) Type Type
  deriving stock (Eq, Show)

instance Pretty Type where
  pretty :: Type -> Text
  pretty (TypeVar t) = pretty t
  pretty (TypeMetaVar m) = pretty m
  pretty (TypeCon t) = t
  pretty (TypeArr t1 t2) = "(" <> pretty t1 <> " --> " <> pretty t2 <> ")"

instance Pretty TypeScheme where
  pretty :: TypeScheme -> Text
  pretty (Forall [] t) = pretty t
  pretty (Forall tvs t) = "∀" <> (foldl1 sp (pretty <$> tvs)) <> ". " <> pretty t

instance Pretty TV where
  pretty :: TV -> Text
  pretty (TvBound (Name t)) = t
  pretty (TvBound (Fresh k)) = "#" <> show k
  pretty (TvSkolem k s) = "S" <> show k <> "(" <> s <> ")"

instance Pretty MV where
  pretty :: MV -> Text
  pretty (MV (Name t)) = "_(" <> t <> ")"
  pretty (MV (Fresh k)) = "_" <> show k

instance Pretty Constraint where
  pretty :: Constraint -> Text
  pretty (ConstrEqual t1 t2) =
    pretty t1 <> " === " <> pretty t2
  pretty (ConstrInstExplicit t sch) =
    pretty t <> " :<: " <> pretty sch
  pretty (ConstrInstImplicit monos t1 t2) =
    show (pretty <$> Set.toList monos) <> " " <> pretty t1 <> " :<m<: " <> pretty t2

instance Pretty TypeError where
  pretty :: TypeError -> Text
  pretty (UnificationFail t1 t2) = "cannot unify" `nl` pretty t1 `nl` pretty t2
  pretty (InfiniteType x t) = "infinite type" `nl` pretty x `nl` pretty t
  pretty err = show err

---- primitive type inference operations ---------------------------------------

-- below are the core type inference operations, written in "tagless-final" form
-- so that they may be reinterpreted with respect to different concrete monads

class (Monad m) => MonadTypeError m where
  throwTypeError :: forall a. TypeError -> m a

class (Monad m) => MonadTypeEnv m where
  -- | Returns the current typing environment.
  getTypeEnv :: m TypeEnv

  -- | Return the type in the current environment associated
  -- with the current name, if it exists.
  typeOf :: Name -> m (Maybe TypeScheme)

  -- | Executes the given @Infer@ action in an environment extended
  -- with the passed type annotation.  Useful managing local scope.
  inLocalScope :: (Name, TypeScheme) -> m a -> m a

class (Monad m) => MonadFresh m where
  -- | Generate a fresh type metavariable.
  freshMetaVar :: m MV
  freshTypeVar :: m TV

class (Monad m) => MonadConstraint m where
  -- | Records a new unification constraint, to be solved later.
  constrainEqual :: Type -> Type -> m ()
  constrainImplicitInstance :: (Set MV) -> Type -> Type -> m ()

class (Monad m) => MonadDebug m where
  debug :: Text -> m ()
  

class (MonadTypeError m, MonadTypeEnv m, MonadFresh m, MonadConstraint m, MonadDebug m) => MonadInfer m where
  -- | To be called each time an expression is visited during recursion.
  -- This is purely for debugging purposes, and should be pure for `InferConcrete`.
  -- TODO: Is there a recursion-schemes way to do this without having a typeclass?
  visit :: Expr -> m ()
  annot :: Expr -> Type -> m Type

---- generic operations built from primitives ----------------------------------

-- | bind fresh metavars for each typevar mentioned in the forall
instantiate :: (MonadFresh m, MonadDebug m) => TypeScheme -> m Type
instantiate t@(Forall as0 _) = do
  as1 <- traverse (const (TypeMetaVar <$> freshMetaVar)) as0
  let substTV = Map.fromList $ zip as0 as1
  let result = substTypeVars substTV t
  debug $ "instantiate\n  " <> pretty t <> "\n  " <> pretty result <> "\n"
  case result of
    Forall [] t2  -> return t2
    Forall _ _    -> error "impossible! instantiate should eliminate foralls"

-- TODO: generalize was replaced with a constraint, delete / move it?
-- | replace all free metavariables in a type
-- with universally-quantified type variables
_generalize :: (MonadFresh m, MonadTypeEnv m) => Type -> m TypeScheme
_generalize t = do
  env <- getTypeEnv
  let mv = Set.toList $ freeMetaVars t `Set.difference` freeMetaVars env
  tv <- traverse (const freshTypeVar) mv
  let substMV = Map.fromList $ zip mv (TypeVar <$> tv)
  return $ Forall tv (substMetaVars substMV t)


-- | Replace all free metavariables in a type with fresh universally-quantified
-- type variables.  The set @monos@ is used to signal which metavariables should
-- be *monomorphic*, i.e. not generalized.  For example, in
--
-- @let id = (\x -> let y = x in y) in ...@
--
-- a metavariable @mx@ is introduced for the term variable @x@ in the lambda.
-- The type of the declaration for @id@ is polymorphic in @mx@, whereas the type
-- of @y@ is monomorphic in @mx@.  Under Hindley-Milner, all lambda-bound term
-- variables have monomorphic types which apply throughout the lambda expression.
-- > (quoted from Herren 2002)
--
-- TODO (Ben @ 2023/09/02) Rather than being passed in, the @monos@ could be
-- computed from the typing context at the point where the constraint is meant
-- to hold.  To do this would require taking a snapshot of the typing context
-- and storing it as part of the constraint.
generalize :: (MonadFresh m) => Set MV -> Type -> m TypeScheme
generalize monos t = do
  let mv = Set.toList $ freeMetaVars t `Set.difference` monos
  tv <- traverse (const freshTypeVar) mv
  let substMV = Map.fromList $ zip mv (TypeVar <$> tv)
  return $ Forall tv (substMetaVars substMV t)

---- constraint generation -----------------------------------------------------

-- | generates equality constraints between types, in a bottom-up,
-- manner to be solved by the unification engine later
infer :: MonadInfer m => Expr -> m Type
infer ex = ((annot ex) =<<) $ visit ex >> case ex of

  -- In a well-formed term, each term variable should be bound by either a let-
  -- expression or lambda-abstraction.  So, before recursing down to this `Var`
  -- node, the inference procedure has already assigned a type scheme (possibly
  -- with yet-unknown metavariables) to this term variable.  We simply look it
  -- up and instantiate new metavariables for any forall-bindings in the scheme.
  Var x ->
    typeOf x >>=
    \case
      Nothing  -> throwTypeError $ UnboundVariable x
      Just sch -> instantiate sch

  Lam x e -> do
    tv <- TypeMetaVar <$> freshMetaVar
    -- note: program vars bound by lambdas are given _monotypes_
    t  <- inLocalScope (x, Forall [] tv) (infer e)
    -- TODO constrainEqual here, as in (Heeren2002)?
    return (tv `TypeArr` t)

  App efun earg -> do
    tres <- TypeMetaVar <$> freshMetaVar
    tfun <- infer efun
    targ <- infer earg
    constrainEqual tfun (TypeArr targ tres)
    return tres

  Let x e1 e2 -> do
    -- let-generalization
    te1 <- infer e1
    mx  <- TypeMetaVar <$> freshMetaVar
    te2 <- inLocalScope (x, Forall [] mx) (infer e2)

    -- the type of x should be an instance of the type scheme
    -- resulting from generalizing te1 with respect to its free variables
    monos <- freeMetaVars <$> getTypeEnv -- TODO not sure if this is the correct mono set
    constrainImplicitInstance monos mx te1

    return te2

  If econd etru efls -> do
    tcond <- infer econd
    ttru  <- infer etru
    tfls  <- infer efls

    constrainEqual tcond typeBool
    constrainEqual ttru tfls

    return ttru

  Fix e -> do
    t    <- infer e
    tres <- TypeMetaVar <$> freshMetaVar
    constrainEqual t (TypeArr tres tres)
    return t

  Op op e1 e2 -> do
    t1     <- infer e1
    t2     <- infer e2
    tres   <- TypeMetaVar <$> freshMetaVar

    let top = ops Map.! op
    constrainEqual (TypeArr t1 (TypeArr t2 tres)) top

    return tres

  Lit (LInt _)  -> return typeInt
  Lit (LBool _) -> return typeBool

---- first-order unification ---------------------------------------------------

type MonadSolve m = (MonadTypeError m, MonadDebug m, MonadFresh m)

-- TODO more gracefully pass freshCounter
-- runSolve :: Int -> Solve a -> Either TypeError a
-- runSolve freshCounter (Solve s) = runIdentity . (`Control.Monad.Trans.State.evalStateT` freshCounter) . runExceptT $ s

solve :: (MonadSolve m) => [Constraint] -> m SubstMV
solve constrs = do
  debug "UNIFICATION"
  solveHeeren2002 constrs

---- constraint solving --------------------------------------------------------

activeVars :: Constraint -> Set MV
activeVars (ConstrEqual t1 t2)         = freeMetaVars t1 `Set.union` freeMetaVars t2
activeVars (ConstrInstExplicit t1 sch) = freeMetaVars t1 `Set.union` freeMetaVars sch
activeVars (ConstrInstImplicit monos t1 t2)
  -- TODO the paper writes @freeMetaVars(monos)@, but I'm not sure
  -- what that could stand for other than @monos@ itself
  = freeMetaVars t1 `Set.union` (monos `Set.intersection` freeMetaVars t2)

activeVarsL :: [Constraint] -> Set MV
activeVarsL = Set.unions . (activeVars <$>)

-- Herren 2002, "Generalizing Hindley-Milner"
solveHeeren2002 :: (MonadSolve m) => [Constraint] -> m SubstMV
solveHeeren2002 [] = pure Map.empty
solveHeeren2002 (ConstrEqual t1 t2 : constrs) = do
  subst1 <- unify t1 t2
  subst2 <- solveHeeren2002 $ substMetaVars subst1 constrs
  return $ subst1 `merge` subst2
solveHeeren2002 (c@(ConstrInstImplicit monos t1 t2) : constrs) = do
  let freePolyMV = Set.difference (freeMetaVars t2) monos
  let unsolvedActiveMV = activeVarsL constrs
  if Set.disjoint freePolyMV unsolvedActiveMV
    then do
      -- convert implicit instance constraint into an
      -- explicit instance constraint by generalizing t2
      sch <- generalize monos t2
      debug $ "generalized" <> pretty c <> " " <> pretty sch
      solveHeeren2002 (ConstrInstExplicit t1 sch : constrs)
    else do
      debug $ "postponing constraint: " <> pretty c
      solveHeeren2002 (constrs ++ [c])
solveHeeren2002 (ConstrInstExplicit t1 sch : constrs) = do
  -- convert explicit instance constraint into an equality constraint
  -- by instantiating new metavariables for the type scheme
  t2 <- instantiate sch
  solveHeeren2002 (ConstrEqual t1 t2 : constrs)

---- first-order unification ---------------------------------------------------

-- to unify a lone metavariable @m@ with a type @t@, simply return
-- the substitution @{ x <- t }@, provided that the occurs check passes
unifyBind :: (MonadTypeError m) => MV -> Type -> m SubstMV
unifyBind x t
  | t == (TypeMetaVar x) = pure emptySubstMV
  | occursCheck x t      = throwTypeError $ InfiniteType x t
  | otherwise            = return $ Map.singleton x t
  where
    -- returns @True@ whenever the type metavariable @x@ appears free in @t@
    -- used to rule out infinite types, e.g. when checking @λx. x x@
    occursCheck :: MV -> Type -> Bool
    occursCheck y typ = y `Set.member` freeMetaVars typ

unify :: (MonadSolve m) => Type -> Type -> m SubstMV
unify t1 t2
  | t1 == t2 = pure emptySubstMV
unify (TypeMetaVar x) t = unifyBind x t
unify t (TypeMetaVar x) = unifyBind x t
unify (TypeArr l1 r1) (TypeArr l2 r2) =
  unifyMany [l1, r1] [l2, r2]
unify t1 t2 = throwTypeError $ UnificationFail t1 t2

unifyMany :: (MonadSolve m) => [Type] -> [Type] -> m SubstMV
unifyMany [] [] = pure emptySubstMV
unifyMany (t1 : ts1) (t2 : ts2) =
  do subst1 <- unify t1 t2
     subst2 <- unifyMany (substMetaVars subst1 ts1) (substMetaVars subst1 ts2)

    -- QUESTION: does the order of @merge@ matter here?
     return (subst1 `merge` subst2)
unifyMany t1 t2 = throwTypeError $ UnificationMismatch t1 t2