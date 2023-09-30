module TypeSafari.HindleyMilner.Syntax.Core where

import Data.Aeson

import TypeSafari.Core
import TypeSafari.Pretty

------------------------------------------------------------

data Name
  = Name Text
  | Fresh Int
  deriving stock (Show, Eq, Ord)

instance Pretty Name where
  pretty :: Name -> Text
  pretty (Name n) = n
  pretty (Fresh i) = "#" <> show i

instance ToJSON Name where
  toJSON :: Name -> Value
  toJSON n = String (pretty n)