module TypeSafari.Parse.Span where

import TypeSafari.Core
import TypeSafari.Pretty (Pretty(..))
import Data.Aeson.Types (ToJSON (..), listValue, Value (..))

------------------------------------------------------------

newtype Pos
  = Pos Int
  deriving stock (Eq, Ord)

instance Pretty Pos where
  pretty (Pos p) = show p

data Span = Span
  { spanStart :: Pos
  , spanEnd   :: Pos
  } deriving stock (Eq, Ord)


instance Pretty Span where
  pretty :: Span -> Text
  pretty Span{..} =
    "[" <> pretty spanStart <> "-" <> pretty spanEnd <> "]"

emptySpan :: Span
emptySpan = Span (Pos 0) (Pos 0)

instance ToJSON (Span) where
  toJSON (Span (Pos a) (Pos b)) =
    listValue id [Number (fromIntegral a), Number (fromIntegral b)]

------------------------------------------------------------

class HasSpan m where
  getSpan :: m -> Span
  withSpan :: m -> (Span, m)
  withSpan = toFst getSpan