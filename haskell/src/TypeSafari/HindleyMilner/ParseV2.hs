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
import Control.Monad.State (State, MonadState (..), evalState)


------------------------------------------------------------

type Parser = MP.ParsecT Void Text (State PosOffset)

putNonSpacePos :: PosOffset -> Parser ()
putNonSpacePos = put

getNonSpacePos :: Parser PosOffset
getNonSpacePos = get

getOffset :: Parser PosOffset
getOffset = PosOffset . MP.stateOffset <$> MP.getParserState

withSpan :: Parser a -> Parser (OffsetSpan, a)
withSpan p = do
  p0 <- getOffset
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
  putNonSpacePos =<< getOffset <* scn
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

integerP :: Parser Stx.LocatedExpr
integerP = (do
  (s, int) <- withSpan (lexeme L.decimal)
  return . InF $ Stx.Lit s (Stx.LInt int)) <?> "integer"

boolP :: Parser Stx.LocatedExpr
boolP = (do
  (s, b) <- withSpan $ MP.choice [ True <$ _True, False <$ _False ]
  return . InF $ Stx.Lit s (Stx.LBool b)) <?> "boolean"

--------------------------------------------------------------------------------

nameP :: Parser Stx.Name
nameP = nameP1 >>= check
  where
    nameP0 = (:) <$> MP.letterChar <*> MP.many MP.alphaNumChar <?> "variable"
    nameP1 = T.pack <$> lexeme nameP0
    check :: Text -> Parser Stx.Name
    check s =
      if s `elem` reserved
        then fail $ "keyword " ++ show s ++ " cannot be used as a variable name"
        else return (Stx.Name s)
      where 
        reserved = ["forall", "let", "in", "if", "then", "else", "True", "False"]

variableP :: Parser Stx.LocatedExpr
variableP = MP.try $ do
  (sx,x) <- withSpan nameP
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
  (sx, x) <- (_let *> withSpan nameP)
  expr    <- (_equal *> simpleExprP)
  body    <- (_in *> exprP)
  p1      <- getNonSpacePos
  return . InF $ Stx.Let (Span p0 p1) (sx,x) expr body
  ) <?> "let"

ifExprP :: Parser Stx.LocatedExpr
ifExprP = (do
  p0   <- getOffset
  econ <- (_if *> simpleExprP)
  etru <- (_then *> simpleExprP)
  efls <- (_else *> simpleExprP)
  p1   <- getNonSpacePos
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
  case evalState result (PosOffset 0) of
    Left peb -> Left $ makeError peb
    Right expr -> Right $ ParseResult expr
  where result = MP.runParserT ((MP.optional scn) *> exprP <* MP.eof) "[filename]" t

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