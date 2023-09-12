module TypeSafari.Core (
  module Prelude,
  module Protolude,
  module Data.Either.Extra,
  module Data.Functor.Identity,
  module Data.Set,
  module Data.Map,
  module Data.Text,
  module Control.Monad.Except,
  toFst,
  toSnd
) where

import Prelude hiding (Show, show)
import Protolude (Show, show, catMaybes, mapMaybe)
import Data.Either.Extra
import Data.Functor.Identity
import Data.Text (Text)
import Data.Set (Set)
import Data.Map (Map)
import Control.Monad.Except
import GHC.Base (ap)

------------------------------------------------------------

toFst :: (a -> b) -> a -> (b,a)
toFst = ((,) =<<)

toSnd :: (a -> b) -> a -> (a,b)
toSnd = ap (,)