module TypeSafari.HindleyMilner.Infer.Abstract (
  InferAction(..),
  InferState(..),
  runAbstract,
  hindleyMilner,
  Result(..)
) where

import Data.Map qualified as Map
import Data.Set qualified as Set
import Control.Monad.Writer
import Control.Monad.Trans.RWS (RWST (runRWST), ask, local, get, put)
import TypeSafari.HindleyMilner.Syntax
    ( Expr0, Expr, Name(Fresh), forget, LocatedExpr )
import TypeSafari.Core
import TypeSafari.HindleyMilner.Infer
import TypeSafari.Pretty (Pretty(..))

------------------------------------------------------------

data InferAction
  = ActionConstrainEqual Type Type
  | ActionConstrainImplicitInstance (Set MV) Type Type
  | ActionConstrainExplicitInstance Type TypeScheme
  | ActionInfer Expr0
  | ActionAnnot Expr0 Type
  | ActionDebug Text

instance Pretty InferAction where
  pretty (ActionConstrainEqual t1 t2) = "constrainEqual " <> (pretty t1) <> " === " <> (pretty t2)
  pretty (ActionConstrainImplicitInstance monos t1 t2) =
    "constrainImplicitInstance " <> show (pretty <$> Set.toList monos) <> " " <> (pretty t1) <> " <: " <> (pretty t2)
  pretty (ActionConstrainExplicitInstance t sch) =
    "constrainExplicitInstance " <> (pretty t) <> " <: " <> (pretty sch)
  pretty (ActionInfer e)              = "infer " <> pretty e
  pretty (ActionAnnot e t)            = "annot " <> pretty e <> " :: " <> pretty t
  pretty (ActionDebug e)              = "debug " <> e

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

runAbstract :: forall a. TypeEnv -> InferState -> InferAbstract a -> Either TypeError (a, InferState, [InferAction])
runAbstract env state (InferAbstract m) = runExcept $ runRWST m env state

------------------------------------------------------------

instance MonadTypeEnv InferAbstract where
  getTypeEnv :: InferAbstract TypeEnv
  getTypeEnv = InferAbstract ask

  typeOf :: Name -> InferAbstract (Maybe TypeScheme)
  typeOf x = InferAbstract $ do
    (TypeEnv env) <- ask
    pure $ Map.lookup x env

  inLocalScope :: (Name, TypeScheme) -> InferAbstract a -> InferAbstract a
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

  constrainImplicitInstance :: (Set MV) -> Type -> Type -> InferAbstract ()
  constrainImplicitInstance monos t1 t2 =
    InferAbstract $ tell [ActionConstrainImplicitInstance monos t1 t2]

freshInt :: InferAbstract Int
freshInt = InferAbstract $ do
  InferState { freshCounter } <- get
  let newValue = freshCounter + 1
  put $ InferState { freshCounter = newValue }
  return newValue

instance MonadFresh InferAbstract where
  freshMetaVar :: InferAbstract MV
  freshMetaVar = (MV . Fresh) <$> freshInt

instance MonadTypeError InferAbstract where
  throwTypeError :: forall a. TypeError -> InferAbstract a
  throwTypeError err = InferAbstract $ throwError err

instance MonadInfer InferAbstract where
  visit :: Expr s -> InferAbstract ()
  visit e = InferAbstract $ tell [ActionInfer (forget e)]
  annot :: Expr s -> Type -> InferAbstract Type
  annot e t = InferAbstract $ do
    tell [ActionAnnot (forget e) t]
    pure t

instance MonadDebug InferAbstract where
  debug :: Text -> InferAbstract()
  debug t = InferAbstract $ tell [ActionDebug t]

------------------------------------------------------------

data Result = Result {
    resultType :: Type,
    resultSubst :: SubstMV,
    resultConstrs :: [Constraint],
    resultActions :: [InferAction]
  }

hindleyMilner :: LocatedExpr -> Either TypeError Result
hindleyMilner e = do
  (partialType, state1, actionsInfer) <- runAbstract emptyTypeEnv state0 $ infer e
  let constrs = mapMaybe constrFromAction actionsInfer
  (subst, _, actionsSolve) <- runAbstract emptyTypeEnv state1 $ solve constrs
  pure $ Result {
    resultType = substMetaVars subst partialType,
    resultSubst = subst,
    resultConstrs = constrs,
    resultActions = actionsInfer ++ actionsSolve
  }
  where
    constrFromAction :: InferAction -> Maybe Constraint
    constrFromAction (ActionConstrainEqual t1 t2) = Just $ ConstrEqual t1 t2
    constrFromAction (ActionConstrainImplicitInstance monos t1 t2) = Just $ ConstrInstImplicit monos t1 t2
    constrFromAction (ActionConstrainExplicitInstance t sch) = Just $ ConstrInstExplicit t sch
    constrFromAction (ActionInfer _ ) = Nothing
    constrFromAction (ActionAnnot _ _) = Nothing
    constrFromAction (ActionDebug _) = Nothing

    emptyTypeEnv = TypeEnv Map.empty
    state0 = InferState { freshCounter = 0 }