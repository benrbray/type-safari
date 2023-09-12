module TypeSafari.RecursionSchemes.Mu where

import Control.Arrow

import TypeSafari.Core

------------------------------------------------------------

newtype Mu f = InF { outF :: f (Mu f) }

deriving stock instance Eq (f (Mu f)) => Eq (Mu f)

cata :: Functor f => (f b -> b) -> Mu f -> b
cata fn =
  outF                -- peel off one layer of the Expr
  >>> fmap (cata fn)  -- apply `mystery fn` to every subexpr
  >>> fn              -- apply fn to the top-level

ana :: forall b f. Functor f => (b -> f b) -> (b -> Mu f)
ana fn =
  fn                -- wrap b in one more layer
  >>> fmap (ana fn) -- ???
  >>> InF           -- convert the wrapped value to a value of the fix type