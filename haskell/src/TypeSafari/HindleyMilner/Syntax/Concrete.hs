module TypeSafari.HindleyMilner.Syntax.Concrete where

import TypeSafari.Core
import TypeSafari.RecursionSchemes.Mu (Mu(..), cata)
import TypeSafari.Parse.Span (Span, HasSpan (..))
import TypeSafari.Pretty (Pretty (..))
import Data.Aeson

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

---- type annotated with source spans ----------------------

type LocatedType = PolyType Span

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