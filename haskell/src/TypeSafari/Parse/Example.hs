module TypeSafari.Parse.Example where

import TypeSafari.Core
import Data.Text qualified as T
import TypeSafari.Pretty (Pretty(..))
import TypeSafari.Parse.Located (TextSpan(..))
import TypeSafari.Parse.Located qualified as L
import TypeSafari.RecursionSchemes.Mu (Mu (..), cata)

import Control.Monad.Combinators.Expr

import Text.Megaparsec as MP
import Data.Void

import Data.Aeson
import Data.Aeson.Types hiding (Parser)
import qualified TypeSafari.HindleyMilner.Syntax as Stx

------------------------------------------------------------

type Parser = MP.Parsec Void L.TextSpan

---- position annotations ----------------------------------

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

------------------------------------------------------------

class HasSpan p m where
  getSpan :: m -> Span p
  withSpan :: m -> (Span p, m)
  withSpan = toFst getSpan

instance HasSpan p (Expr (Span p)) where
  getSpan (InF (Var s _)) = s
  getSpan (InF (Lit s _)) = s
  getSpan (InF (BinExpr _ s _ _)) = s
  getSpan (InF (LetExpr s _ _ _)) = s
  getSpan (InF (LamExpr s _ _)) = s
  getSpan (InF (IfExpr s _ _ _)) = s
  getSpan (InF (App s _ _)) = s

instance HasSpan PosOffset TextSpan where
  getSpan (TextSpan a b _) = Span (PosOffset a) (PosOffset b)

------------------------------------------------------------

data BinOp
  = Add
  | Sub
  | Mul
  | Div

instance Pretty BinOp where
  pretty Add = "+"
  pretty Sub = "-"
  pretty Mul = "*"
  pretty Div = "/"

data Lit
  = LInt Integer
  | LBool Bool
  deriving stock (Show, Eq, Ord)

instance Pretty Lit where
  pretty (LInt x) = show x
  pretty (LBool b) = show b

data ExprF s a
  = Var s Stx.Name
  | Lit s Lit
  | App s a a
  | LamExpr s (s, Stx.Name) a
  | LetExpr s (s, Stx.Name) a a 
  | BinExpr BinOp s a a
  | IfExpr s a a a
  deriving stock (Functor)

type Expr s = Mu (ExprF s)

instance ToJSON (OffsetSpan) where
  toJSON (Span (PosOffset a) (PosOffset b)) =
    listValue id [Number (fromIntegral a), Number (fromIntegral b)]

instance ToJSON (Expr OffsetSpan) where
  toJSON = cata f
    where
      f :: ExprF OffsetSpan Value -> Value
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
      f (BinExpr op s e1 e2) = object [
          "tag"   .= ("BinExpr" :: Text)
        , "span" .= toJSON s
        , "op"    .= pretty op
        , "left"  .= toJSON e1
        , "right" .= toJSON e2 
        ]
      f (LamExpr s (sx,x) e) = object [
          "tag"   .= ("LamExpr" :: Text)
        , "span"  .= toJSON s
        , "name"  .= object [
            "name" .= x,
            "span" .= sx
          ]
        , "body" .= toJSON e
        ]
      f (LetExpr s (sx,x) e1 e2) = object [
          "tag"   .= ("LetExpr" :: Text)
        , "span"  .= toJSON s
        , "name"  .= object [
            "name" .= x,
            "span" .= sx
          ]
        , "equal" .= toJSON e1
        , "in"    .= toJSON e2
        ]
      f (IfExpr s econ etru efls) = object [
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

type LocatedExpr = Expr OffsetSpan

prettyWithSpan :: Pretty a => a -> OffsetSpan -> Text
prettyWithSpan x s = pretty x <> pretty s

prettyParen :: Pretty a => a -> Text
prettyParen x = "(" <> pretty x <> ")"

instance Pretty LocatedExpr where
  pretty :: LocatedExpr -> Text
  pretty (InF (Var s t)) = prettyWithSpan t s
  pretty (InF (Lit s v)) = prettyWithSpan v s
  pretty (InF (BinExpr op s e1 e2)) =
    (prettyWithSpan ("BinExpr" <> pretty op) s) <>
    " " <> prettyParen e1 <>
    " " <> prettyParen e2
  pretty (InF (LetExpr s (sx,x) e1 e2)) =
    (prettyWithSpan ("LetExpr" :: Text) s) <>
    " let " <> prettyWithSpan x sx <>
    " = " <> prettyParen e1 <>
    " in " <> prettyParen e2
  pretty (InF (LamExpr s (sx,x) e)) =
    (prettyWithSpan ("LetExpr" :: Text) s) <>
    " λ" <> prettyWithSpan x sx <>
    " -> " <> prettyParen e
  pretty (InF (IfExpr s econ etru efls)) =
    (prettyWithSpan ("IfExpr" :: Text) s) <>
    " if "   <> prettyParen econ <>
    " then " <> prettyParen etru <>
    " else " <> prettyParen efls
  pretty (InF (App s e1 e2)) =
    (prettyWithSpan ("IfExpr" :: Text) s) <>
    " " <> prettyParen e1 <>
    " " <> prettyParen e2

------------------------------------------------------------

parens :: Parser a -> Parser a
parens = MP.between (L.symbol "(") (L.symbol ")")


_backslash :: Parser TextSpan
_backslash = L.symbol "\\"

_arrow :: Parser TextSpan
_arrow = L.symbol "->"

_forall :: Parser TextSpan
_forall = L.symbol "forall"

_forallUnicode :: Parser TextSpan
_forallUnicode = L.symbol "∀"

_comma :: Parser TextSpan
_comma = L.symbol ","

_questionMark :: Parser TextSpan
_questionMark = L.symbol "?"

_let :: Parser TextSpan
_let = L.symbol "let"

_in :: Parser TextSpan
_in = L.symbol "in"

_if :: Parser TextSpan
_if = L.symbol "if"

_then :: Parser TextSpan
_then = L.symbol "then"

_else :: Parser TextSpan
_else = L.symbol "else"

_True :: Parser TextSpan
_True = L.symbol "True"

_False :: Parser TextSpan
_False = L.symbol "False"

_equal :: Parser TextSpan
_equal = L.symbol "="

_leftparen :: Parser TextSpan
_leftparen = L.symbol "("

_rightparen :: Parser TextSpan
_rightparen = L.symbol ")"

--------------------------------------------------------------------------------

integerP :: Parser LocatedExpr
integerP = InF <$> do
  (s, val) <- L.lexeme L.decimal
  pure $ Lit (getSpan s) (LInt val)

boolP :: Parser LocatedExpr
boolP = MP.choice [ mk True <$> _True, mk False <$> _False ]
  where
    mk :: Bool -> TextSpan -> LocatedExpr 
    mk b s = InF $ Lit (getSpan s) (LBool b)

------------------------------------------------------------

variableP :: Parser (LocatedExpr)
variableP = do
  (span, text) <- ident
  pure $ InF $ Var span (Stx.Name text)

ident :: Parser (OffsetSpan, Text)
ident = L.lexeme name >>= check
  where
    name :: Parser TextSpan
    name = L.cons <$> MP.satisfy L.isAlpha <*> MP.takeWhileP Nothing L.isAlphaNum
    reserved = ["forall", "let", "in", "if", "then", "else", "True", "False"]
    check :: TextSpan -> Parser (OffsetSpan, Text)
    check ts@TextSpan{..} =
      if tsText `elem` reserved
      then fail $ "keyword " ++ show tsText ++ " cannot be used as a variable name"
      else return (getSpan ts, tsText)

nameP :: Parser (OffsetSpan, Stx.Name)
nameP = do
  (s, t) <- ident
  return (s, Stx.Name t)

---- expressions -------------------------------------------

letExprP :: Parser LocatedExpr
letExprP = (InF <$> do
  Span p0 _ <- getSpan <$> _let
  (sx, x) <- nameP
  e1 <- (_equal *> simpleExprP)
  e2 <- (_in *> exprP)
  let Span _ p1 = getSpan e2
  return $ LetExpr (Span p0 p1) (sx, x) e1 e2) MP.<?> "let"

ifExprP :: Parser LocatedExpr
ifExprP = (InF <$> do
  Span p0 _ <- getSpan <$> _if
  econ <- simpleExprP
  etru <- _then *> simpleExprP
  efls <- _else *> simpleExprP
  let Span _ p1 = getSpan efls
  return $ IfExpr (Span p0 p1) econ etru efls) MP.<?> "if-then-else"

lamP :: Parser LocatedExpr
lamP = (InF <$> do
    Span p0 _ <- getSpan <$> _backslash
    name <- nameP
    body <- _arrow *> exprP
    let Span _ p1 = getSpan body
    return $ LamExpr (Span p0 p1) name body
  ) MP.<?> "lambda"

spineP :: Parser LocatedExpr
spineP = foldl1 go <$> MP.some simpleExprP MP.<?> "spine"
  where
    go :: LocatedExpr -> LocatedExpr -> LocatedExpr
    go e1 e2 = InF $ App (Span p0 p1) e1 e2
      where
        Span p0 _ = getSpan e1
        Span _ p1 = getSpan e2

------------------------------------------------------------

exprP :: Parser LocatedExpr
exprP = MP.choice [
    MP.try spineP,
    letExprP,
    ifExprP,
    lamP,
    MP.try arithExprP,
    boolP,
    variableP
  ] MP.<?> "expr"

simpleExprP :: Parser LocatedExpr
simpleExprP = MP.choice [
    parens exprP,
    MP.try arithExprP,
    boolP,
    integerP,
    variableP
  ] MP.<?> "simple expression"

-- arithmetic expressions
arithExprP :: Parser LocatedExpr
arithExprP = makeExprParser termP opTable MP.<?> "arithExpr"
  where
    termP :: Parser LocatedExpr
    termP = MP.choice
      [ parens exprP
      , variableP
      ]
    opTable :: [[Operator Parser LocatedExpr]]
    opTable =
      -- [ [ prefix "-" Stx.
      --   , prefix "+" id
      --   ]
      [ [ binary "*" (combine Mul)
        --, binary "/" Stx.Div
        ]
      , [ binary "+" (combine Add)
        , binary "-" (combine Sub)
        ]
      ]
    combine :: BinOp -> LocatedExpr -> LocatedExpr -> LocatedExpr
    combine op e1 e2 = InF $ BinExpr op (Span a1 b2) e1 e2
      where Span  a1 _b1 = getSpan e1
            Span _a2  b2 = getSpan e2
    binary :: Text -> (LocatedExpr -> LocatedExpr -> LocatedExpr) -> Operator Parser LocatedExpr
    binary name f = InfixL  (f <$ L.symbol name)

------------------------------------------------------------

newtype ParseResult = ParseResult
  { parsedExpr  :: LocatedExpr
  }

parse :: Text -> Either Text ParseResult
parse t =
  case result of
    Left peb -> Left . T.pack . show $ MP.errorBundlePretty peb
    Right expr -> Right $ ParseResult expr
  where result = MP.runParser (exprP <* MP.eof) "[filename]" (L.textSpan t)