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
  getSpan (InF (Ident s _)) = s
  getSpan (InF (BinExpr _ s _ _)) = s

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

data ExprF s a
  = Ident s Text
  | BinExpr BinOp s a a
  deriving stock (Functor)

type Expr s = Mu (ExprF s)

foo :: Value
foo = Number 6

instance ToJSON (OffsetSpan) where
  toJSON (Span (PosOffset a) (PosOffset b)) =
    listValue id [Number (fromIntegral a), Number (fromIntegral b)]

instance ToJSON (Expr OffsetSpan) where
  toJSON = cata f
    where
      f :: ExprF OffsetSpan Value -> Value
      f (Ident s t) = object [
          "tag"  .= ("Ident" :: Text)
        , "span" .= toJSON s
        , "name" .= t
        ]
      f (BinExpr op s e1 e2) = object [
          "tag"   .= ("BinExpr" :: Text)
        , "span" .= toJSON s
        , "op"    .= pretty op
        , "left"  .= toJSON e1
        , "right" .= toJSON e2 
        ]

type LocatedExpr = Expr OffsetSpan

prettyWithSpan :: Pretty a => a -> OffsetSpan -> Text
prettyWithSpan x s = pretty x <> pretty s

prettyParen :: Pretty a => a -> Text
prettyParen x = "(" <> pretty x <> ")"

instance Pretty LocatedExpr where
  pretty :: LocatedExpr -> Text
  pretty (InF (Ident s t)) = prettyWithSpan t s
  pretty (InF (BinExpr op s e1 e2)) =
    (prettyWithSpan ("BinExpr" <> pretty op) s) <>
    " " <> prettyParen e1 <>
    " " <> prettyParen e2

------------------------------------------------------------

identP :: Parser (LocatedExpr)
identP = do
  (span, text) <- ident
  pure $ InF $ Ident span text

ident :: Parser (OffsetSpan, Text)
ident = L.lexeme name >>= check
  where
    name :: Parser TextSpan
    name = L.cons <$> MP.satisfy L.isAlpha <*> MP.takeWhileP Nothing L.isAlphaNum
    reserved = ["fun", "forall", "Type"]
    check :: TextSpan -> Parser (OffsetSpan, Text)
    check ts@TextSpan{..} =
      if tsText `elem` reserved
      then fail $ "keyword " ++ show tsText ++ " cannot be used as a variable name"
      else return (getSpan ts, tsText)

------------------------------------------------------------

parens :: Parser a -> Parser a
parens = MP.between (L.symbol "(") (L.symbol ")")

exprP :: Parser LocatedExpr
exprP = MP.choice [
    arithExprP,
    identP
  ]

-- arithmetic expressions
arithExprP :: Parser LocatedExpr
arithExprP = makeExprParser termP opTable
  where
    termP :: Parser LocatedExpr
    termP = MP.choice
      [ parens exprP
      , identP
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
  where result = MP.runParser (arithExprP <* MP.eof) "[filename]" (L.textSpan t)
        -- lines = map ( (1 +) . T.length ) $ T.lines t