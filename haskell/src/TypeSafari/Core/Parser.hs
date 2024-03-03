module TypeSafari.Core.Parser where

import Control.Applicative hiding (some, many)

import TypeSafari.Core
import Text.Megaparsec.Char.Lexer qualified as L
import Text.Megaparsec.Char (char)

import Text.Megaparsec ((<?>))
import Text.Megaparsec      qualified as MP
import Text.Megaparsec.Char qualified as MP

-- import Data.Aeson.Types (ToJSON)
import Data.Void (Void)
import Data.Functor (void)

-- import TypeSafari.RecursionSchemes.Mu (Mu(..))
import TypeSafari.Parse.Span (Span(..), Pos(..), Span)
import Control.Monad.State (State, MonadState (..))

------------------------------------------------------------

type Parser = MP.ParsecT Void Text (State Pos)

putNonSpacePos :: Pos -> Parser ()
putNonSpacePos = put

getNonSpacePos :: Parser Pos
getNonSpacePos = get

getPos :: Parser Pos
getPos = Pos . MP.stateOffset <$> MP.getParserState

withSpan :: Parser a -> Parser (Span, a)
withSpan p = do
  p0 <- getPos
  foo <- p
  p1 <- getNonSpacePos
  return (Span p0 p1, foo)

---- whitespace --------------------------------------------

-- spaces and newlines
scn :: Parser ()
scn = L.space whitespace lineComment MP.empty
  where
    whitespace = void $ MP.some (char ' ' <|> char '\t' <|> char '\n')
    lineComment = L.skipLineComment "--"

-- spaces only, not newlines
sc :: Parser ()
sc = L.space whitespace lineComment empty
  where
    whitespace = (void $ MP.some (char ' ' <|> char '\t'))
    lineComment = L.skipLineComment "--"

---- terminals ---------------------------------------------

-- Note: all terminals should be built from @lexeme@, so
-- that source spans are properly computed.

-- consume a lexeme and trailing whitespace, but record
-- the position before the whitespace in the parse state
lexeme :: Parser a -> Parser a
lexeme parser = do
  x <- parser
  putNonSpacePos =<< getPos <* scn
  return x

symbol ::
  Text ->  -- symbol to parse
  Parser Text
symbol = lexeme . MP.string
{-# INLINEABLE symbol #-}

--------------------------------------------------------------------------------

_backslash :: Parser Text
_backslash = symbol "\\"

_arrow :: Parser Text
_arrow = symbol "->"

_forall :: Parser Text
_forall = MP.choice [ symbol "forall", symbol "∀" ]

_comma :: Parser Text
_comma = symbol ","

_dot :: Parser Text
_dot = symbol "."

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

integerP0 :: Parser (Span, Integer)
integerP0 = withSpan (lexeme L.decimal) <?> "integer"

boolP0 :: Parser (Span, Bool)
boolP0 = withSpan (MP.choice [ True <$ _True, False <$ _False ]) <?> "boolean"

--------------------------------------------------------------------------------

failReservedKeyword :: Text -> Parser Text
failReservedKeyword s =
  if s `elem` reserved
    then fail $ "keyword " ++ show s ++ " cannot be used as a variable name"
    else return s
  where
    reserved = ["forall", "let", "in", "if", "then", "else", "True", "False"]