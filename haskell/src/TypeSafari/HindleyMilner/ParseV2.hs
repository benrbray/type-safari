module TypeSafari.HindleyMilner.ParseV2 where

import Control.Applicative hiding (some, many)

import TypeSafari.Core
import Text.Megaparsec.Char.Lexer qualified as L
import Text.Megaparsec.Char (char)

import Control.Monad.Combinators.Expr
  
import Text.Megaparsec ((<?>))
import Text.Megaparsec      qualified as MP
import Text.Megaparsec.Char qualified as MP

import Data.Aeson.Types (ToJSON)
import Data.Void (Void)
import Data.Functor (void)
import Data.Text qualified as T
import Data.List.NonEmpty (NonEmpty)
import Data.List.NonEmpty qualified as NE

import GHC.Generics (Generic)

import TypeSafari.HindleyMilner.Syntax qualified as Stx
-- import TypeSafari.HindleyMilner.Infer (Type(..), TV (TvBound), MV (MV))
-- import TypeSafari.Pretty (Pretty(..))
import TypeSafari.RecursionSchemes.Mu (Mu(..))
import TypeSafari.Parse.Span (Span(..), PosOffset(..), OffsetSpan)


------------------------------------------------------------

type Parser = MP.Parsec Void Text
type ParserLoc a = Parser (a, PosOffset)

getOffset :: Parser PosOffset
getOffset = PosOffset . MP.stateOffset <$> MP.getParserState

withSpan :: Parser a -> Parser (OffsetSpan, a)
withSpan p = do
  p0 <- getOffset
  foo <- p
  p1 <- getOffset
  return (Span p0 p1, foo)

------------------------------------------------------------

-- Augment a parser with a source span.
spanned :: Parser (a, PosOffset) -> Parser (OffsetSpan, a)
spanned parser = do
  start <- getOffset
  (x, end) <- parser
  pure (Span start end, x)

-- Consume whitespace following a lexeme, but record
-- its endpoint as being before the whitespace.
-- https://stackoverflow.com/a/59416955/1444650
lexeme :: Parser a -> Parser (a, PosOffset)
lexeme parser = (,) <$> parser <*> (getOffset <* scn)

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

-- lexeme :: Parser a -> Parser a
-- lexeme = L.lexeme scn -- TODO sc not scn
-- {-# INLINEABLE lexeme #-}

symbol ::
  Text ->  -- symbol to parse
  ParserLoc Text
symbol = lexeme . MP.string
{-# INLINEABLE symbol #-}

--------------------------------------------------------------------------------

_backslash :: ParserLoc Text
_backslash = symbol "\\"

_arrow :: ParserLoc Text
_arrow = symbol "->"

_forall :: ParserLoc Text
_forall = symbol "forall"

_forallUnicode :: ParserLoc Text
_forallUnicode = symbol "∀"

_comma :: ParserLoc Text
_comma = symbol ","

_questionMark :: ParserLoc Text
_questionMark = symbol "?"

_let :: ParserLoc Text
_let = symbol "let"

_in :: ParserLoc Text
_in = symbol "in"

_if :: ParserLoc Text
_if = symbol "if"

_then :: ParserLoc Text
_then = symbol "then"

_else :: ParserLoc Text
_else = symbol "else"

_True :: ParserLoc Text
_True = symbol "True"

_False :: ParserLoc Text
_False = symbol "False"

_equal :: ParserLoc Text
_equal = symbol "="

_leftparen :: ParserLoc Text
_leftparen = symbol "("

_rightparen :: ParserLoc Text
_rightparen = symbol ")"

--------------------------------------------------------------------------------

integerP :: Parser Stx.LocatedExpr
integerP = do
  (s, int) <- spanned (lexeme L.decimal)
  return . InF $ Stx.Lit s (Stx.LInt int)

boolP :: Parser Stx.LocatedExpr
boolP = do
  (s, b) <- withSpan $ MP.choice [ True <$ _True, False <$ _False ]
  return . InF $ Stx.Lit s (Stx.LBool b)

--------------------------------------------------------------------------------

nameP :: Parser (Stx.Name, PosOffset)
nameP = nameP1 >>= mapFstA check
  where
    nameP0 = (:) <$> MP.letterChar <*> MP.many MP.alphaNumChar <?> "variable"
    nameP1 = mapFst T.pack <$> lexeme nameP0
    check :: Text -> Parser Stx.Name
    check s =
      if s `elem` reserved
        then fail $ "keyword " ++ show s ++ " cannot be used as a variable name"
        else return (Stx.Name s)
      where 
        reserved = ["forall", "let", "in", "if", "then", "else", "True", "False"]

variableP :: Parser Stx.LocatedExpr
variableP = MP.try $ do
  (sx,x) <- spanned nameP
  return . InF $ Stx.Var sx x

parens :: Parser a -> Parser a
parens = MP.between (symbol "(") (symbol ")")

---- types -------------------------------------------------

-- -- TODO: validate that type var is bound by a forall
-- typeVarP :: ParserLoc TV
-- typeVarP = mapFst TvBound <$> (lexeme L.decimal) <?> "type variable"

-- metaVarP :: Parser MV
-- metaVarP = MV <$> (_questionMark *> nameP) <?> "metavariable"

-- typeConstructorP :: ParserLoc Type
-- typeConstructorP = (do
--   (Stx.Name t, s) <- nameP
--   pure (TypeCon t, s))  <?> "type constructor"

-- typeP :: Parser Type
-- typeP = MP.choice [
--     typeArrowP,
--     parens typeP,
--     TypeVar <$> typeVarP,
--     TypeMetaVar <$> metaVarP,
--     typeConstructorP
--   ]

-- arithmetic expressions
-- typeArrowP :: Parser Type
-- typeArrowP = makeExprParser termP opTable
--   where
--     termP :: Parser Type
--     termP = MP.choice
--       [ parens typeP
--       , TypeVar <$> typeVarP
--       , TypeMetaVar <$> metaVarP
--       , typeConstructorP
--       ]
--     opTable :: [[Operator Parser Type]]
--     opTable = [ [ InfixR (TypeArr <$ _arrow) ] ]

---- expressions -------------------------------------------

letExprP :: Parser Stx.LocatedExpr
letExprP = (do
  p0      <- getOffset
  (sx, x) <- spanned (_let *> nameP)
  expr    <- (_equal *> simpleExprP)
  body    <- (_in *> exprP)
  p1      <- getOffset
  return . InF $ Stx.Let (Span p0 p1) (sx,x) expr body
  ) <?> "let"

wrapSpan :: (OffsetSpan -> a -> b) -> Parser a -> Parser b
wrapSpan f p = do
  p0 <- getOffset
  r  <- p
  p1 <- getOffset
  return (f (Span p0 p1) r)

ifExprP :: Parser Stx.LocatedExpr
ifExprP = (do
  p0   <- getOffset
  econ <- (_if *> simpleExprP)
  etru <- (_then *> simpleExprP)
  efls <- (_else *> simpleExprP)
  p1   <- getOffset
  return . InF $ Stx.If (Span p0 p1) econ etru efls)  <?> "if-then-else"

spineP :: Parser Stx.LocatedExpr
spineP = (snd . foldl1 app) <$> MP.some (withSpan simpleExprP)
  where
    app :: (OffsetSpan, Stx.LocatedExpr) -> (OffsetSpan, Stx.LocatedExpr) -> (OffsetSpan, Stx.LocatedExpr)
    app (Span p1 _, e1) (Span _ p2, e2) = (s12, InF $ Stx.App s12 e1 e2)
      where s12 = Span p1 p2

lamP :: Parser Stx.LocatedExpr
lamP = (do
    p0     <- getOffset
    _      <- _backslash
    (sx,x) <- spanned nameP
    body   <- (_arrow *> exprP)
    p1     <- getOffset
    return $ InF $ Stx.Lam (Span p0 p1) (sx,x) body
  ) <?> "lambda"

exprP :: Parser Stx.LocatedExpr
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

simpleExprP :: Parser Stx.LocatedExpr
simpleExprP = MP.choice [ parens exprP, arithExprP, variableP, boolP, integerP ]

------------------------------------------------------------

-- arithmetic expressions
arithExprP :: Parser Stx.LocatedExpr
arithExprP = snd <$> makeExprParser (withSpan termP) opTable
  where
    termP :: Parser Stx.LocatedExpr
    termP = MP.choice
      [ parens exprP
      , variableP
      , integerP
      ]
    opTable :: [[Operator Parser (OffsetSpan, Stx.LocatedExpr)]]
    opTable =
      [ [ binary "*" (combine Stx.Mul)
        ]
      , [ binary "+" (combine Stx.Add)
        , binary "-" (combine Stx.Sub)
        ]
      ]
    combine :: Stx.BinOp -> (OffsetSpan, Stx.LocatedExpr) -> (OffsetSpan, Stx.LocatedExpr) -> (OffsetSpan, Stx.LocatedExpr)
    combine op (Span p1 _, e1) (Span _ p2, e2) = (s12, InF $ Stx.Bin op s12 e1 e2)
      where s12 = Span p1 p2
    binary :: Text -> ((OffsetSpan, Stx.LocatedExpr) -> (OffsetSpan, Stx.LocatedExpr) -> (OffsetSpan, Stx.LocatedExpr)) -> Operator Parser (OffsetSpan, Stx.LocatedExpr)
    binary name f = InfixL  (f <$ symbol name)

------------------------------------------------------------

newtype ParseResult = ParseResult
  { parsedExpr  :: Stx.LocatedExpr
  } deriving stock (Eq)

data ParseErrorPos = ParseErrorPos
  { errorSource :: Text,
    errorLine   :: Int,
    errorCol    :: Int
  }
  deriving stock (Generic)
  deriving anyclass (ToJSON)

newtype ParseError = ParseError
  { errors :: [(ParseErrorPos, Text)] }
  deriving stock (Generic)
  deriving anyclass (ToJSON)

makeError :: MP.ParseErrorBundle Text Void -> ParseError
makeError peb = ParseError errors
  where
    errors = map (mapFst posMap) $ NE.toList $ annotateErrorBundle peb

    posMap MP.SourcePos{..} = ParseErrorPos {
      errorSource = T.pack sourceName,
      errorLine   = MP.unPos sourceLine,
      errorCol    = MP.unPos sourceColumn
      }
    
    -- https://stackoverflow.com/a/70139061/1444650
    annotateErrorBundle :: MP.ParseErrorBundle Text Void -> NonEmpty (MP.SourcePos, T.Text)
    annotateErrorBundle bundle
      = fmap (\(err, pos) -> (pos, T.pack . MP.parseErrorTextPretty $ err)) . fst $
        MP.attachSourcePos MP.errorOffset
                          (MP.bundleErrors bundle)
                          (MP.bundlePosState bundle)

parse :: Text -> Either ParseError ParseResult
parse t =
  case result of
    Left peb -> Left $ makeError peb
    Right expr -> Right $ ParseResult expr
  where result = MP.runParser ((MP.optional scn) *> exprP <* MP.eof) "[filename]" t

------------------------------------------------------------

-- newtype ParseTypeResult = ParseTypeResult
--   { parsedType :: Type
--   } deriving stock (Show, Eq)

-- parseType :: Text -> Either Text ParseTypeResult
-- parseType t =
--   case MP.runParser (typeP <* MP.eof) "[result]" t of
--     Left peb -> Left . T.pack $ MP.errorBundlePretty peb
--     Right x -> Right $ ParseTypeResult x

-- tryParse :: Pretty a => (Parser a) -> Text -> Text
-- tryParse p t =
--   case MP.runParser (p <* MP.eof) "[test]" t of
--     Left peb -> (T.pack . MP.errorBundlePretty) peb
--     Right x -> pretty x