module TypeSafari.HindleyMilner.Infer.Concrete where

import Data.Map qualified as Map
import Control.Monad.Writer
import Control.Monad.Trans.RWS (RWST, evalRWST, ask, local, get, put)
import TypeSafari.HindleyMilner.Syntax
import TypeSafari.Core
import TypeSafari.HindleyMilner.Infer

-- | type inference monad, suitable for actually running
newtype InferConcrete a
  = InferConcrete (RWST
      TypeEnv             -- R: current typing environment
      [Constraint]        -- W: generated constraints
      InferState          -- S: inference state
      (Except TypeError)  -- type inference errors
      a                   -- result
    )
  deriving newtype (Functor, Applicative, Monad)

newtype InferState = InferState {
  freshCounter :: Int
}

runConcrete :: InferConcrete Type -> Either TypeError (Type, [Constraint])
runConcrete (InferConcrete m) = runExcept $ evalRWST m emptyTypeEnv initialState
  where
    emptyTypeEnv = TypeEnv Map.empty
    initialState = InferState { freshCounter = 0 }

------------------------------------------------------------

instance MonadTypeEnv InferConcrete where
  getTypeEnv :: InferConcrete TypeEnv
  getTypeEnv = InferConcrete ask

  typeOf :: Name -> InferConcrete (Maybe Scheme)
  typeOf x = InferConcrete $ do
    (TypeEnv env) <- ask
    pure $ Map.lookup x env

  inLocalScope :: (Name, Scheme) -> InferConcrete a -> InferConcrete a
  inLocalScope (x, sch) (InferConcrete m) =
    InferConcrete $ do
      let scope :: TypeEnv -> TypeEnv
          scope env = (remove env x) `extend` (x , sch)
      local scope m
    where 
      remove :: TypeEnv -> Name -> TypeEnv
      remove (TypeEnv env) k = TypeEnv $ Map.delete k env

instance MonadConstraint InferConcrete where
  constrainEqual :: Type -> Type -> InferConcrete ()
  constrainEqual t1 t2 = InferConcrete $ tell [Constraint t1 t2]

instance MonadFresh InferConcrete where
  freshTypeVar :: InferConcrete Type
  freshTypeVar = InferConcrete $ do
    InferState { freshCounter } <- get
    put $ InferState { freshCounter = freshCounter + 1 }
    return $ (TypeVar . TV . Fresh) freshCounter

instance MonadTypeError InferConcrete where
  throwTypeError :: forall a. TypeError -> InferConcrete a
  throwTypeError err = InferConcrete $ throwError err

instance MonadInfer InferConcrete where
  visit :: Expr -> InferConcrete ()
  visit _ = pure ()

------------------------------------------------------------

hindleyMilner :: (MonadInfer m) =>
  (m Type -> Either TypeError (Type, [Constraint]))
  -> Expr
  -> Either TypeError Type
hindleyMilner run e = do
  (partialType, constrs) <- run $ infer e
  subst <- runSolve $ solve (emptySubst, constrs)
  pure $ applySubst subst partialType