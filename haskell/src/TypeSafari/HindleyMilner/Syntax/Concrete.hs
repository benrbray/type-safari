module TypeSafari.HindleyMilner.Syntax.Concrete where

import TypeSafari.Core
import TypeSafari.RecursionSchemes.Mu (Mu(..), cata)
import TypeSafari.Parse.Span (Span)
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
  deriving stock (Show, Eq, Ord, Functor)

type Type s = Mu (TypeF s)

---- type annotated with source spans ----------------------

type LocatedType = Type Span

instance Pretty Name where
  pretty (Name t) = t

instance Pretty LocatedType where
  pretty :: LocatedType -> Text
  pretty = cata $ \case
    (TypeVar _ x) -> pretty x
    (TypeMetaVar _ x) -> pretty x
    (TypeCon _ x) -> pretty x
    (TypeArr _ t1 t2) -> pretty t1 <> " -> " <> pretty t2

instance ToJSON Name where
  toJSON (Name t) = String t

instance ToJSON LocatedType where
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