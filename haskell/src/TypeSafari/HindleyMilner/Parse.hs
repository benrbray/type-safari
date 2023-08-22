module TypeSafari.HindleyMilner.Parse where
  
import Text.Megaparsec ((<?>))
import Text.Megaparsec      qualified as MP
import Text.Megaparsec.Char qualified as MP
import qualified Text.Megaparsec.Char.Lexer as L

import Data.Void
import Data.Text (Text)
import Data.Text qualified as T
import Prelude

import TypeSafari.HindleyMilner.Syntax qualified as Stx

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

_let :: Parser Text
_let = symbol "let"

_in :: Parser Text
_in = symbol "in"

_equal :: Parser Text
_equal = symbol "="

_leftparen :: Parser Text
_leftparen = symbol "("

_rightparen :: Parser Text
_rightparen = symbol ")"

--------------------------------------------------------------------------------

integer :: Parser Integer
integer = lexeme L.decimal

--------------------------------------------------------------------------------

nameP :: Parser Stx.Name
nameP = nameP0 >>= check
  where
    nameP0 = T.pack <$> lexeme ((:) <$> MP.letterChar <*> MP.many MP.alphaNumChar <?> "variable")
    reserved = ["let", "in"]
    check :: Text -> Parser Stx.Name
    check s =
      if s `elem` reserved
      then fail $ "keyword " ++ show s ++ " cannot be used as a variable name"
      else return (Stx.Name s)

variableP :: Parser Stx.Expr
variableP = Stx.Var <$> nameP

parens :: Parser a -> Parser a
parens = MP.between (symbol "(") (symbol ")")

letExprP :: Parser Stx.Expr
letExprP = Stx.Let <$> (_let *> nameP) <*> (_equal *> simpleExprP) <*> (_in *> exprP)

spineP :: Parser Stx.Expr
spineP = foldl1 Stx.App <$> MP.some simpleExprP

lamP :: Parser Stx.Expr
lamP = Stx.Lam <$> (_backslash *> nameP) <*> (_arrow *> exprP)

exprP :: Parser Stx.Expr
exprP =
  MP.choice [
    MP.try spineP,
    letExprP,
    lamP,
    variableP
  ]

simpleExprP :: Parser Stx.Expr
simpleExprP = MP.choice [ variableP, parens exprP ]

------------------------------------------------------------

newtype ParseResult = ParseResult
  { parsedExpr  :: Stx.Expr
  } deriving stock (Show, Eq)

parse :: Text -> Either Text ParseResult
parse t =
  case MP.runParser (exprP <* MP.eof) "[demo]" t of
    Left peb -> Left . T.pack . show $ MP.errorBundlePretty peb
    Right x -> Right $ ParseResult x