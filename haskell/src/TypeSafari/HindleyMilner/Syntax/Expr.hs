module TypeSafari.HindleyMilner.Syntax.Expr where

import Data.Aeson

import TypeSafari.Core
import TypeSafari.Pretty
import TypeSafari.RecursionSchemes.Mu (Mu(..), cata)
import TypeSafari.Parse.Span (HasSpan (..), Span(..), Span)
import TypeSafari.HindleyMilner.Syntax.Core

------------------------------------------------------------

data Lit
  = LInt Integer
  | LBool Bool
  deriving stock (Show, Eq, Ord)

data BinOp
  = Add | Sub | Mul | Eql
  deriving stock (Show, Eq, Ord)

data ExprF s a
  = Var s Name           -- term variable
  | Lit s Lit            -- literal
  | App s a a            -- application
  | Lam s (s, Name) a    -- lambda abstraction
  | Let s (s, Name) a a  -- let x = e1 in e2
  | If s a a a           -- if then else
  | Bin BinOp s a a      -- TODO binops should be sugar for App
  deriving stock (Show, Eq, Ord, Functor)

-- TODO (Ben @ 2023/09/15) convert to Cofree?
type Expr s = Mu (ExprF s)

type Expr0 = Expr ()

type LocatedExpr = Expr Span

-- forget all annotations in the syntax tree
forget :: Expr s -> Expr0
forget = cata (InF . f)
  where
    f (Var _ x) = Var () x
    f (Lit _ l) = Lit () l
    f (App _ e1 e2) = App () e1 e2
    f (Lam _ (_, x) e) = Lam () ((), x) e
    f (Let _ (_, x) e1 e2) = Let () ((), x) e1 e2
    f (Bin op _ e1 e2) = Bin op () e1 e2
    f (If _ econ etru efls) = If () econ etru efls 

------------------------------------------------------------

data Simple
  = SVar Name
  | SApp Simple Simple
  | SLam Name Simple
  | SOther

class SimpleExpr e where
  simplify :: e -> Simple

instance SimpleExpr (Expr s) where
  simplify (InF (Var _ x)) = SVar x
  simplify (InF (App _ e1 e2)) = SApp (simplify e1) (simplify e2)
  simplify (InF (Lam _ (_,x) e)) = SLam x (simplify e)
  simplify _ = SOther

pattern EVar :: SimpleExpr e => Name -> e
pattern EVar x <- (simplify -> SVar x)

pattern EApp :: SimpleExpr e => Simple -> Simple -> e
pattern EApp e1 e2 <- (simplify -> SApp e1 e2)

pattern ELam :: SimpleExpr e => Name -> Simple -> e
pattern ELam x ebody <- (simplify -> SLam x ebody)

pattern EOther :: SimpleExpr e => e
pattern EOther <- (simplify -> SOther)

{-# COMPLETE EVar, EApp, ELam, EOther #-}

-- foo :: SimpleExpr e => e -> Text
-- foo (EVar x) = "var"
-- foo (EApp e1 e2) = "app"
-- foo (ELam x e) = "lam"
-- foo (EOther) = "other"

------------------------------------------------------------

instance HasSpan (Expr Span) where
  getSpan (InF (Var s _)) = s
  getSpan (InF (Lit s _)) = s
  getSpan (InF (Bin _ s _ _)) = s
  getSpan (InF (Let s _ _ _)) = s
  getSpan (InF (Lam s _ _)) = s
  getSpan (InF (If s _ _ _)) = s
  getSpan (InF (App s _ _)) = s

------------------------------------------------------------

instance Pretty BinOp where
  pretty :: BinOp -> Text
  pretty Add = "+"
  pretty Sub = "-"
  pretty Mul = "*"
  pretty Eql = "="

instance Pretty Lit where
  pretty (LInt i)  = show i
  pretty (LBool b) = show b

instance Pretty (Expr s) where
  pretty = cata $ \case
    (Var _ n)              -> pretty n
    (App _ e1 e2)          -> e1 <> " " <> e2
    (Lam _ (_,n) e)        -> "(λ" <> pretty n <> " → " <> e <> ")"
    (Let _ (_,n) e1 e2)    -> "(let " <> pretty n <> " = " <> e1 <> " in " <> e2 <> ")"
    (Lit _ lit)            -> pretty lit
    (If _ econd etru efls) -> "(if " <> econd <> " then " <> etru <> " else " <> efls <> ")"
    (Bin op _ e1 e2)       -> "(" <> e1 <> " " <> pretty op <> " " <> e2 <> ")"

------------------------------------------------------------

instance ToJSON (Expr Span) where
  toJSON = cata f
    where
      f :: ExprF Span Value -> Value
      f (Var s t) = object [
          "tag"  .= ("Var" :: Text)
        , "span" .= toJSON s
        , "name" .= t
        ]
      f (Lit s v) = object [
          "tag"  .= ("Lit" :: Text)
        , "span" .= toJSON s
        , "value" .= pretty v
        ]
      f (Bin op s e1 e2) = object [
          "tag"   .= ("BinExpr" :: Text)
        , "span" .= toJSON s
        , "op"    .= pretty op
        , "left"  .= toJSON e1
        , "right" .= toJSON e2 
        ]
      f (Lam s (sx,x) e) = object [
          "tag"   .= ("LamExpr" :: Text)
        , "span"  .= toJSON s
        , "name"  .= object [
            "name" .= x,
            "span" .= sx
          ]
        , "body" .= toJSON e
        ]
      f (Let s (sx,x) e1 e2) = object [
          "tag"   .= ("LetExpr" :: Text)
        , "span"  .= toJSON s
        , "name"  .= object [
            "name" .= x,
            "span" .= sx
          ]
        , "equal" .= toJSON e1
        , "in"    .= toJSON e2
        ]
      f (If s econ etru efls) = object [
          "tag"   .= ("IfExpr" :: Text)
        , "span"  .= toJSON s
        , "econ" .= toJSON econ
        , "etru" .= toJSON etru
        , "efls" .= toJSON efls
        ]
      f (App s e1 e2) = object [
          "tag"   .= ("App" :: Text)
        , "span"  .= toJSON s
        , "e1" .= toJSON e1
        , "e2" .= toJSON e2
        ]