module TypeSafari.HindleyMilner.Syntax.Concrete where

import TypeSafari.Core
import TypeSafari.RecursionSchemes.Mu (Mu)

---- concrete syntax for types -----------------------------

data TypeF s a
  = TypeVar s Text
  | TypeMetaVar s Text
  | TypeCon s Text
  | TypeArr s a a
  deriving stock (Show, Eq, Ord)

type Type s = Mu (TypeF s)