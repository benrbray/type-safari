module TypeSafari.Pretty (
  Pretty(..),
  prettyPrint,
  nl,
  sp
) where

import Data.Text (Text)
import Data.Text qualified as T
import Prelude

------------------------------------------------------------

class Pretty p where
  pretty :: p -> Text

instance Pretty a => Pretty [a] where
  pretty :: [a] -> Text
  pretty = foldr ((<>) . pretty) ""

prettyPrint :: (Pretty p) => p -> IO ()
prettyPrint = putStrLn . T.unpack . pretty

nl :: Text -> Text -> Text
t1 `nl` t2 = t1 <> "\n" <> t2
sp :: Text -> Text -> Text
t1 `sp` t2 = t1 <> " " <> t2