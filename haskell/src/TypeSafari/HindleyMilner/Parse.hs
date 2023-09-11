module TypeSafari.HindleyMilner.Parse where

import Control.Monad.Combinators.Expr
  
import Text.Megaparsec ((<?>))
import Text.Megaparsec      qualified as MP
import Text.Megaparsec.Char qualified as MP
import qualified Text.Megaparsec.Char.Lexer as L

import Data.Void
import Data.Text (Text)
import Data.Text qualified as T
import Prelude

import TypeSafari.HindleyMilner.Syntax qualified as Stx
import TypeSafari.HindleyMilner.Infer (Type(..), TV (TvBound), MV (MV))
import TypeSafari.Pretty (Pretty(..))

--------------------------------------------------------------------------------

type Parser = MP.Parsec Void Text

sc :: Parser ()
sc = L.space MP.space1 MP.empty MP.empty

lexeme :: Parser a -> Parser a
lexeme = L.lexeme sc

symbol :: Text -> Parser Text
symbol = L.symbol sc

--------------------------------------------------------------------------------

_backslash :: Parser Text
_backslash = symbol "\\"

_arrow :: Parser Text
_arrow = symbol "->"

_forall :: Parser Text
_forall = symbol "forall"

_forallUnicode :: Parser Text
_forallUnicode = symbol "∀"

_comma :: Parser Text
_comma = symbol ","

_questionMark :: Parser Text
_questionMark = symbol "?"

_let :: Parser Text
_let = symbol "let"

_in :: Parser Text
_in = symbol "in"

_if :: Parser Text
_if = symbol "if"

_then :: Parser Text
_then = symbol "then"

_else :: Parser Text
_else = symbol "else"

_True :: Parser Text
_True = symbol "True"

_False :: Parser Text
_False = symbol "False"

_equal :: Parser Text
_equal = symbol "="

_leftparen :: Parser Text
_leftparen = symbol "("

_rightparen :: Parser Text
_rightparen = symbol ")"

--------------------------------------------------------------------------------

integerP :: Parser Stx.Expr
integerP = Stx.Lit . Stx.LInt <$> lexeme L.decimal

boolP :: Parser Stx.Expr
boolP = (Stx.Lit . Stx.LBool) <$>
          MP.choice [ 
            True <$ _True,
            False <$ _False
          ]

--------------------------------------------------------------------------------

nameP :: Parser Stx.Name
nameP = nameP0 >>= check
  where
    nameP0 = T.pack <$> lexeme ((:) <$> MP.letterChar <*> MP.many MP.alphaNumChar <?> "variable")
    check :: Text -> Parser Stx.Name
    check s =
      if s `elem` reserved
        then fail $ "keyword " ++ show s ++ " cannot be used as a variable name"
        else return (Stx.Name s)
      where 
        reserved = ["forall", "let", "in", "if", "then", "else", "True", "False"]

variableP :: Parser Stx.Expr
variableP = MP.try $ Stx.Var <$> nameP

parens :: Parser a -> Parser a
parens = MP.between (symbol "(") (symbol ")")

---- types -------------------------------------------------

-- TODO: validate that type var is bound by a forall
typeVarP :: Parser TV
typeVarP = TvBound <$> (lexeme L.decimal) <?> "type variable"

metaVarP :: Parser MV
metaVarP = MV <$> (_questionMark *> nameP) <?> "metavariable"

typeConstructorP :: Parser Type
typeConstructorP = (do
  (Stx.Name t) <- nameP
  pure $ TypeCon t)  <?> "type constructor"

typeP :: Parser Type
typeP = MP.choice [
    typeArrowP,
    parens typeP,
    TypeVar <$> typeVarP,
    TypeMetaVar <$> metaVarP,
    typeConstructorP
  ]

-- arithmetic expressions
typeArrowP :: Parser Type
typeArrowP = makeExprParser termP opTable
  where
    termP :: Parser Type
    termP = MP.choice
      [ parens typeP
      , TypeVar <$> typeVarP
      , TypeMetaVar <$> metaVarP
      , typeConstructorP
      ]
    opTable :: [[Operator Parser Type]]
    opTable = [ [ InfixR (TypeArr <$ _arrow) ] ]

---- expressions -------------------------------------------

letExprP :: Parser Stx.Expr
letExprP =
  (Stx.Let <$>
    (_let *> nameP) <*>
    (_equal *> simpleExprP) <*>
    (_in *> exprP))  <?> "let"

ifExprP :: Parser Stx.Expr
ifExprP =
  (Stx.If <$>
    (_if *> simpleExprP) <*> 
    (_then *> simpleExprP) <*>
    (_else *> simpleExprP))  <?> "if-then-else"

spineP :: Parser Stx.Expr
spineP = foldl1 Stx.App <$> MP.some simpleExprP <?> "spine"

lamP :: Parser Stx.Expr
lamP = Stx.Lam <$> (_backslash *> nameP) <*> (_arrow *> exprP) <?> "lambda"

exprP :: Parser Stx.Expr
exprP =
  MP.choice [
    MP.try spineP,
    arithExprP,
    letExprP,
    lamP,
    ifExprP,
    boolP,
    variableP
  ] <?> "expr"

simpleExprP :: Parser Stx.Expr
simpleExprP = MP.choice [ parens exprP, arithExprP, variableP, boolP, integerP ]

------------------------------------------------------------

-- arithmetic expressions
arithExprP :: Parser Stx.Expr
arithExprP = makeExprParser termP opTable
  where
    termP :: Parser Stx.Expr
    termP = MP.choice
      [ parens exprP
      , variableP
      , integerP
      ]
    opTable :: [[Operator Parser Stx.Expr]]
    opTable =
      -- [ [ prefix "-" Stx.
      --   , prefix "+" id
      --   ]
      [ [ binary "*" (Stx.Op Stx.Mul)
        --, binary "/" Stx.Div
        ]
      , [ binary "+" (Stx.Op Stx.Add)
        , binary "-" (Stx.Op Stx.Sub)
        ]
      ]
    binary :: Text -> (Stx.Expr -> Stx.Expr -> Stx.Expr) -> Operator Parser Stx.Expr
    binary name f = InfixL  (f <$ symbol name)

    -- prefix, postfix :: Text -> (Stx.Expr -> Stx.Expr) -> Operator Parser Stx.Expr
    -- prefix  name f = Prefix  (f <$ symbol name)
    -- postfix name f = Postfix (f <$ symbol name)

------------------------------------------------------------

newtype ParseResult = ParseResult
  { parsedExpr  :: Stx.Expr
  } deriving stock (Show, Eq)

parse :: Text -> Either Text ParseResult
parse t =
  case MP.runParser (exprP <* MP.eof) "[result]" t of
    Left peb -> Left . T.pack $ MP.errorBundlePretty peb
    Right x -> Right $ ParseResult x

------------------------------------------------------------

newtype ParseTypeResult = ParseTypeResult
  { parsedType :: Type
  } deriving stock (Show, Eq)

parseType :: Text -> Either Text ParseTypeResult
parseType t =
  case MP.runParser (typeP <* MP.eof) "[result]" t of
    Left peb -> Left . T.pack $ MP.errorBundlePretty peb
    Right x -> Right $ ParseTypeResult x

tryParse :: Pretty a => (Parser a) -> Text -> Text
tryParse p t =
  case MP.runParser (p <* MP.eof) "[test]" t of
    Left peb -> (T.pack . MP.errorBundlePretty) peb
    Right x -> pretty x