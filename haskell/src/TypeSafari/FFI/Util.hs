-- https://github.com/fourmolu/fourmolu/blob/8aa2200fb38345d624d9682a051682094017bf8e/web/fourmolu-wasm/src/ForeignUtils.hs

{-# LANGUAGE AllowAmbiguousTypes #-}

module TypeSafari.FFI.Util
  ( sizeFor,
    alignmentFor,
    nextPtr,
  )
where

import Foreign
import Prelude

sizeFor :: forall a. (Storable a) => Int
sizeFor = sizeOf (undefined :: a)

alignmentFor :: forall a. (Storable a) => Int
alignmentFor = alignment (undefined :: a)

-- | Get a pointer to the address after the given pointer.
nextPtr :: forall a b. (Storable a, Storable b) => Ptr a -> Ptr b
nextPtr ptr = alignPtr (plusPtr ptr (sizeFor @a)) (alignmentFor @b)