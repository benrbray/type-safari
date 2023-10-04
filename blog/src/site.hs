--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE BangPatterns #-}
{-# LANGUAGE TupleSections #-}
import Data.Monoid (mappend)

-- system
import System.Environment
-- pandoc
import Text.Pandoc.Extensions qualified as TPE
import Text.Pandoc.Options qualified as TPO
import Text.Pandoc
import Text.Pandoc.Definition
import Text.Pandoc.Walk
-- hakyll
import Hakyll hiding (Template)
-- blaze
import Text.Blaze.Html ( toHtml, toValue, Html, (!))
import qualified Text.Blaze.Html5              as H
import qualified Text.Blaze.Html5.Attributes   as A
-- data
import Data.Bool (bool)
import Data.Maybe (fromMaybe, maybeToList)
import Data.Map (Map)
import Data.Map qualified as Map
import Data.List (intersperse, sortBy, elem, isSuffixOf, singleton)
import Data.List.Extra (stripSuffix)
import Data.Functor.Identity
import Data.Functor ((<&>))
-- control
import Control.Applicative ((<|>))
import Control.Arrow ((&&&))
import Control.Monad (mplus, msum, liftM, liftM2, ap, (>=>), when, guard, unless, (<=<))
-- time
import Data.Time.Clock (UTCTime (..))
import Data.Time.Format (formatTime, parseTimeM)
import qualified Data.Time as Time
import Data.Time.Locale.Compat (TimeLocale, defaultTimeLocale)
-- text
import qualified Data.Text as T
import Data.Text (Text)
-- debug
import Debug.Trace (trace, traceShow)

-- project imports
import KaTeX (kaTeXifyIO)
import qualified Biblio as Bib
import Data.Ord (comparing)
import Data.List (isPrefixOf)


--------------------------------------------------------------------------------

-- reusable globs, to prevent typos

postGlob :: Pattern
postGlob = "chapters/**"

codeSnippetGlob :: Pattern
codeSnippetGlob = "code/**"

--------------------------------------------------------------------------------

main :: IO ()
main = do
  now <- Time.getCurrentTime

  -- handle urls differently in watch mode
  isPublish <- notElem "watch" <$> getArgs
  let adjustUrls = bool pure removeExt isPublish >=> relativizeUrls

  -- hakyll configuration
  let config = defaultConfiguration {
                 destinationDirectory = if isPublish then "docs" else "_site"
               }

  -- compile website
  hakyllWith config $ do

    let ctx = relativizeUrl <> defaultContext

    match "images/**" $ do
        route   idRoute
        compile copyFileCompiler

    match "static/**" $ do
        route   idRoute
        compile copyFileCompiler

    match "CNAME" $ do
        route   idRoute
        compile copyFileCompiler

    match "css/*" $ do
        route   idRoute
        compile compressCssCompiler

    match "lib/*" $ do
        route   idRoute
        compile copyFileCompiler

    -- bibliography
    match "bib/**" $ compile Bib.biblioCompiler
    match "csl/**" $ compile Bib.cslCompiler

    -- static katex assets
    match "katex/**" $ do
        route idRoute
        compile copyFileCompiler

    -- code snippets
    match codeSnippetGlob $ do
        compile getResourceString

    -- posts

    let postCompiler = pure . (writePandocWith writerOpts)
                   >=> saveSnapshot "postContent" -- for rss feeds
                   >=> loadAndApplyTemplate "templates/post.html"    ctx
                   >=> loadAndApplyTemplate "templates/default.html" ctx
                   >=> adjustUrls

    let postRules = do
          route $ setExtension "html"
          compile $ do
            snippetMap <- toSnippetMap <$> loadAll codeSnippetGlob
            -- check file metadata for bib/csl files
            item <- getUnderlying
            cslFile <- fromMaybe "csl/acm-siggraph.csl" <$> getMetadataField item "csl"
            bibFile <- fromMaybe "bib/refs.bib" <$> getMetadataField item "bib"
            -- compile
            let withSnippets = pure . fmap (codeInclude snippetMap)
                withBiblio = Bib.pandocBiblioCompilerWith readerOpts cslFile bibFile
            
            getResourceBody
              >>= withBiblio
              >>= withKaTeX
              >>= withSnippets
              >>= postCompiler

    match postGlob postRules

    -- static pages

    match "index.html" $ do
        route idRoute
        compile $ do
            posts <- lexical <$> loadAll postGlob

            let pubCtx = listField "posts" ctx (return posts)

            let indexCtx = pubCtx `mappend` ctx

            getResourceBody
                >>= applyAsTemplate indexCtx
                >>= loadAndApplyTemplate "templates/page.html"    ctx
                >>= loadAndApplyTemplate "templates/default.html" ctx
                >>= adjustUrls

    match "templates/*" $ compile templateBodyCompiler

-- | Sort pages in lexical order, by file path.
lexical :: [Item a] -> [Item a]
lexical = sortBy (comparing $ toFilePath . itemIdentifier)

--------------------------------------------------------------------------------

-- http://blog.tpleyer.de/posts/2019-04-21-external-code-inclusion-with-hakyll.html

toSnippetMap :: [Item String] -> Map FilePath Text
toSnippetMap is = Map.fromList kvs
  where kvs = map ((toFilePath . itemIdentifier) &&& (T.pack . itemBody)) is

pandocCompilerWithCodeInsertion :: Map.Map FilePath Text -> Compiler (Item String)
pandocCompilerWithCodeInsertion snippetMap =
  pandocCompilerWithTransform ropts writerOpts (codeInclude snippetMap)
  where
    ropts = readerOpts {
        TPO.readerExtensions =
          TPE.disableExtension TPE.Ext_tex_math_dollars $
          TPE.disableExtension TPE.Ext_tex_math_double_backslash $
          TPE.disableExtension TPE.Ext_tex_math_single_backslash $
          TPO.readerExtensions readerOpts
    }

codeInclude :: Map.Map FilePath Text -> Pandoc -> Pandoc
codeInclude snippetMap = walk $ concatMap $ \block -> case block of
  codeBlock@(CodeBlock (_,cs,_) code) ->
    if "edit" `elem` cs
      then [makeBlock code]
      else [codeBlock]
  div@(Div (_,cs,_) _) -> if "code-include" `elem` cs
                          then codeBlockFromDiv snippetMap div
                          else [block]
  _ -> [block]

makeBlock !t =
  let html = "<div class='snippet'><pre>" <> t <> "</pre></div>" in
  let result = Debug.Trace.trace (T.unpack html) html in
  RawBlock (Format "html") result

codeBlockFromDiv :: Map FilePath Text -> Block -> [Block]
codeBlockFromDiv snippetMap div@(Div (_,_,kvs) _) =
  let classes = maybeToList $ lookup "lexer" kvs
      content = (lookup "file" kvs >>= (`Map.lookup` snippetMap) . T.unpack)
      -- makeBlock = CodeBlock ("",classes,[])
  in maybe [] (singleton . makeBlock) content
codeBlockFromDiv _ _ = []

--------------------------------------------------------------------------------

if' :: Bool -> a -> a -> a
if' b x y = if b then x else y

--------------------------------------------------------------------------------

withInternalUrls :: (String -> String) -> String -> String
withInternalUrls f = withUrls h
    where h :: String -> String
          h = ap (liftM2 if' isExternal id) f

-- | Strip ".html" extension from all internal links.  Useful when
-- publishing to GitHub Pages, which redirects extensionless urls.
removeExt :: Item String -> Compiler (Item String)
removeExt item = do
    route <- getRoute $ itemIdentifier item
    return $ case route of
        Nothing -> item
        Just r  -> fmap (withInternalUrls f) item
    where
        f = ap fromMaybe (stripSuffix ".html")

-- | A 'Hakyll.Web.Template.Context.functionField' that does the same as 'Hakyll.Web.RelativizeUrls.relativizeUrls', but can be used anywhere in a template.
-- You can call it in a template like this:
--
-- > $relativizeUrl("/url/to/relativize")$
--
-- You can also refer to other fields. 
-- Let's say that @pathToImages@ is another Hakyll field that produces @"\/hi\/there"@.
-- We can then do the following:
--
-- > $relativizeUrl(pathToImages)$
relativizeUrl :: Context a
relativizeUrl = functionField "relativizeUrl" $ \args item ->
    case args of
        [k] -> do   route <- getRoute $ itemIdentifier item
                    return $ case route of
                        Nothing -> k
                        Just r -> rel k (toSiteRoot r)
        _   -> fail "relativizeUrl only needs a single argument"
     where
        isRel x = "/" `isPrefixOf` x && not ("//" `isPrefixOf` x)
        rel x root = if isRel x then root ++ x else x

--------------------------------------------------------------------------------

postCtx :: Context String
postCtx =
    dateField "date" dateFmt             `mappend`
    dateField "year" "%Y"                `mappend`
    dateField "month" "%B"               `mappend`
    metaDateField "date_updated" dateFmt `mappend`
    relativizeUrl `mappend`
    defaultContext
    where
        dateFmt = "%B %e, %Y"

ctxWithDate :: Time.UTCTime -> Context String -> Context String
ctxWithDate time ctx =
    constField "date_generated" (Time.formatTime defaultTimeLocale "%B %e, %Y" time)
    `mappend` ctx

---- KATEX MATH ----------------------------------------------------------------

-- | Renders all math equations in a Pandoc document using KaTeX.
-- modified from https://ifazk.com/blog/2018-11-20-JavaScript-free-Hakyll-site.html
withKaTeX :: Item Pandoc -> Compiler (Item Pandoc)
withKaTeX pandoc = do
  id     <- getUnderlying
  s      <- getMetadataField id "nokatex"
  macros <- fmap T.pack <$> getMetadataField id "katex_macros"
  let renderKatex = unsafeCompiler . kaTeXifyIO macros
  case s of
    Just _  -> pure pandoc -- todo: this is wrong
    Nothing -> (traverse renderKatex pandoc)

---- DATES ---------------------------------------------------------------------

-- | Looks for a date in the metadata corresponding to the key,
-- and re-format it to have the specified format. 
metaDateField :: String     -- ^ Key in which the rendered date should be placed
              -> String     -- ^ Format to use on the date
              -> Context a  -- ^ Resulting context
metaDateField = metaDateFieldWith defaultTimeLocale

-- https://hackage.haskell.org/package/hakyll-4.14.0.0/docs/src/Hakyll.Web.Template.Context.html#dateFieldWith
metaDateFieldWith :: TimeLocale  -- ^ Output time locale
              -> String      -- ^ Destination key
              -> String      -- ^ Format to use on the date
              -> Context a   -- ^ Resulting context
metaDateFieldWith locale key format = field key $ \i -> do
    time <- getTimeMeta locale key $ itemIdentifier i
    case time of
        Nothing -> noResult "no metadata field 'date_updated'"
        Just t  -> return $ formatTime locale format t

-- | Parser for extracting and parsing a date from the specified metadata key.
-- https://hackage.haskell.org/package/hakyll-4.14.0.0/docs/src/Hakyll.Web.Template.Context.html#getItemUTC
getTimeMeta :: (MonadMetadata m, MonadFail m)
           => TimeLocale        -- ^ Output time locale
           -> String            -- ^ Key
           -> Identifier        -- ^ Input page
           -> m (Maybe UTCTime) -- ^ Parsed UTCTime
getTimeMeta locale key ident = do
    metadata <- getMetadata ident
    let tryField k fmt = lookupString k metadata >>= parseTime' fmt

    return $ msum $
        [tryField key fmt | fmt <- formats]
  where
    parseTime' = parseTimeM True locale
    formats    =
        [ "%a, %d %b %Y %H:%M:%S %Z"
        , "%a, %d %b %Y %H:%M:%S"
        , "%Y-%m-%dT%H:%M:%S%Z"
        , "%Y-%m-%dT%H:%M:%S"
        , "%Y-%m-%d %H:%M:%S%Z"
        , "%Y-%m-%d %H:%M:%S"
        , "%Y-%m-%d"
        , "%B %e, %Y %l:%M %p"
        , "%B %e, %Y"
        , "%b %d, %Y"
        ]


---- PANDOC OPTIONS ------------------------------------------------------------

-- pandoc reader options
readerOpts :: TPO.ReaderOptions
readerOpts = defaultHakyllReaderOptions {
        TPO.readerExtensions = ext
    }
    where ext = TPE.disableExtension TPE.Ext_smart $
                TPO.readerExtensions defaultHakyllReaderOptions
             <> TPE.extensionsFromList [
                  TPE.Ext_fenced_divs,
                  TPE.Ext_citations,
                  TPE.Ext_raw_html,
                  TPE.Ext_fenced_code_attributes
                ]

-- pandoc writer options
writerOpts :: TPO.WriterOptions
writerOpts = defaultHakyllWriterOptions
    { TPO.writerTableOfContents = True
    , TPO.writerTOCDepth        = 3
    , TPO.writerTemplate        = Just tocTemplate
    , TPO.writerExtensions      = ext
    }
    where ext = TPE.disableExtension TPE.Ext_smart $
                TPO.writerExtensions defaultHakyllWriterOptions
             <> TPE.extensionsFromList [
                  TPE.Ext_fenced_divs,
                  TPE.Ext_citations,
                  TPE.Ext_raw_html,
                  TPE.Ext_fenced_code_attributes
                ]

-- https://svejcar.dev/posts/2019/11/27/table-of-contents-in-hakyll/
tocTemplate :: Template Text
tocTemplate = either error id . runIdentity . compileTemplate "" $ T.unlines
  [ "<div class=\"toc\"><h2>Table of Contents</h2>"
  , "$toc$"
  , "</div>"
  , "$body$"
  ]

---- TAGS ----------------------------------------------------------------------

-- | add "tags" and "tools" fields to the context
postCtxWithTags :: Tags -> Tags -> Context String
postCtxWithTags tags tools =
  tagsFieldWith getTags  (renderLink "tag")  concatTags "tags"  tags  `mappend`
  tagsFieldWith getTools (renderLink "tool") concatTags "tools" tools `mappend`
  postCtx
    where
      concatTags = mconcat . intersperse " "

-- | Obtain tags from a page in the default way: parse them from the @tags@
-- metadata field. This can either be a list or a comma-separated string.
-- https://hackage.haskell.org/package/hakyll-4.14.0.0/docs/src/Hakyll.Web.Tags.html#getTags
getTools :: MonadMetadata m => Identifier -> m [String]
getTools identifier = do
  metadata <- getMetadata identifier
  let single = lookupStringList "tools" metadata
  let multi  = map trim . splitAll "," <$> lookupString "tools" metadata
  return $ fromMaybe [] $ single <|> multi

renderLink :: H.AttributeValue -> String -> Maybe FilePath -> Maybe H.Html
renderLink _ _ Nothing = Nothing
renderLink cls tag (Just filePath) =
  Just $ H.a
    ! A.href (toValue $ toUrl filePath)
    ! A.class_ cls
    $ toHtml tag