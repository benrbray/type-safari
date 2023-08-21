-- based on `fourmolu-wasm` by Brandon Chinn
-- https://github.com/fourmolu/fourmolu/blob/8aa2200fb38345d624d9682a051682094017bf8e/web/fourmolu-wasm/src/Main.hs#L91-L148

{-# LANGUAGE AllowAmbiguousTypes #-}

module TypeSafari.FFI.StringWithLen where

import Foreign (Ptr)
import Foreign qualified
import Foreign.C.Types (CChar)

import Prelude

import TypeSafari.FFI.Util (alignmentFor, nextPtr, sizeFor)

--------------------------------------------------------------------------------

newtype StringWithLen = StringWithLen {unStringWithLen :: (Ptr CChar, Int)}

instance Foreign.Storable StringWithLen where
  sizeOf _ =
    aligned @StringWithLen
      . addSize @Int
      . addSize @(Ptr CChar)
      $ 0
    where
      addSize :: forall a. (Foreign.Storable a) => Int -> Int
      addSize x = aligned @a (x + sizeFor @a)

      aligned :: forall a. (Foreign.Storable a) => Int -> Int
      aligned = (`pad` alignmentFor @a)

      pad x n
        | x `mod` n == 0 = x
        | otherwise = pad (x + 1) n

  alignment _ =
    maximum
      [ alignmentFor @(Ptr CChar),
        alignmentFor @Int
      ]

  peek stringWithLenPtr = do
    stringPtr <- Foreign.peek stringPtrPtr
    len <- Foreign.peek lenPtr
    pure $ StringWithLen (stringPtr, len)
    where
      stringPtrPtr = Foreign.castPtr stringWithLenPtr :: Ptr (Ptr CChar)
      lenPtr = nextPtr stringPtrPtr :: Ptr Int

  poke stringWithLenPtr (StringWithLen (stringPtr, len)) = do
    Foreign.poke stringPtrPtr stringPtr
    Foreign.poke lenPtr len
    where
      stringPtrPtr = Foreign.castPtr stringWithLenPtr :: Ptr (Ptr CChar)
      lenPtr = nextPtr stringPtrPtr :: Ptr Int

getString :: Ptr StringWithLen -> IO (Ptr CChar)
getString = fmap (fst . unStringWithLen) . Foreign.peek

getStringLen :: Ptr StringWithLen -> IO Int
getStringLen = fmap (snd . unStringWithLen) . Foreign.peek

mallocStringWithLen :: Ptr CChar -> Int -> IO (Ptr StringWithLen)
mallocStringWithLen buf len = do
  stringPtr <- Foreign.mallocBytes len
  Foreign.copyBytes stringPtr buf len
  structPtr <- Foreign.malloc
  Foreign.poke structPtr $ StringWithLen (stringPtr, len)
  pure structPtr

freeStringWithLen :: Ptr StringWithLen -> IO ()
freeStringWithLen stringWithLenPtr = do
  Foreign.free =<< getString stringWithLenPtr
  Foreign.free stringWithLenPtr