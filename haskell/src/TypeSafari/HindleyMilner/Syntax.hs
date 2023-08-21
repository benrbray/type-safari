module TypeSafari.HindleyMilner.Syntax where

import Data.Text (Text)
import GHC.Generics (Generic)
import Data.Aeson
import Prelude

--------------------------------------------------------------------------------

type Name = Text

data Expr
  = Var Name
  | App Expr Expr
  | Lam Name Expr
  | Let Name Expr Expr
  deriving stock (Eq, Show, Generic)

instance ToJSON Expr where
  toJSON (Var x) =
    object [ "tag"  .= ("Var" :: Text)
           , "name" .= x
           ]
  toJSON (App e1 e2) =
    object [ "tag"   .= ("App" :: Text)
           , "left"  .= e1
           , "right" .= e2
           ]
  toJSON (Lam x e) =
    object [ "tag"  .= ("Lam" :: Text)
           , "name" .= x
           , "expr" .= e
           ]
  toJSON (Let x e1 e2) =
    object [ "tag"    .= ("Let" :: Text)
           , "name"   .= x
           , "equals" .= e1
           , "in"     .= e2
           ]