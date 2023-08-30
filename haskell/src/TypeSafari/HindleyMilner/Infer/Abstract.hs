module TypeSafari.HindleyMilner.Infer.Abstract (
  InferAction(..),
  InferState(..),
  runAbstract,
  hindleyMilner,
  Result(..)
) where

import Data.Map qualified as Map
import Control.Monad.Writer
import Control.Monad.Trans.RWS (RWST, evalRWST, ask, local, get, put)
import TypeSafari.HindleyMilner.Syntax
import TypeSafari.Core
import TypeSafari.HindleyMilner.Infer
import TypeSafari.Pretty (Pretty(..))

------------------------------------------------------------

data InferAction
  = ActionConstrainEqual Type Type
  | ActionInfer Expr
  | ActionDebug Text
  deriving stock (Show)

instance Pretty InferAction where
  pretty (ActionConstrainEqual t1 t2) = "constrainEqual " <> (pretty t1) <> " // " <> (pretty t2)
  pretty (ActionInfer e) = "infer " <> pretty e
  pretty (ActionDebug e) = "debug " <> e

-- | type inference monad, suitable for actually running
newtype InferAbstract a
  = InferAbstract (RWST
      TypeEnv             -- R: current typing environment
      [InferAction]       -- W: generated constraints
      InferState          -- S: inference state
      (Except TypeError)  -- type inference errors
      a                   -- result
    )
  deriving newtype (Functor, Applicative, Monad)

newtype InferState = InferState {
  freshCounter :: Int
}

runAbstract :: InferAbstract Type -> Either TypeError (Type, [InferAction])
runAbstract (InferAbstract m) = runExcept $ evalRWST m emptyTypeEnv initialState
  where
    emptyTypeEnv = TypeEnv Map.empty
    initialState = InferState { freshCounter = 0 }

------------------------------------------------------------

instance MonadTypeEnv InferAbstract where
  getTypeEnv :: InferAbstract TypeEnv
  getTypeEnv = InferAbstract ask

  typeOf :: Name -> InferAbstract (Maybe Scheme)
  typeOf x = InferAbstract $ do
    (TypeEnv env) <- ask
    pure $ Map.lookup x env

  inLocalScope :: (Name, Scheme) -> InferAbstract a -> InferAbstract a
  inLocalScope (x, sch) (InferAbstract m) =
    InferAbstract $ do
      let scope :: TypeEnv -> TypeEnv
          scope env = (remove env x) `extend` (x , sch)
      local scope m
    where
      remove :: TypeEnv -> Name -> TypeEnv
      remove (TypeEnv env) k = TypeEnv $ Map.delete k env

instance MonadConstraint InferAbstract where
  constrainEqual :: Type -> Type -> InferAbstract ()
  constrainEqual t1 t2 = InferAbstract $ tell [ActionConstrainEqual t1 t2]

instance MonadFresh InferAbstract where
  freshTypeVar :: InferAbstract Type
  freshTypeVar = InferAbstract $ do
    InferState { freshCounter } <- get
    put $ InferState { freshCounter = freshCounter + 1 }
    return $ (TypeVar . TV . Fresh) freshCounter

instance MonadTypeError InferAbstract where
  throwTypeError :: forall a. TypeError -> InferAbstract a
  throwTypeError err = InferAbstract $ throwError err

instance MonadInfer InferAbstract where
  visit :: Expr -> InferAbstract ()
  visit e = InferAbstract $ tell [ActionInfer e]

  debug :: Text -> InferAbstract()
  debug t = InferAbstract $ tell [ActionDebug t]

------------------------------------------------------------

data Result = Result {
    resultType :: Type,
    resultSubst :: Subst,
    resultActions :: [InferAction]
  }

hindleyMilner :: Expr -> Either TypeError Result
hindleyMilner e = do
  (partialType, actions) <- runAbstract $ infer e
  let constrs = mapMaybe constrFromAction actions
  subst <- runSolve $ solve (emptySubst, constrs)
  pure $ Result {
    resultType = applySubst subst partialType,
    resultSubst = subst,
    resultActions = actions
  }
  where
    constrFromAction :: InferAction -> Maybe Constraint
    constrFromAction (ActionConstrainEqual t1 t2) = Just $ Constraint t1 t2
    constrFromAction _ = Nothing