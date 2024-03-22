---
title: Hindley-Milner Type System
date: 2023-09-27
---

abc

# Hindley-Milner Type System

Following [@gundry2013:phd-inference-haskell-dependent], the **Hindley-Milner** type system consists of the simply-typed $\lambda$-calculus plus `let`-expressions for polymorphic definitions.  For example, `let x = \y. y in x x` is well-typed:

* `x` is given the polymorphic type `forall a. a -> a`, which is instantiated in two different ways.
* first, at type `(b -> b) -> (b -> b)` and second at `b -> b`

By contrast, $\lambda$-bound variables are monomorphic, so `\x. x x` is ill-typed.

## Syntax

Under **Hindley-Milner**, the syntax of terms and types is

```
(term variables)  t,s  ::= x | λx.t | s t | let x = s in t
(type variables)  τ,υ ::= α | τ -> υ
```

## Type System

The typing context assigns each term variable a **type scheme**,

```
(type variables) α
(type scheme)    σ ::= τ | ∀α. σ
```

# Type Inference for Hindley-Milner

## Type Variables, Meta Variables

## Let-Generalization

compare

```haskell {.edit}
let f = (\x -> x) in makePair (f True) (f 5)
```

with

```haskell {.edit}
(\f -> makePair (f True) (f 5)) (\x -> x)
```

### Let Should Not be Generalized

See [@vytiniotis2010:let-not-generalize]:

> From the dawn of time, all derivatives of the classic Hindley-Milner
type system have supported implicit generalisation of local let bindings. Yet, as we will show, for more sophisticated type systems
implicit let-generalisation imposes a disproportionate complexity burden. Moreover, it turns out that the feature is very seldom
used, so we propose to eliminate it. The payoff is a substantial simplification, both of the specification of the type system, and of its
implementation.

See also [this reddit comment](https://www.reddit.com/r/haskell/comments/ujpzx3/was_simplified_subsumption_worth_it_for_industry/i7mn763/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) by Alexis King regarding subsumption and let-generalization.

```haskell
-- Vytiniotis et al. told us Let Should Not Be Generalized, and I wanted to believe them.
-- But a decade later, I’m getting really tired of (the following) not typechecking.
-- https://twitter.com/lexi_lambda/status/1160892876890476544
f :: A -> Maybe B -> Maybe C
      -> (Either A B, Either A C)
f x y z = (g y, g z)
  where
    g = maybe (Left x) Right
```

## Constraint Generation

[@heeren2002:generalizing]

### Type Equality Constraints

### Explicit Instance Constraints

### Implicit Instance Constraints

## First-Order Unification

# Examples

## Lambda-Bound Variables are Monomorphic

```haskell {.edit}
-- fails because lambda-bound variables are monomorphic under Hindley-Milner
let const = (\v -> \x -> v) in
let f = (\y -> if True then (y 1) else (y True)) in
f const
```

## Skolem Constants

```haskell {.edit}
-- the use of skolem constants helps to detect a type error below
-- https://genericlanguage.wordpress.com/2010/08/23/who-ordered-skolem-constants/
let foo = (\x -> x) in
(foo :: forall a b. a -> b)
```
