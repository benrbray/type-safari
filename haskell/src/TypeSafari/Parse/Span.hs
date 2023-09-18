module TypeSafari.Parse.Span where

import TypeSafari.Core
import TypeSafari.Pretty (Pretty(..))
import Data.Aeson.Types (ToJSON (..), listValue, Value (..))

------------------------------------------------------------

newtype PosOffset = PosOffset {
    posOffset :: Int
  } deriving stock (Eq, Ord)

instance Pretty PosOffset where
  pretty (PosOffset p) = show p

data PosLineCol = PosLineCol
  { posLine :: !Int
  , posCol  :: !Int
  } deriving stock (Eq, Ord)

instance Pretty PosLineCol where
  pretty :: PosLineCol -> Text
  pretty PosLineCol{..} = "l" <> show posLine <> "c" <> show posCol

data Span p = Span
  { spanStart :: p
  , spanEnd   :: p
  } deriving stock (Eq, Ord)


instance Pretty p => Pretty (Span p) where
  pretty :: Span p -> Text
  pretty Span{..} =
    "[" <> pretty spanStart <> "-" <> pretty spanEnd <> "]"

type OffsetSpan = Span PosOffset
type LineColSpan = Span PosLineCol

emptyLineColSpan :: Span PosLineCol
emptyLineColSpan = Span (PosLineCol 0 0) (PosLineCol 0 0)

emptyOffsetSpan :: Span PosOffset
emptyOffsetSpan = Span (PosOffset 0) (PosOffset 0)

instance ToJSON (OffsetSpan) where
  toJSON (Span (PosOffset a) (PosOffset b)) =
    listValue id [Number (fromIntegral a), Number (fromIntegral b)]

------------------------------------------------------------

class HasSpan p m where
  getSpan :: m -> Span p
  withSpan :: m -> (Span p, m)
  withSpan = toFst getSpan
