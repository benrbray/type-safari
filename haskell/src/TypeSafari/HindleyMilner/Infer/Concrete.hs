module TypeSafari.HindleyMilner.Infer.Concrete where

import Data.Map qualified as Map
import Control.Monad.Writer
import Control.Monad.Trans.RWS (RWST (runRWST), ask, local, get, put)
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

runConcrete :: InferConcrete Type -> Either TypeError (Type, InferState, [Constraint])
runConcrete (InferConcrete m) = runExcept $ runRWST m emptyTypeEnv initialState
  where
    emptyTypeEnv = TypeEnv Map.empty
    initialState = InferState { freshCounter = 0 }

------------------------------------------------------------

instance MonadTypeEnv InferConcrete where
  getTypeEnv :: InferConcrete TypeEnv
  getTypeEnv = InferConcrete ask

  typeOf :: Name -> InferConcrete (Maybe TypeScheme)
  typeOf x = InferConcrete $ do
    (TypeEnv env) <- ask
    pure $ Map.lookup x env

  inLocalScope :: (Name, TypeScheme) -> InferConcrete a -> InferConcrete a
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
  constrainEqual t1 t2 = InferConcrete $ tell [ConstrEqual t1 t2]

  constrainImplicitInstance :: (Set MV) -> Type -> Type -> InferConcrete ()
  constrainImplicitInstance monos t1 t2 =
    InferConcrete $ tell [ConstrInstImplicit monos t1 t2]

freshInt :: InferConcrete Int
freshInt = InferConcrete $ do
  InferState { freshCounter } <- get
  let newValue = freshCounter + 1
  put $ InferState { freshCounter = newValue }
  return newValue

instance MonadFresh InferConcrete where

  freshMetaVar :: InferConcrete MV
  freshMetaVar = (MV . Fresh) <$> freshInt

  freshTypeVar :: InferConcrete TV
  freshTypeVar = (TvBound . Fresh) <$> freshInt

instance MonadTypeError InferConcrete where
  throwTypeError :: forall a. TypeError -> InferConcrete a
  throwTypeError err = InferConcrete $ throwError err

instance MonadInfer InferConcrete where
  annot :: Expr -> Type -> InferConcrete Type
  annot _ = pure
  visit :: Expr -> InferConcrete ()
  visit _ = pure ()

instance MonadDebug InferConcrete where
  debug :: Text -> InferConcrete ()
  debug _ = pure ()

------------------------------------------------------------

hindleyMilner :: (MonadInfer m) =>
  (m Type -> Either TypeError (Type, InferState, [Constraint]))
  -> Expr
  -> Either TypeError Type
hindleyMilner run e = do
  (partialType, InferState { freshCounter }, constrs) <- run $ infer e
  subst <- solve freshCounter constrs
  pure $ substMetaVars subst partialType