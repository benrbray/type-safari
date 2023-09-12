{-# LANGUAGE RankNTypes          #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE DeriveFunctor       #-}
{-# LANGUAGE FlexibleInstances   #-}
{-# OPTIONS_GHC -Wno-unused-top-binds #-}
-- {-# LANGUAGE PatternSynonyms     #-}

module TypeSafari.Parse.Located
  ( CharWithPos(..)
  , TextSpan(..)
  , textSpan, textSpanFrom
  , ExprWithSpan, ExprWithSpanF(..), WithSpan(..)
  , cons
  , lexeme, symbol, satisfy, name
  , decimal
  , isAlpha, isAlphaNum
  )
where

-- megaparsec
import Text.Megaparsec (
    Parsec, Stream, VisualStream, TraversableStream,
    PosState(..),
    (<?>)
  )
import qualified Text.Megaparsec as MP
import qualified Text.Megaparsec.Char.Lexer as L

-- parser-combinators
import Control.Monad.Combinators.Expr ()
import Control.Applicative hiding (some, many)
import Control.Monad (void)

import qualified Data.Char as C
import qualified Data.Text as T
import Data.String (IsString(..))

-- misc
import Data.Void
import Data.Proxy
import qualified Data.Set           as Set
import qualified Data.List.NonEmpty as NE
import Control.Arrow ( Arrow((***)) )

import Data.Foldable ( Foldable(foldl') )

-- yagi-lang
import TypeSafari.Core
import TypeSafari.RecursionSchemes.Mu
import TypeSafari.Pretty (Pretty (..))

------------------------------------------------------------

data CharWithPos = CharWithPos
  { cwpPos :: Int
  , cwpChar :: Char
  } deriving stock (Eq, Show, Ord)

data TextSpan = TextSpan
  { tsStart :: Int -- inclusive from 0
  , tsEnd   :: Int -- exclusive from 0
  , tsText  :: Text
  } deriving stock (Eq, Show, Ord)

instance IsString TextSpan where
  fromString :: String -> TextSpan
  fromString s = TextSpan 0 (length s) (T.pack s)

data WithSpan a = WithSpan
  { spanStart :: Int
  , spanEnd   :: Int
  , spanData  :: a
  } deriving stock (Eq, Show, Functor)

textSpan :: Text -> TextSpan
textSpan = textSpanFrom 0

textSpanFrom :: Int -> Text -> TextSpan
textSpanFrom n t = TextSpan n (T.length t) t

emptyTextSpan :: TextSpan
emptyTextSpan = TextSpan 0 0 T.empty

instance Stream TextSpan where
  type Token  TextSpan = CharWithPos
  type Tokens TextSpan = TextSpan

  take1_ :: TextSpan -> Maybe (CharWithPos, TextSpan)
  take1_ (TextSpan start end t) = markPos <$> T.uncons t
    where markPos = CharWithPos start *** TextSpan (start + 1) end

  takeN_ :: Int -> TextSpan -> Maybe (TextSpan, TextSpan)
  takeN_ n s@(TextSpan start end t)
    | n <= 0    = Just (emptyTextSpan, s)
    | T.null t  = Nothing
    | otherwise = Just (headSpan, restSpan)
        where (headT, rest) = T.splitAt n t
              headEnd   = start + T.length headT
              headSpan  = TextSpan start headEnd headT
              restSpan  = TextSpan headEnd end rest

  -- NOTE: since we fall back to the underlying T.span implementation,
  --   the predicate always receives a dummy position of 0
  takeWhile_ :: (CharWithPos -> Bool) -> TextSpan -> (TextSpan, TextSpan)
  takeWhile_ p (TextSpan a b t) = (TextSpan a fstEnd fstT, TextSpan fstEnd b sndT)
    where pp :: Char -> Bool
          pp = p . CharWithPos 0 -- TODO (Ben @ 2022/08/16) is it harmful to pass a dummy 0 position here?
          (fstT,sndT) = T.span pp t
          fstEnd = a + T.length fstT

  tokensToChunk :: Proxy TextSpan -> [CharWithPos] -> TextSpan
  tokensToChunk Proxy [] = emptyTextSpan
  tokensToChunk Proxy lst@((CharWithPos pos _c) : _cs) = TextSpan pos (length lst) (T.pack $ cwpChar <$> lst)

  chunkToTokens :: Proxy TextSpan -> TextSpan -> [CharWithPos]
  chunkToTokens Proxy (TextSpan a _ t) = uncurry CharWithPos <$> zip [a..] (T.unpack t)

  chunkLength :: Proxy TextSpan -> TextSpan -> Int
  chunkLength Proxy (TextSpan a b _) = b - a

------------------------------------------------------------

instance VisualStream TextSpan where
  showTokens p xs = T.unpack . tsText $ ts
    where ts = MP.tokensToChunk (p :: Proxy TextSpan) (NE.toList xs)

------------------------------------------------------------

instance TraversableStream TextSpan where
  reachOffset :: Int -> PosState TextSpan -> (Maybe String, PosState TextSpan)
  reachOffset offset state = (ms, unForget offset pst)
    where (ms, pst) = MP.reachOffset offset (forget state)
          forget :: PosState TextSpan -> PosState Text
          forget ps@PosState{..} = ps{pstateInput = tsText pstateInput}
          unForget :: Int -> PosState Text -> PosState TextSpan
          unForget startPos ps@PosState{..}
            = ps{ pstateInput = TextSpan startPos endPos pstateInput }
            where endPos = startPos + T.length pstateInput

------------------------------------------------------------

type Parser = Parsec Void TextSpan
type ParserWithSpan a = Parser (WithSpan a)

liftCharPredicate :: (Char -> Bool) -> (CharWithPos -> Bool)
liftCharPredicate p = p . cwpChar

isSpace :: CharWithPos -> Bool
isSpace = liftCharPredicate C.isSpace
isAlpha :: CharWithPos -> Bool
isAlpha = liftCharPredicate C.isAlphaNum
isAlphaNum :: CharWithPos -> Bool
isAlphaNum = liftCharPredicate C.isAlphaNum

space1 :: Parser ()
space1 = void $ MP.takeWhile1P (Just "white space") isSpace
{-# INLINE space1 #-}

------------------------------------------------------------

satisfy :: (Char -> Bool) -> Parser CharWithPos
satisfy p = MP.token test Set.empty
  where test x@(CharWithPos _ t) =
          if p t then Just x
                 else Nothing

string :: Text -> Parser TextSpan
string t = MP.tokens test (textSpan t)
  where test ts1 ts2 = tsText ts1 == tsText ts2

char :: Char -> Parser CharWithPos
char c = satisfy (== c)

-- spaces and newlines
scn :: Parser ()
--scn = L.space space1 empty empty
scn = L.space (void $ MP.some (char ' ' <|> char '\t' <|> char '\n')) empty empty

-- spaces only, not newlines
sc :: Parser ()
sc = L.space (void $ MP.some (char ' ' <|> char '\t')) empty empty

lexeme :: Parser a -> Parser a
lexeme = L.lexeme scn -- TODO sc not scn
{-# INLINEABLE lexeme #-}

symbol ::
  Text ->  -- symbol to parse
  Parser TextSpan
symbol = L.lexeme scn . string -- TODO sc not scn
{-# INLINEABLE symbol #-}

------------------------------------------------------------

decimal :: (Num a) => Parser (TextSpan, a)
decimal = decimal_ <?> "integer"
{-# INLINEABLE decimal #-}

-- | A non-public helper to parse decimal integers.
--   (adapted from `Text.Megaparsec.Char.Lexer`)
decimal_ :: (Num a) => Parser (TextSpan, a)
decimal_ = toSnd mkNum <$> digits
  where
    digits :: Parser TextSpan
    digits = MP.takeWhile1P (Just "digit") (liftCharPredicate C.isDigit)
    mkNum = foldl' step 0 . MP.chunkToTokens (Proxy :: Proxy TextSpan)
    step a c = a * 10 + fromIntegral ((C.digitToInt . cwpChar) c)

------------------------------------------------------------

withSpan :: (Text -> a) -> TextSpan -> WithSpan a
withSpan f (TextSpan a b t)
  = WithSpan { spanStart = a, spanEnd = b, spanData = f t }

------------------------------------------------------------

data ExprF a
  = FLeaf Text
  | FNode a a
  deriving stock (Eq, Show, Functor)

newtype ExprWithSpanF a
  = ExprWithSpanF (WithSpan (ExprF a))
  deriving stock (Eq, Show, Functor)

type ExprWithSpan = Mu ExprWithSpanF

showSpan :: Int -> Int -> Text
showSpan a b = "{" <> show a <> "," <> show b <> "}"

showOneLayer :: Pretty a => WithSpan (ExprF a) -> Text
showOneLayer (WithSpan a b (FLeaf t)) =  t <> showSpan a b
showOneLayer (WithSpan a b (FNode tl tr)) = "(" <> pretty tl <> "," <> pretty tr <> ")" <> showSpan a b

instance Pretty (Mu ExprWithSpanF) where
  pretty (InF (ExprWithSpanF ws)) = showOneLayer ws

exprWithSpan :: Int -> Int -> ExprF (Mu ExprWithSpanF) -> ExprWithSpan
exprWithSpan a b e = InF $ ExprWithSpanF (WithSpan a b e)

getSpan :: ExprWithSpan -> (Int,Int)
getSpan (InF (ExprWithSpanF ws)) = (spanStart ws, spanEnd ws)

------------------------------------------------------------

-- cons :: (CharWithPos, TextSpan) -> TextSpan
-- cons (CharWithPos a x, TextSpan b c t) = TextSpan a c (T.cons x t)

cons :: CharWithPos -> TextSpan -> TextSpan
cons (CharWithPos a x) (TextSpan _ c t) = TextSpan a c (T.cons x t)

name :: Parser TextSpan
name = cons <$> MP.satisfy isAlpha <*> MP.takeWhileP Nothing isAlphaNum

pLeaf :: Parser ExprWithSpan
pLeaf = go <$> name
  where go :: TextSpan -> ExprWithSpan
        go (TextSpan a b t) = exprWithSpan a b (FLeaf t)

pNode :: Parser ExprWithSpan
pNode = do
  TextSpan a _ _ <- symbol "("
  left <- pNode <|> pLeaf
  _ <- symbol ","
  right <- pNode <|> pLeaf
  TextSpan _ b _ <- symbol ")"
  return $ exprWithSpan a b (FNode left right)

------------------------------------------------------------

showExprF :: Pretty a => ExprF a -> Text
showExprF (FLeaf t) = t
showExprF (FNode tl tr) = "(" <> pretty tl <> "," <> pretty tr <> ")"

instance Pretty (Mu ExprF) where
  pretty (InF e) = showExprF e

------------------------------------------------------------

-- type Result a = Mu (ResultF a)
-- data ResultF a b
--   = Done a
--   | Next b
--   deriving (Show, Eq, Functor)

-- pattern GetSpan x y e = InF (ExprWithSpanF (WithSpan x y e))
-- pattern GetExpr e <- InF (ExprWithSpanF (WithSpan _ _ e))
-- pattern GetLeaf t <- InF (ExprWithSpanF (WithSpan _ _ (FLeaf t)))
-- pattern GetNode l r <- InF (ExprWithSpanF (WithSpan _ _ (FNode l r)))

-- -- anamorphism
-- prune :: Int -> ExprWithSpan -> Result ExprWithSpan
-- prune v = ana go
--   where go :: ExprWithSpan -> ResultF ExprWithSpan ExprWithSpan
--         go (GetNode l r)
--           | la <= v && v < lb = Next l
--           | ra <= v && v < rb = Next r
--           where GetSpan la lb _ = l
--                 GetSpan ra rb _ = r
--         go expr = Done expr

-- -- catamorphism
-- finish :: Result ExprWithSpan -> ExprWithSpan
-- finish = cata go
--   where go :: ResultF ExprWithSpan ExprWithSpan -> ExprWithSpan
--         go (Done e) = e
--         go (Next e) = e

-- -- hylomorphism
-- -- TODO (Ben @ 2022/08/23) use hylo from recursion-schemes
-- termAtPos :: Int -> ExprWithSpan -> ExprWithSpan
-- termAtPos p expr = finish (prune p expr)

------------------------------------------------------------

-- data ParseResult = ParseResult
--   { parsedExpr  :: ExprWithSpan
--   , parsedLines :: [Int]
--   } deriving (Show, Eq)

-- data Pos = Pos
--   { posLine :: !Int -- from 0
--   , posCol  :: !Int -- from 0
--   } deriving (Eq, Ord)

-- instance Show Pos where
--   show :: Pos -> String
--   show Pos{..} = "l" ++ show posLine ++ "c" ++ show posCol

-- offsetFromPos :: ParseResult -> Pos -> Int
-- offsetFromPos ParseResult{..} = offsetFromPos' parsedLines

-- -- TODO make efficient with binary tree
-- offsetFromPos' :: [Int] -> Pos -> Int
-- offsetFromPos' _  (Pos 0 c) = c
-- offsetFromPos' ls (Pos l c) = sum (take l ls) + c

-- -- TODO make efficient with binary tree
-- posFromOffset
--   :: ParseResult -- line lengths
--   -> Int   -- absolute offset into the string
--   -> Pos
-- posFromOffset ParseResult{..} off = go 0 0 parsedLines
--   where go
--           :: Int   -- accumulator (lines consumed so far)
--           -> Int   -- accumulator (sum of line lengths so far)
--           -> [Int] -- rest
--           -> Pos
--         go l acc [] = Pos l (off - acc)  -- should not happen
--         go l acc (x:xs)
--           | off < acc + x = Pos l (off - acc)
--           | otherwise     = go (l+1) (acc + x) xs

-- parse :: Text -> Either Text ParseResult
-- parse t =
--   case result of
--     Left peb -> Left . T.pack . show $ MP.errorBundlePretty peb
--     Right x -> Right $ ParseResult x lines
--   where result = MP.runParser pNode "[filename]" (textSpan t)
--         lines = map ( (1+) . T.length ) $ T.lines t
