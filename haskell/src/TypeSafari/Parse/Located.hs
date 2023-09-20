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
  , cons
  , lexeme, symbol, satisfy, name
  , scn, sc
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
import TypeSafari.Parse.Span (HasSpan (..), PosOffset(..), Span(..))

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

instance HasSpan PosOffset TextSpan where
  getSpan (TextSpan a b _) = Span (PosOffset a) (PosOffset b)

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
isAlpha = liftCharPredicate C.isAlpha
isUpper :: CharWithPos -> Bool
isUpper = not . isLower
isLower :: CharWithPos -> Bool
isLower = liftCharPredicate C.isAsciiLower
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

-- | Given a comment prefix this function returns a parser that skips line
-- comments. Note that it stops just before the newline character but
-- doesn't consume the newline. Newline is either supposed to be consumed by
-- 'space' parser or picked up manually.
-- (https://hackage.haskell.org/package/megaparsec-9.5.0/docs/src/Text.Megaparsec.Char.Lexer.html#skipLineComment)
skipLineComment ::
  Text ->
  Parser ()
skipLineComment prefix =
  string prefix *> void (MP.takeWhileP (Just "character") (\(CharWithPos _ c) -> c /= '\n'))
{-# INLINEABLE skipLineComment #-}

-- spaces and newlines
scn :: Parser ()
scn = L.space whitespace lineComment empty
  where
    whitespace = void $ MP.some (char ' ' <|> char '\t' <|> char '\n')
    lineComment = skipLineComment "--"

-- spaces only, not newlines
sc :: Parser ()
sc = L.space whitespace lineComment empty
  where
    whitespace = (void $ MP.some (char ' ' <|> char '\t'))
    lineComment = skipLineComment "--"

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

cons :: CharWithPos -> TextSpan -> TextSpan
cons (CharWithPos a x) (TextSpan _ c t) = TextSpan a c (T.cons x t)

name :: Parser TextSpan
name = cons <$> MP.satisfy isAlpha <*> MP.takeWhileP Nothing isAlphaNum