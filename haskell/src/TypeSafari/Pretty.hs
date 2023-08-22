module TypeSafari.Pretty (
  Pretty(..),
  prettyPrint
) where

import Data.Text (Text)
import Data.Text qualified as T
import Prelude

------------------------------------------------------------

class Pretty p where
  pretty :: p -> Text

prettyPrint :: (Pretty p) => p -> IO ()
prettyPrint = putStrLn . T.unpack . pretty