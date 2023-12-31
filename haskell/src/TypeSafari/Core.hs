module TypeSafari.Core (
  module Prelude,
  module Protolude,
  module Data.Either.Extra,
  module Data.Functor.Identity,
  module Data.Set,
  module Data.Map,
  module Data.Text,
  module Control.Arrow,
  module Control.Monad.Except,
  toFst,
  toSnd,
  mapFst,
  mapSnd,
  mapFstA,
  mapSndA
) where

import Prelude hiding (Show, show, span)
import Protolude (Show, show, catMaybes, mapMaybe)
import Data.Either.Extra
import Data.Functor.Identity
import Data.Text (Text)
import Data.Set (Set)
import Data.Map (Map)
import Control.Arrow((>>>))
import Control.Monad.Except
import GHC.Base (ap)

------------------------------------------------------------

toFst :: (a -> b) -> a -> (b,a)
toFst = ((,) =<<)

toSnd :: (a -> b) -> a -> (a,b)
toSnd = ap (,)

mapFst :: (a -> c) -> (a,b) -> (c, b)
mapFst f (x,y) = (f x, y)

mapSnd :: (b -> c) -> (a,b) -> (a, c)
mapSnd f (x,y) = (x, f y)

mapFstA :: Applicative m => (a -> m c) -> (a,b) -> m (c,b)
mapFstA f (x,y) = (,y) <$> f x

mapSndA :: Applicative m => (b -> m c) -> (a,b) -> m (a,c)
mapSndA f (x,y) = (x,) <$> f y