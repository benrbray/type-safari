module TypeSafari.HindleyMilner.Parse where

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
import TypeSafari.HindleyMilner.Syntax.Concrete qualified as Cst
import TypeSafari.RecursionSchemes.Mu (Mu(..))
import TypeSafari.Parse.Span (Span(..), Pos(..), Span, HasSpan (..))
import Control.Monad.State (State, MonadState (..), evalState)

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

integerP :: Parser Stx.LocatedExpr
integerP = (do
  (s, int) <- withSpan (lexeme L.decimal)
  return . InF $ Stx.Lit s (Stx.LInt int)) <?> "integer"

boolP :: Parser Stx.LocatedExpr
boolP = (do
  (s, b) <- withSpan $ MP.choice [ True <$ _True, False <$ _False ]
  return . InF $ Stx.Lit s (Stx.LBool b)) <?> "boolean"

--------------------------------------------------------------------------------

failReservedKeyword :: Text -> Parser Text
failReservedKeyword s =
  if s `elem` reserved
    then fail $ "keyword " ++ show s ++ " cannot be used as a variable name"
    else return s
  where
    reserved = ["forall", "let", "in", "if", "then", "else", "True", "False"]

-- TODO (Ben @ 2023/09/23) instead of duplicating the identifier parsers with
-- different starting char types, just have one catch-all ident parser, and
-- either 1) choose different constructor based on first char, or
--        2) fail if first char does not match expected syntactic class

nameP :: Parser Stx.Name
nameP = Stx.Name <$> (failReservedKeyword . T.pack =<< lexeme nameP0)
  where
    nameP0 = (:) <$> MP.letterChar <*> MP.many MP.alphaNumChar <?> "variable"

lowerIdentP :: Parser Cst.Name
lowerIdentP = Cst.Name <$> (failReservedKeyword . T.pack =<< lexeme nameP0)
  where
    nameP0 = (:) <$> MP.lowerChar <*> MP.many MP.alphaNumChar <?> "lowercase identifier"

upperIdentP :: Parser Cst.Name
upperIdentP = Cst.Name <$> (failReservedKeyword . T.pack =<< lexeme nameP0)
  where
    nameP0 = (:) <$> MP.upperChar <*> MP.many MP.alphaNumChar <?> "uppercase identifier"

metaIdentP :: Parser Cst.Name
metaIdentP = Cst.Name <$> (failReservedKeyword . T.pack =<< lexeme nameP0)
  where
    nameP0 = (:) <$> MP.satisfy (== '?') <*> MP.many MP.alphaNumChar <?> "uppercase identifier"

variableP :: Parser Stx.LocatedExpr
variableP = MP.try $ do
  (sx,x) <- withSpan nameP
  return . InF $ Stx.Var sx x

parens :: Parser a -> Parser a
parens = MP.between (symbol "(") (symbol ")")

---- types -------------------------------------------------

-- -- TODO: validate that type var is bound by a forall
typeVarP :: Parser (Span, Cst.Name)
typeVarP = do
  p0 <- getPos
  tv <- lowerIdentP <?> "type variable"
  p1 <- getNonSpacePos
  return (Span p0 p1, tv)

metaVarP :: Parser (Span, Cst.Name)
metaVarP = do
  p0 <- getPos
  tv <- metaIdentP <?> "type metavariable"
  p1 <- getNonSpacePos
  return (Span p0 p1, tv)

typeConP :: Parser (Span, Cst.Name)
typeConP = do
  p0 <- getPos
  tv <- upperIdentP <?> "type constructor"
  p1 <- getNonSpacePos
  return (Span p0 p1, tv)

monoTypeP :: Parser (Cst.MonoType Span)
monoTypeP = MP.choice [
    parens monoTypeP,
    mono Cst.TypeVar typeVarP,
    mono Cst.TypeMetaVar metaVarP,
    mono Cst.TypeCon typeConP
  ]
  where
    mono f p = do
      (s, t) <- p
      return $ InF (f s t)

rhoTypeMonoP :: Parser (Cst.RhoType Span)
rhoTypeMonoP = do
  t  <- monoTypeP
  return $ Cst.RhoMono (getSpan t) t

rhoTypeArrowP :: Parser (Cst.RhoType Span)
rhoTypeArrowP = termP >>= helper
  where
    termP = do
      p0 <- getPos
      t <- MP.choice [
          parens polyTypeP,
          emptyForall . rhoMono <$> monoTypeP
        ]
      return (p0, t)
    helper :: (Pos, Cst.PolyType Span) -> Parser (Cst.RhoType Span)
    helper (p0, left) = do
      _     <- _arrow
      right <- termP >>= (\(pr,r) -> (emptyForall <$> helper (pr,r)) <|> pure r)
      p1    <- getNonSpacePos
      return $ Cst.RhoArr (Span p0 p1) left right

    rhoMono :: Cst.MonoType Span -> Cst.RhoType Span
    rhoMono tm = Cst.RhoMono (getSpan tm) tm

    emptyForall :: Cst.RhoType Span -> Cst.PolyType Span
    emptyForall rt = Cst.Forall (getSpan rt) [] rt

rhoTypeP :: Parser (Cst.RhoType Span)
rhoTypeP = MP.choice [
    rhoTypeArrowP,
    rhoTypeMonoP
  ]

polyTypeP :: Parser (Cst.PolyType Span)
polyTypeP = do
  p0   <- getPos
  tvs <- (_forall *> (MP.some typeVarP <* _dot)) <|> pure []
  body <- rhoTypeP
  p1  <- getNonSpacePos
  return $ Cst.Forall (Span p0 p1) (snd <$> tvs) body

---- expressions -------------------------------------------

letExprP :: Parser Stx.LocatedExpr
letExprP = (do
  p0      <- getPos
  (sx, x) <- (_let *> withSpan nameP)
  expr    <- (_equal *> simpleExprP)
  body    <- (_in *> exprP)
  p1      <- getNonSpacePos
  return . InF $ Stx.Let (Span p0 p1) (sx,x) expr body
  ) <?> "let"

ifExprP :: Parser Stx.LocatedExpr
ifExprP = (do
  p0   <- getPos
  econ <- (_if *> simpleExprP)
  etru <- (_then *> simpleExprP)
  efls <- (_else *> simpleExprP)
  p1   <- getNonSpacePos
  return . InF $ Stx.If (Span p0 p1) econ etru efls)  <?> "if-then-else"

spineP :: Parser Stx.LocatedExpr
spineP = (snd . foldl1 app) <$> MP.some (withSpan simpleExprP)
  where
    app :: (Span, Stx.LocatedExpr) -> (Span, Stx.LocatedExpr) -> (Span, Stx.LocatedExpr)
    app (Span p1 _, e1) (Span _ p2, e2) = (s12, InF $ Stx.App s12 e1 e2)
      where s12 = Span p1 p2

lamP :: Parser Stx.LocatedExpr
lamP = (do
    p0     <- getPos
    _      <- _backslash
    (sx,x) <- withSpan nameP
    body   <- (_arrow *> exprP)
    p1     <- getNonSpacePos
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
    opTable :: [[Operator Parser (Span, Stx.LocatedExpr)]]
    opTable =
      [ [ binary "*" (combine Stx.Mul)
        ]
      , [ binary "+" (combine Stx.Add)
        , binary "-" (combine Stx.Sub)
        ]
      ]
    combine :: Stx.BinOp -> (Span, Stx.LocatedExpr) -> (Span, Stx.LocatedExpr) -> (Span, Stx.LocatedExpr)
    combine op (Span p1 _, e1) (Span _ p2, e2) = (s12, InF $ Stx.Bin op s12 e1 e2)
      where s12 = Span p1 p2
    binary :: Text -> ((Span, Stx.LocatedExpr) -> (Span, Stx.LocatedExpr) -> (Span, Stx.LocatedExpr)) -> Operator Parser (Span, Stx.LocatedExpr)
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
  case evalState result (Pos 0) of
    Left peb -> Left $ makeError peb
    Right expr -> Right $ ParseResult expr
  where result = MP.runParserT ((MP.optional scn) *> exprP <* MP.eof) "[filename]" t

------------------------------------------------------------

newtype ParseTypeResult = ParseTypeResult
  { parsedType :: Cst.LocatedType
  } deriving stock (Eq)

parseType :: Text -> Either ParseError ParseTypeResult
parseType t =
  case evalState (MP.runParserT (polyTypeP <* MP.eof) "[result]" t) (Pos 0) of
    Left peb -> Left $ makeError peb
    Right x -> Right $ ParseTypeResult x