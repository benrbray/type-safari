-- Adapted from "Write You a Haskell" by Stephen Diehl
-- https://web.archive.org/web/20181017074008/http://dev.stephendiehl.com/fun/006_hindley_milner.html

{-# LANGUAGE OverloadedStrings #-}
module TypeSafari.HindleyMilner.Infer where

import Protolude hiding (Type, TypeError(TypeError), Constraint)
import Data.Map qualified as Map
import Data.Set qualified as Set
import GHC.Base (error)
import Control.Monad.Writer
import Control.Monad.Trans.RWS (RWST, evalRWST)

---- syntax --------------------------------------------------------------------

data Name
  = Name Text
  | Fresh Int
  deriving stock (Show, Eq, Ord)

data Expr
  = Var Name            -- variable
  | App Expr Expr       -- application
  | Lam Name Expr       -- lambda
  | Let Name Expr Expr  -- let x = e1 in e2
  | Lit Lit             -- literal
  | If Expr Expr Expr   -- if then else
  | Fix Expr            -- fixpoint
  | Op Binop Expr Expr  -- binary operator
  deriving stock (Show, Eq, Ord)

data Lit
  = LInt Integer
  | LBool Bool
  deriving stock (Show, Eq, Ord)

data Binop
  = Add | Sub | Mul | Eql
  deriving stock (Show, Eq, Ord)

type Decl
  = (Text, Expr)

data Program
  = Program [Decl] Expr
  deriving stock (Show, Eq, Ord)

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

newtype InferState = InferState {
  freshCounter :: Int
}

-- constraints record assertions that two types must unify
data Constraint
  = Constraint Type Type
  deriving stock (Eq, Show)

-- | type inference monad
type Infer a
  = (RWST
      TypeEnv             -- R: current typing environment
      [Constraint]        -- W: generated constraints
      InferState          -- S: inference state
      (Except TypeError)  -- type inference errors
      a                   -- result
    )

type MonadTypeError m  = MonadError TypeError m
type MonadTypeEnv m    = MonadReader TypeEnv m
type MonadInferState m = MonadState InferState m
type MonadConstraint m = MonadWriter [Constraint] m
type MonadInfer m      = (MonadTypeError m, MonadTypeEnv m, MonadInferState m, MonadConstraint m)

runInfer :: Infer Type -> Either TypeError (Type, [Constraint])
runInfer m = runExcept $ evalRWST m emptyTypeEnv initialState
  where
    emptyTypeEnv = TypeEnv Map.empty
    initialState = InferState { freshCounter = 0 }

---- infer monad operations ----------------------------------------------------

-- | Records a new unification constraint, to be solved later.
addConstraint :: MonadWriter [Constraint] m => Type -> Type -> m ()
addConstraint t1 t2 = tell [Constraint t1 t2]

-- | Executes the given @Infer@ action in an environment extended
-- with the passed type annotation.  Useful managing local scope.
inLocalScope :: MonadTypeEnv m => (Name, Scheme) -> m a -> m a
inLocalScope (x, sch) m =
  do
    let scope :: TypeEnv -> TypeEnv
        scope env = (remove env x) `extend` (x , sch)
    local scope m
  where 
    remove :: TypeEnv -> Name -> TypeEnv
    remove (TypeEnv env) k = TypeEnv $ Map.delete k env

-- | Generate a fresh type metavariable.
fresh :: MonadInferState m => m Type
fresh = do
  InferState { freshCounter } <- get
  put $ InferState { freshCounter = freshCounter + 1 }
  return $ (TypeVar . TV . Fresh) freshCounter

-- looks up a local variable in the typing env,
-- and if found instantiates a fresh copy
lookupEnv :: MonadInfer m => Name -> m Type
lookupEnv x = do
  TypeEnv env <- ask
  case Map.lookup x env of
    Nothing  -> throwError $ UnboundVariable x
    Just sch -> instantiate sch

---- hindley-milner generalization & instantiation -----------------------------

-- | bind fresh typevars for each typevar mentioned in the forall
instantiate :: MonadInferState m => Scheme -> m Type
instantiate (Forall as0 t) = do
  as1 <- traverse (const fresh) as0
  let s = Map.fromList $ zip as0 as1
  return $ applySubst s t

-- | universally quantify over any free variables in a given type
-- (which are not also mentioned in the typing environment)
generalize :: MonadTypeEnv m => Type -> m Scheme
generalize t = do
  env <- ask
  let as = Set.toList $ freeTypeVars t `Set.difference` freeTypeVars env
  return $ Forall as t

--------------------------------------------------------------------------------

-- maps the local typing env and the active expression to a tuple containing
--     a partial solution to unification
--     the intermediate type
-- the AST is traversed bottom-up and constraints are solved at each level of
-- recursion by applying partial substitutions from unification across each
-- partially inferred subexpression and the local environment
infer :: MonadInfer m => Expr -> m Type
infer ex = case ex of
  
  Var x -> lookupEnv x

  Lam x e -> do
    tv <- fresh
    t  <- inLocalScope (x, Forall [] tv) (infer e)
    return (tv `TypeArr` t)
  
  App efun earg -> do
    tres <- fresh
    tfun <- infer efun
    targ <- infer earg
    addConstraint tfun (TypeArr targ tres)
    return tres

  Let x e1 e2 -> do
    -- let-generalization
    te1 <- generalize =<< infer e1
    te2 <- inLocalScope (x, te1) (infer e2)
    return te2

  If econd etru efls -> do
    tcond <- infer econd
    ttru  <- infer etru
    tfls  <- infer efls

    addConstraint tcond typeBool
    addConstraint ttru tfls

    return ttru

  Fix e -> do
    t    <- infer e
    tres <- fresh
    addConstraint t (TypeArr tres tres)
    return t
  
  Op op e1 e2 -> do
    t1     <- infer e1
    t2     <- infer e2
    tres   <- fresh
    
    let top = ops Map.! op
    addConstraint (TypeArr t1 (TypeArr t2 tres)) top

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

--------------------------------------------------------------------------------

