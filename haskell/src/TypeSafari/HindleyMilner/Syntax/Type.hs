module TypeSafari.HindleyMilner.Syntax.Type where

import TypeSafari.Core
import TypeSafari.Pretty
import TypeSafari.HindleyMilner.Syntax.Core

------------------------------------------------------------

-- | A concrete type variable.
newtype TV
  -- | Bound type variables are _always_ bound by an enclosing @ForAll@.
  --   * may appear in type annotations in a source program
  --   * no well-formed @Type@ ever has a free @TvBound@.
  --  Represented as de Bruijn indices, where n refers to the nth enclosing forall. 
  = TvBound Int
  -- Stands in for a constant, but unknown type.
  --   * never bound by a @forall@, and can be free in a `Type`.
  --   * the string is a hint used for documentation
  -- TvSkolem Int Text
  deriving stock (Show, Eq, Ord)

-- | A type metavariable is a placeholder for an unknown monotype.
--   * Never quantified by a forall.
--   * Created only by the type inference engine during constraint generation.
--   * Metavariables are the _only_ targets of substitution.
--   * Successful type inference never leaves behind metavariables.
newtype MV
  = MV Name
  deriving stock (Show, Eq, Ord)

data Type
  = TypeVar TV        -- type variable
  | TypeMetaVar MV    -- type metavariable
  | TypeCon Text      -- type constructor
  | TypeArr Type Type -- arrow type
  deriving stock (Show, Eq, Ord)

-- type scheme models polymorphic types
data TypeScheme
  -- | binds @n@ type variables
  = Forall Int Type
  deriving stock (Eq, Show)

------------------------------------------------------------

instance Pretty Type where
  pretty :: Type -> Text
  pretty (TypeVar t) = pretty t
  pretty (TypeMetaVar m) = pretty m
  pretty (TypeCon t) = t
  pretty (TypeArr t1 t2) = "(" <> pretty t1 <> " --> " <> pretty t2 <> ")"

replicateText :: Int -> Text -> Text
replicateText n t = foldl1 (<>) $ replicate n t

instance Pretty TypeScheme where
  pretty :: TypeScheme -> Text
  pretty (Forall 0 t) = pretty t
  pretty (Forall k t) =  replicateText k "∀" <> ". " <> pretty t

instance Pretty TV where
  pretty :: TV -> Text
  pretty (TvBound k) = show k

instance Pretty MV where
  pretty :: MV -> Text
  pretty (MV (Name t)) = "_(" <> t <> ")"
  pretty (MV (Fresh k)) = "_" <> show k