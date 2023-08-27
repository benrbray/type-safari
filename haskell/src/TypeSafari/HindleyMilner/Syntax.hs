module TypeSafari.HindleyMilner.Syntax where

import Data.Aeson

import TypeSafari.Core
import TypeSafari.Pretty

--------------------------------------------------------------------------------

data Name
  = Name Text
  | Fresh Int
  deriving stock (Show, Eq, Ord)

instance Pretty Name where
  pretty :: Name -> Text
  pretty (Name n) = n
  pretty (Fresh i) = "#" <> show i

data Expr
  = Var Name            -- variable
  | App Expr Expr       -- application
  | Lam Name Expr       -- lambda
  | Let Name Expr Expr  -- let x = e1 in e2
  | Lit Lit             -- literal
  | If Expr Expr Expr   -- if then else
  | Fix Expr            -- fixpoint
  | Op Binop Expr Expr  -- binary operator
  deriving stock (Show, Eq, Ord)

data Lit
  = LInt Integer
  | LBool Bool
  deriving stock (Show, Eq, Ord)

data Binop
  = Add | Sub | Mul | Eql
  deriving stock (Show, Eq, Ord)

instance Pretty Binop where
  pretty :: Binop -> Text
  pretty Add = "+"
  pretty Sub = "-"
  pretty Mul = "*"
  pretty Eql = "="

type Decl
  = (Text, Expr)

data Program
  = Program [Decl] Expr
  deriving stock (Show, Eq, Ord)

------------------------------------------------------------

instance ToJSON Name where
  toJSON n = String (pretty n)

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
  toJSON (Lit (LInt i)) = 
    object [ "tag" .= ("LInt" :: Text)
           , "value" .= Number (fromInteger i)
           ]
  toJSON (Lit (LBool b)) = 
    object [ "tag" .= ("LBool" :: Text)
           , "value" .= Bool b
           ]
  toJSON (If cond etrue efalse) =
    object [ "tag"    .= ("If" :: Text)
           , "cond"   .= cond
           , "true"   .= etrue
           , "false"  .= efalse
           ]
  toJSON (Op op eleft eright) =
    object [ "tag"   .= ("Op" :: Text)
           , "op"    .= pretty op
           , "left"  .= eleft
           , "right" .= eright
           ]
  toJSON _ =
    object [ ]