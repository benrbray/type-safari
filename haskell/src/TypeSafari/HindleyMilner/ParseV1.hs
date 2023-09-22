module TypeSafari.HindleyMilner.ParseV1 where

import Control.Monad.Combinators.Expr
  
import Text.Megaparsec ((<?>))
import Text.Megaparsec qualified as MP
import TypeSafari.Parse.Located qualified as L

import Data.Void
import Data.Text qualified as T

import TypeSafari.HindleyMilner.Syntax (ExprF(..), Lit (..), BinOp (..), LocatedExpr)
import TypeSafari.HindleyMilner.Syntax qualified as Stx
-- import TypeSafari.HindleyMilner.Syntax.Concrete qualified as CS
import TypeSafari.Parse.Located (TextSpan, scn)
import TypeSafari.Parse.Span (OffsetSpan, Span (..), HasSpan (..))
import TypeSafari.RecursionSchemes.Mu (Mu (..))
import TypeSafari.Core

import Data.List.NonEmpty (NonEmpty)
import Data.List.NonEmpty qualified as NE
import Data.Aeson.Types (ToJSON)
import GHC.Generics (Generic)

--------------------------------------------------------------------------------

type Parser = MP.Parsec Void L.TextSpan

--------------------------------------------------------------------------------

_backslash :: Parser TextSpan
_backslash = L.symbol "\\"

_arrow :: Parser TextSpan
_arrow = L.symbol "->" <?> "arrow"

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

parens :: Parser a -> Parser a
parens = MP.between _leftparen _rightparen

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
  (s, text) <- ident
  pure $ InF $ Var s (Stx.Name text)

ident :: Parser (OffsetSpan, Text)
ident = L.lexeme name >>= check
  where
    name :: Parser TextSpan
    name = L.cons <$> MP.satisfy L.isAlpha <*> MP.takeWhileP Nothing L.isAlphaNum
    reserved = ["forall", "let", "in", "if", "then", "else", "True", "False"]
    check :: TextSpan -> Parser (OffsetSpan, Text)
    check ts@L.TextSpan{..} =
      if tsText `elem` reserved
      then fail $ "keyword " ++ show tsText ++ " cannot be used as a variable name"
      else return (getSpan ts, tsText)

nameP :: Parser (OffsetSpan, Stx.Name)
nameP = (do
  (s, t) <- ident
  return (s, Stx.Name t)) <?> "name"

---- types -------------------------------------------------

-- TODO: validate that type var is bound by a forall
-- typeVarP :: Parser (CS.Type OffsetSpan)
-- typeVarP = InF . CS.TypeVar <$> (snd <$> ident) <?> "type variable"

-- metaVarP :: Parser (CS.Type OffsetSpan)
-- metaVarP = InF . CS.TypeMetaVar <$> (_questionMark *> (snd <$> ident)) <?> "metavariable"

-- typeConstructorP :: Parser Type
-- typeConstructorP = (do
--   (Stx.Name t) <- nameP
--   pure $ TypeCon t)  <?> "type constructor"

-- typeP :: Parser Type
-- typeP = MP.choice [
--     typeArrowP,
--     parens typeP,
--     TypeVar <$> typeVarP,
--     TypeMetaVar <$> metaVarP,
--     typeConstructorP
--   ]

-- -- arithmetic expressions
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

---- constraints -------------------------------------------

---- expressions -------------------------------------------

letExprP :: Parser LocatedExpr
letExprP = (InF <$> do
  Span p0 _ <- getSpan <$> _let
  (sx, x) <- nameP
  e1 <- (_equal *> simpleExprP)
  e2 <- (_in *> exprP)
  let Span _ p1 = getSpan e2
  return $ Let (Span p0 p1) (sx, x) e1 e2) <?> "let"

ifExprP :: Parser LocatedExpr
ifExprP = (InF <$> do
  Span p0 _ <- getSpan <$> _if
  econ <- simpleExprP
  etru <- _then *> simpleExprP
  efls <- _else *> simpleExprP
  let Span _ p1 = getSpan efls
  return $ If (Span p0 p1) econ etru efls) <?> "if-then-else"

lamP :: Parser LocatedExpr
lamP = (InF <$> do
    Span p0 _ <- getSpan <$> _backslash
    name <- nameP
    body <- _arrow *> exprP
    let Span _ p1 = getSpan body
    return $ Lam (Span p0 p1) name body
  ) <?> "lambda"

spineP :: Parser LocatedExpr
spineP = foldl1 go <$> MP.some simpleExprP <?> "spine"
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
    integerP,
    variableP
  ] <?> "expr"

simpleExprP :: Parser LocatedExpr
simpleExprP = MP.choice [
    parens exprP,
    MP.try arithExprP,
    boolP,
    integerP,
    variableP
  ] <?> "simple expression"

-- arithmetic expressions
arithExprP :: Parser LocatedExpr
arithExprP = makeExprParser termP opTable <?> "arithExpr"
  where
    termP :: Parser LocatedExpr
    termP = MP.choice
      [ parens exprP
      , boolP
      , integerP
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
    combine :: Stx.BinOp -> LocatedExpr -> LocatedExpr -> LocatedExpr
    combine op e1 e2 = InF $ Bin op (Span a1 b2) e1 e2
      where Span  a1 _b1 = getSpan e1
            Span _a2  b2 = getSpan e2
    binary :: Text -> (LocatedExpr -> LocatedExpr -> LocatedExpr) -> Operator Parser LocatedExpr
    binary name f = InfixL  (f <$ L.symbol name)

------------------------------------------------------------

newtype ParseResult = ParseResult
  { parsedExpr  :: LocatedExpr
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

makeError :: MP.ParseErrorBundle TextSpan Void -> ParseError
makeError peb = ParseError errors
  where
    errors = map (mapFst posMap) $ NE.toList $ annotateErrorBundle peb

    posMap MP.SourcePos{..} = ParseErrorPos {
      errorSource = T.pack sourceName,
      errorLine   = MP.unPos sourceLine,
      errorCol    = MP.unPos sourceColumn
      }
    
    -- https://stackoverflow.com/a/70139061/1444650
    annotateErrorBundle :: MP.ParseErrorBundle TextSpan Void -> NonEmpty (MP.SourcePos, T.Text)
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
  where result = MP.runParser ((MP.optional scn) *> exprP <* MP.eof) "[filename]" (L.textSpan t)

------------------------------------------------------------

-- newtype ParseTypeResult = ParseTypeResult
--   { parsedType :: Type
--   } deriving stock (Show, Eq)

-- -- parseType :: Text -> Either Text ParseTypeResult
-- -- parseType t =
-- --   case MP.runParser (typeP <* MP.eof) "[result]" t of
-- --     Left peb -> Left . T.pack $ MP.errorBundlePretty peb
-- --     Right x -> Right $ ParseTypeResult x

-- tryParse :: Pretty a => (Parser a) -> Text -> Text
-- tryParse p t =
--   case MP.runParser (p <* MP.eof) "[test]" t of
--     Left peb -> (T.pack . MP.errorBundlePretty) peb
--     Right x -> pretty x