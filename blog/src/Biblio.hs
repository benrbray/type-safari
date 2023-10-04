--------------------------------------------------------------------------------
-- | Wraps pandocs bibiliography handling
--
-- In order to add a bibliography, you will need a bibliography file (e.g.
-- @.bib@) and a CSL file (@.csl@). Both need to be compiled with their
-- respective compilers ('biblioCompiler' and 'cslCompiler'). Then, you can
-- refer to these files when you use 'readPandocBiblio'. This function also
-- takes the reader options for completeness -- you can use
-- 'defaultHakyllReaderOptions' if you're unsure.
-- 'pandocBiblioCompiler' is a convenience wrapper which works like 'pandocCompiler',
-- but also takes paths to compiled bibliography and csl files.
-- {-# LANGUAGE Arrows                     #-}
-- {-# LANGUAGE DeriveDataTypeable         #-}
-- {-# LANGUAGE GeneralizedNewtypeDeriving #-}
-- {-# LANGUAGE OverloadedStrings          #-}
module Biblio
    ( CSL (..)
    , cslCompiler
    , Biblio (..)
    , biblioCompiler
    , readPandocBiblio
    , pandocBiblioCompilerWith
    ) where


--------------------------------------------------------------------------------

import           Control.Monad                 (liftM)
import qualified Data.Map                      as Map
import qualified Data.Time                     as Time
import           Text.Pandoc                   (Extension (..), Pandoc,
                                                ReaderOptions (..),
                                                enableExtension)
import qualified Text.Pandoc                   as Pandoc
import qualified Text.Pandoc.Citeproc          as Pandoc (processCitations)

-- hakyll
import Hakyll
    ( fromFilePath,
      load,
      readPandocWith,
      readPandocBiblio,
      biblioCompiler,
      cslCompiler,
      Compiler,
      Biblio(..),
      Item(itemBody),
      CSL(..) )
import           Hakyll.Core.Compiler.Internal

--------------------------------------------------------------------------------

-- | Compiles a markdown file via Pandoc. Requires the .csl and .bib files to be known to the compiler via Hakyll match statements.
pandocBiblioCompilerWith :: ReaderOptions -> String -> String -> Item String -> Compiler (Item Pandoc)
pandocBiblioCompilerWith ropt cslFileName bibFileName item = do
    csl <- load $ fromFilePath cslFileName
    bib <- load $ fromFilePath bibFileName
    readPandocBiblio ropt' csl bib item
    where ropt' = ropt
            { -- The following option enables citation rendering
              readerExtensions = enableExtension Ext_citations $ readerExtensions ropt
            }