---
title: Higher-Rank Types
date: 2023-09-27
---

For now, this page is a summary of [@peyton-jones2007:inference-arbitrary-rank].  Most of the following is paraphrased or directly quoted from the article.

# Introduction

Haskell implements the Damas-Milner rule that a lambda-bound argument can only have a monomorphic type.  Accordingly, the following program is rejected:

```haskell
foo :: ([Bool], [Char])
foo = let f x = (x [True, False], x [’a’,’b’]) in
      f reverse
main = print foo
```

The central question of this work is:

> Is it possible to enhance the Damas-Milner type system to allow higher-rank types, but without making the type system, or its inference algorithm, much more complicated?

The main contribution of this paper is to present a practical type system and inference algorithm for arbitrary-rank types, with the following properties:

* every program typeable with Damas-Milner remains typeable in the new system.
* accomodates types of arbitrary finite rank (not restricted, for example, to rank-2 types)
* the type system specifies precisely where annotations are required, and where they are optional
* the annotation burden is less than the system presented by [@odersky1996:putting-annotations-work]
* a type-inference engine for Damas-Milner can be modified very straightforwardly to
accommodate arbitrary-rank types

# Motivation

**Data Structure Fusion:** Short-cut deforestation makes use of the following type:

```haskell
build :: forall a. (forall b. (a -> b -> b) -> b -> b) -> [a]
```

**Encapsulation:** The encapsulated state monad `ST` requires a function `runST` with type:

```haskell
runST :: forall a. (forall s. ST s a) -> a
```

**Dynamic Types:**  From Baars & Swierstra:

```haskell
data Equal a b = Equal (forall f . f a -> f b)
```

**Nested Data Types:**  Paterson & Bird use the following data type to encode lambda terms, in which the nesting depth is reflected in the type:

```haskell
data Term v = Var v | App (Term v) (Term v) | Lam (Term (Incr v))
data Incr v = Zero | Succ v

foldT :: (forall a. a -> n a)
-> (forall a. n a -> n a -> n a)
-> (forall a. n (Incr a) -> n a)
-> Term b -> n b
```

# The Key Ideas

## Rank

The **rank** of a type describes the depth at which universal quantifiers appear contravariantly.

$$
\begin{aligned}
\text{monotypes} &&
  \tau, \sigma^0 &::= a     \mid
  \tau_1 \rightarrow \tau_2 \\
\text{polytypes} &&
  \sigma^{n+1} &::= \sigma^n        \mid
  \sigma^n \rightarrow \sigma^{n+1} \mid
  \forall a. \sigma^{n+1}
\end{aligned}
$$

A rank-0 type, having no forall, is called a **monotype**, and types of higher rank are called **polytypes**.  For example,

```haskell
Int -> Int                -- rank 0
forall a. a -> a          -- rank 1
Int -> (forall a. a -> a) -- rank 1
(forall a. a -> a) -> Int -- rank 2
```

## Exploiting Annotations

## Subsumption

## Predicativity

Once one allows polytypes nested inside function types, it is natural to ask whether one can also call a polymorphic function at a polytype.  For example,

```haskell
revapp :: a -> (a->b) -> b
revapp x f = f x
poly :: (forall v. v -> v) -> (Int, Bool)
poly f = (f 3, f True)
```

Is the application `(revapp (\x->x) poly)` legal?  The type variable `a` would need to be instantiated with `forall v. v -> v`.

A type system which allows polymorphic functions to be instantiated at a polytype is called **impredicative**, while a **predicative** system only allows a polymorphic function to be instantiated with a monotype.

The type system presented by [@peyton-jones2007:inference-arbitrary-rank] is **predicative**.  An inference algorithm for an impredicative type system was presented by [@serrano2020:quick-look-impredicativity] and introduced into GHC.

# References