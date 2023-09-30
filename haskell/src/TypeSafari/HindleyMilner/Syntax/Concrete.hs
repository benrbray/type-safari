module TypeSafari.HindleyMilner.Syntax.Concrete where

import Data.Aeson
import Data.Map qualified as Map

import TypeSafari.Core
import TypeSafari.Parse.Span (Span, HasSpan (..))
import TypeSafari.Pretty (Pretty (..))
import TypeSafari.RecursionSchemes.Mu (Mu(..), cata)
import TypeSafari.HindleyMilner.Syntax.Type qualified as Stx
import TypeSafari.HindleyMilner.Syntax.Core qualified as Stx
import Control.Monad.Trans.Reader (ReaderT (..), ask, local)
import Control.Monad.Trans.Class (lift)
import GHC.Generics (Generic)

------------------------------------------------------------

data SyntaxError s
  = UnboundVariable s Name
  | ExpectedMonoType s
  deriving stock (Generic)
  deriving anyclass (ToJSON)

---- concrete syntax for types -----------------------------

newtype Name
  = Name Text
  deriving stock (Show, Eq, Ord)

data TypeF s a
  = TypeVar s Name
  | TypeMetaVar s Name
  | TypeCon s Name
  | TypeArr s a a 
  -- TODO should TypeArr be kept when we already have RhoArr?
  -- for parsing, probably not...
  -- ...but perhaps for inference perhaps the reedundancy is helpful
  -- so that we can preprocess any RhoArrs between empty foralls into MonoTypes
  deriving stock (Show, Eq, Ord, Functor)

type MonoType s = Mu (TypeF s)

-- | the term "rho type" comes from Peyton-Jones 2007 
-- (the RhoArr constructor introduces higher-rank types)
data RhoType s
  = RhoMono s (MonoType s)               -- type scheme 
  | RhoArr s (PolyType s) (PolyType s) -- function type
  deriving stock (Eq)

-- universally-quantified polymorphic type 
data PolyType s
  = Forall s [Name] (RhoType s)
  deriving stock (Eq)

-- type annotated with source spans
type LocatedType = PolyType Span

---- concrete -> abstract syntax ---------------------------

class MonadDeBruijn m where
  -- runs the given action in a context where the given name
  -- occupies the next highest de Bruijn level 
  withBinding :: Name -> m a -> m a

  getDeBruijnIndex :: Name -> m (Maybe Int)
  currentDeBruijnLevel :: m Int

withBindings :: MonadDeBruijn m => [Name] -> m a -> m a
withBindings xs e = foldr withBinding e xs

instance MonadDeBruijn ConvertM where
  withBinding x =
    mapExceptT $
      local (\(level, ctx) ->
        let nextLevel = level + 1 in
        (nextLevel, Map.insert x nextLevel ctx))
  
  -- The state records of the current level and a map of names
  -- to levels. To get the index of a name in the current scope,
  -- we subtract its level from the current level
  getDeBruijnIndex x = do
    (_, ctx) <- lift ask
    currentLevel <- currentDeBruijnLevel
    pure $ (currentLevel -) <$> Map.lookup x ctx

  currentDeBruijnLevel = fst <$> lift ask

type ConvertM = ExceptT (SyntaxError Span) (ReaderT (Int, Map Name Int) Identity)

runConvert :: ConvertM a -> Either (SyntaxError Span) a
runConvert = runIdentity . (`runReaderT` (0, Map.empty)) . runExceptT

type MonadConvert s m = (
    MonadError (SyntaxError s) m,
    MonadDeBruijn m
  )

convertMono :: MonadConvert s m => MonoType s -> m Stx.Type
convertMono = cata $ \case
  TypeVar s x -> getDeBruijnIndex x >>= \case
    Nothing -> throwError (UnboundVariable s x) 
    Just j  -> pure $ Stx.TypeVar (Stx.TvBound j)
  TypeMetaVar _ (Name x) ->
    pure $ Stx.TypeMetaVar . Stx.MV . Stx.Name $ x
  TypeCon _ (Name x) ->
    pure $ Stx.TypeCon x
  TypeArr _ t1 t2 -> do
    m1 <- t1
    m2 <- t2
    pure $ Stx.TypeArr m1 m2

expectMono :: (MonadConvert s m) => PolyType s -> m Stx.Type
expectMono (Forall _ [] (RhoMono _ t)) = convertMono t
expectMono (Forall _ [] (RhoArr _ t1 t2)) = do
  m1 <- expectMono t1
  m2 <- expectMono t2
  return $ Stx.TypeArr m1 m2
expectMono (Forall s _ _) = throwError (ExpectedMonoType s)

convertPoly :: (MonadConvert s m) => PolyType s -> m Stx.TypeScheme
convertPoly (Forall _ tvs (RhoMono _ t)) =
  withBindings tvs $
    Stx.Forall (length tvs) <$> (convertMono t)
convertPoly (Forall _ tvs (RhoArr _ t1 t2)) =
  withBindings tvs $ do
    m1 <- expectMono t1
    m2 <- expectMono t2
    pure $ Stx.Forall (length tvs) (Stx.TypeArr m1 m2)

------------------------------------------------------------

instance HasSpan (MonoType Span) where
  getSpan (InF (TypeVar s _)) = s
  getSpan (InF (TypeMetaVar s _)) = s
  getSpan (InF (TypeCon s _)) = s
  getSpan (InF (TypeArr s _ _)) = s

instance HasSpan (RhoType Span) where
  getSpan (RhoMono s _) = s
  getSpan (RhoArr s _ _) = s

instance HasSpan (PolyType Span) where
  getSpan (Forall s _ _) = s

------------------------------------------------------------

instance Pretty Name where
  pretty (Name t) = t

instance Pretty (MonoType Span) where
  pretty :: MonoType Span -> Text
  pretty = cata $ \case
    (TypeVar _ x) -> pretty x
    (TypeMetaVar _ x) -> pretty x
    (TypeCon _ x) -> pretty x
    (TypeArr _ t1 t2) -> pretty t1 <> " -> " <> pretty t2

instance Pretty (RhoType Span) where
  pretty :: RhoType Span -> Text
  pretty (RhoMono _ t) = pretty t
  pretty (RhoArr _ t1 t2) = pretty t1 <> "->" <> pretty t2

instance Pretty (PolyType Span) where
  pretty :: PolyType Span -> Text
  pretty (Forall _ tvs t) =
    "forall " <> pretty tvs <> ", " <> pretty t

------------------------------------------------------------

instance ToJSON Name where
  toJSON (Name t) = String t

instance ToJSON (MonoType Span) where
  toJSON = cata $ \case
    TypeVar s x -> object [
        "tag"  .= ("TypeVar" :: Text)
      , "span" .= toJSON s
      , "name" .= x
      ]
    TypeMetaVar s x -> object [
        "tag"  .= ("TypeMetaVar" :: Text)
      , "span" .= toJSON s
      , "name" .= x
      ]
    TypeCon s x -> object [
        "tag"  .= ("TypeCon" :: Text)
      , "span" .= toJSON s
      , "name" .= x
      ]
    TypeArr s t1 t2 -> object [
        "tag"  .= ("TypeArr" :: Text)
      , "span" .= toJSON s
      , "t1"   .= toJSON t1
      , "t2"   .= toJSON t2
      ]

instance ToJSON (RhoType Span) where
  toJSON (RhoMono s t) = object [
      "tag"      .= ("RhoMono" :: Text)
    , "span"     .= toJSON s
    , "type"     .= toJSON t
    ]
  toJSON (RhoArr s t1 t2) = object [
      "tag"      .= ("RhoArr" :: Text)
    , "span"     .= toJSON s
    , "t1"     .= toJSON t1
    , "t2"     .= toJSON t2
    ]

instance ToJSON (PolyType Span) where
  toJSON (Forall s tvs t) = object [
      "tag"      .= ("PolyType" :: Text)
    , "span"     .= toJSON s
    , "typeVars" .= toJSON tvs
    , "type"     .= toJSON t
    ]