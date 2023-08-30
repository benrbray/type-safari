-- Adapted from "Write You a Haskell" by Stephen Diehl
-- https://web.archive.org/web/20181017074008/http://dev.stephendiehl.com/fun/006_hindley_milner.html

{-# LANGUAGE OverloadedStrings #-}
module TypeSafari.HindleyMilner.Infer (
  Scheme (..),
  Type(..),
  TypeEnv (..),
  TV (..),
  TypeError (..),
  Constraint (..),
  MonadTypeEnv (..),
  MonadConstraint (..),
  MonadTypeError (..),
  MonadFresh (..),
  MonadInfer (..),
  extend,
  infer,
  solve,
  runSolve,
  Subst,
  emptySubst,
  applySubst
) where

import Data.Map qualified as Map
import Data.Set qualified as Set
import TypeSafari.HindleyMilner.Syntax
import TypeSafari.Pretty (Pretty (..), nl, sp)
import TypeSafari.Core

---- types ---------------------------------------------------------------------

-- type variable
newtype TV
  = TV Name
  deriving stock (Show, Eq, Ord)

data Type
  = TypeVar TV        -- type variable
  | TypeCon Text      -- type constructor
  | TypeArr Type Type -- arrow type
  deriving stock (Show, Eq, Ord)

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

-- type scheme models polymorphic types
data Scheme = Forall [TV] Type

---- context -------------------------------------------------------------------

newtype TypeEnv
  = TypeEnv (Map Name Scheme)

extend :: TypeEnv -> (Name, Scheme) -> TypeEnv
extend (TypeEnv env) (x, s) =
  if Map.member x env
    then error $ "duplicate element in type env: " ++ (show x)
    else TypeEnv $ Map.insert x s env

---- substitution --------------------------------------------------------------

-- substitution is only performed on type variables
type Subst = Map TV Type

class Substitutable a where
  applySubst :: Subst -> a -> a
  freeTypeVars :: a -> Set TV

instance Substitutable Type where
  -- TODO (Ben @ 2023/08/30) address https://github.com/sdiehl/write-you-a-haskell/issues/116
  applySubst :: Subst -> Type -> Type
  applySubst _ t@(TypeCon _)   = t
  applySubst s t@(TypeVar x)   = Map.findWithDefault t x s
  applySubst s (TypeArr t1 t2) = TypeArr (applySubst s t1) (applySubst s t2)

  freeTypeVars :: Type -> Set TV
  freeTypeVars (TypeCon _) = Set.empty
  freeTypeVars (TypeVar x) = Set.singleton x
  freeTypeVars (TypeArr t1 t2) = freeTypeVars t1 <> freeTypeVars t2

instance Substitutable Scheme where
  applySubst s0 (Forall tvs t)  = Forall tvs $ applySubst s1 t
    where
      -- vars bound by forall shadow vars in the context
      s1 = foldr Map.delete s0 tvs
  
  freeTypeVars :: Scheme -> Set TV
  freeTypeVars (Forall tvs t)
    = freeTypeVars t `Set.difference` Set.fromList tvs

instance Substitutable a => Substitutable [a] where
  applySubst = fmap . applySubst
  freeTypeVars = foldr (Set.union . freeTypeVars) Set.empty

instance Substitutable TypeEnv where
  applySubst s (TypeEnv env) = TypeEnv $ Map.map (applySubst s) env
  freeTypeVars (TypeEnv env) = freeTypeVars $ Map.elems env

instance Substitutable Constraint where
  applySubst s (Constraint t1 t2) = Constraint (applySubst s t1) (applySubst s t2)
  freeTypeVars (Constraint t1 t2) = (freeTypeVars t1) `Set.union` (freeTypeVars t2)

emptySubst :: Subst
emptySubst = Map.empty

-- before merging, first apply @s1@ to all types mentioned in @s2@
-- QUESTION: in practice, is it important to allow overlap?  can we do without?
merge :: Subst -> Subst -> Subst
s1 `merge` s2 = (Map.map (applySubst s1) s2) `Map.union` s1 

---- infer monad ---------------------------------------------------------------

data TypeError
  = InfiniteType TV Type
  | UnificationFail Type Type
  | UnificationMismatch [Type] [Type]
  | TypeErrorOther Text
  | UnboundVariable Name
  deriving stock (Show)

-- constraints record assertions that two types must unify
data Constraint
  = Constraint Type Type
  deriving stock (Eq, Show)

instance Pretty Type where
  pretty :: Type -> Text
  pretty (TypeVar t) = pretty t
  pretty (TypeArr t1 t2) = "(" <> pretty t1 <> " --> " <> pretty t2 <> ")"
  pretty t = show t

instance Pretty TV where
  pretty :: TV -> Text
  pretty (TV (Name t)) = t
  pretty (TV (Fresh k)) = "#" <> show k

instance Pretty Constraint where
  pretty :: Constraint -> Text
  pretty (Constraint t1 t2) =
    pretty t1 `sp` pretty t2

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
  typeOf :: Name -> m (Maybe Scheme)

  -- | Executes the given @Infer@ action in an environment extended
  -- with the passed type annotation.  Useful managing local scope.
  inLocalScope :: (Name, Scheme) -> m a -> m a

class (Monad m) => MonadFresh m where
  -- | Generate a fresh type metavariable.
  freshTypeVar :: m Type

class (Monad m) => MonadConstraint m where
  -- | Records a new unification constraint, to be solved later.
  constrainEqual :: Type -> Type -> m ()

class (MonadTypeError m, MonadTypeEnv m, MonadFresh m, MonadConstraint m) => MonadInfer m where
  -- | To be called each time an expression is visited during recursion.
  -- This is purely for debugging purposes, and should be pure for `InferConcrete`.
  -- TODO: Is there a recursion-schemes way to do this without having a typeclass?
  visit :: Expr -> m ()
  debug :: Text -> m ()

---- generic operations built from primitives ----------------------------------

-- looks up a local variable in the typing env,
-- and if found instantiates a fresh copy
lookupEnv :: MonadInfer m => Name -> m Type
lookupEnv x = typeOf x >>=
  \case
    Nothing  -> throwTypeError $ UnboundVariable x
    Just sch -> instantiate sch

-- | bind fresh typevars for each typevar mentioned in the forall
instantiate :: MonadInfer m => Scheme -> m Type
instantiate (Forall as0 t) = do
  as1 <- traverse (const freshTypeVar) as0
  let s = Map.fromList $ zip as0 as1
  let result = applySubst s t
  debug $ "instantiate " <>  "∀" <> (show $ pretty <$> as0) <> ". " <> pretty t <> " ===> " <> pretty result
  return result

-- | universally quantify over any free variables in a given type
-- (which are not also mentioned in the typing environment)
generalize :: MonadTypeEnv m => Type -> m Scheme
generalize t = do
  env <- getTypeEnv
  let as = Set.toList $ freeTypeVars t `Set.difference` freeTypeVars env
  return $ Forall as t

---- constraint generation -----------------------------------------------------

-- | generates equality constraints between types, in a bottom-up,
-- manner to be solved by the unification engine later
infer :: MonadInfer m => Expr -> m Type
infer ex = visit ex >> case ex of

  Var x -> lookupEnv x

  Lam x e -> do
    tv <- freshTypeVar
    -- note: program vars bound by lambdas are given _monotypes_
    t  <- inLocalScope (x, Forall [] tv) (infer e)
    return (tv `TypeArr` t)
  
  App efun earg -> do
    tres <- freshTypeVar
    tfun <- infer efun
    targ <- infer earg
    constrainEqual tfun (TypeArr targ tres)
    return tres

  Let x e1 e2 -> do
    -- let-generalization
    debug "" 
    te1 <- generalize =<< infer e1
    te2 <- inLocalScope (x, te1) (infer e2)
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
    tres <- freshTypeVar
    constrainEqual t (TypeArr tres tres)
    return t
  
  Op op e1 e2 -> do
    t1     <- infer e1
    t2     <- infer e2
    tres   <- freshTypeVar
    
    let top = ops Map.! op
    constrainEqual (TypeArr t1 (TypeArr t2 tres)) top

    return tres

  Lit (LInt _)  -> return typeInt
  Lit (LBool _) -> return typeBool

---- first-order unification ---------------------------------------------------

-- | A current candidate unifier, along with a set of yet-unsolved constraints.
-- Represents partial progress towards solving the unification problem.
type PartialUnifier = (Subst, [Constraint])

type Solve a = ExceptT TypeError Identity a

runSolve :: Solve a -> Either TypeError a
runSolve = runIdentity . runExceptT

-- recursively solves 
solve :: PartialUnifier -> Solve Subst
solve (subst0, []) = pure subst0
solve (subst0, (Constraint t1 t2) : constrs) = do
  subst1 <- unify t1 t2
  solve (subst1 `merge` subst0, applySubst subst1 constrs)

-- to unify a lone metavariable @m@ with a type @t@, simply return
-- the substitution @{ x <- t }@, provided that the occurs check passes
unifyBind :: (MonadError TypeError m) => TV -> Type -> m Subst
unifyBind x t
  | t == (TypeVar x) = pure emptySubst
  | occursCheck x t  = throwError $ InfiniteType x t
  | otherwise        = return $ Map.singleton x t
  where
    -- returns @True@ whenever the type variable @x@ appears free in @t@
    -- used to rule out infinite types, e.g. when checking @λx. x x@
    occursCheck :: Substitutable a => TV -> a -> Bool
    occursCheck y typ = y `Set.member` freeTypeVars typ

unify :: Type -> Type -> Solve Subst
unify t1 t2
  | t1 == t2 = pure emptySubst
unify (TypeVar x) t = unifyBind x t
unify t (TypeVar x) = unifyBind x t
unify (TypeArr l1 r1) (TypeArr l2 r2) =
  unifyMany [l1, r1] [l2, r2]
unify t1 t2 = throwError $ UnificationFail t1 t2

unifyMany :: [Type] -> [Type] -> Solve Subst
unifyMany [] [] = pure emptySubst
unifyMany (t1 : ts1) (t2 : ts2) =
  do subst1 <- unify t1 t2
     subst2 <- unifyMany (applySubst subst1 ts1) (applySubst subst1 ts2)

    -- QUESTION: does the order of @merge@ matter here?
     return (subst1 `merge` subst2)
unifyMany t1 t2 = throwError $ UnificationMismatch t1 t2