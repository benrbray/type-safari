{-# LANGUAGE RecordWildCards #-}

-- Adapted (with substantial changes) from code by Ifaz Kabir
-- https://ifazk.com/blog/2018-11-20-JavaScript-free-Hakyll-site.html
module KaTeX (kaTeXifyIO) where

import System.Process (readCreateProcess, shell)

-- text
import Data.Text (Text)
import qualified Data.Text as T
import Data.String.Conversions (convertString)

-- pandoc
import Text.Pandoc.Definition (MathType(..), Inline(..), Pandoc, Format(..))
import Text.Pandoc.Readers.HTML (readHtml)
import Text.Pandoc.Options (def)
import Text.Pandoc.Walk (walkM)
import Text.Pandoc.Class (PandocPure, runPure)

import Control.Monad.Writer
import Control.Monad
import Data.Default

--------------------------------------------------------------------------------

data KatexCmd = KatexCmd {
        katexNoError   :: Bool,         -- if active, fail gracefully and mark errors with red
        katexMacroFile :: Maybe Text    -- macro definitions file (each line has format \cmd:expansion)
    } deriving (Eq)

instance Default KatexCmd where
    def = KatexCmd True (Just "./noemit/katex-macros/notation1.katex")

makeKatexCmd :: KatexCmd -> MathType -> Text
makeKatexCmd KatexCmd{..} mt = T.intercalate " " . snd . runWriter $ do
    tell ["katex"]
    -- choose display math or inline math
    case mt of
        DisplayMath -> tell ["--display-mode"]
        _           -> pure ()
    -- error handling
    when katexNoError $ tell ["--no-throw-on-error"]
    -- katex macros
    case katexMacroFile of
        Nothing   -> tell ["--macro-file", "./noemit/katex-macros/notation-default.katex"]
        Just path -> tell ["--macro-file", T.append "./noemit/katex-macros/" path]

------------------------------------------------------------

-- kaTeXCmd :: MathType -> String
-- kaTeXCmd DisplayMath = "katex --no-throw-on-error --display-mode --macro-file ./noemit/katex-macros/notation1.katex"
-- kaTeXCmd _           = "katex --no-throw-on-error"

-- use katex to convert a tex src string into an html string
-- (katex be globally installed via `npm install -g katex`) 
rawKaTeX :: Text -> Text -> IO Text
rawKaTeX cmd texstr =
    convertString <$> readCreateProcess (shell . T.unpack $ cmd) (T.unpack texstr)

-- ensure katex str is parsable HTML before emitting Pandoc inline HTML
parseKaTeX :: Text -> Maybe Inline
parseKaTeX str =
  case runPure $ readHtml def str of
    Right _   -> Just (RawInline (Format "html") (T.strip str))
    _         -> Nothing

-- TODO:  use RawBlock instead of RawInline for math mode?

kaTeXify :: Maybe Text -> Inline -> IO Inline
kaTeXify macros orig@(Math mt str) = do
    let katexCmd = makeKatexCmd (def{katexMacroFile=macros}) mt
    result <- parseKaTeX <$> rawKaTeX katexCmd str
    case result of
        Just inl -> return inl
        Nothing  -> return orig
kaTeXify _ x = return x

--------------------------------------------------------------------------------
kaTeXifyIO :: Maybe Text -> Pandoc -> IO Pandoc
kaTeXifyIO macros = walkM (kaTeXify macros)