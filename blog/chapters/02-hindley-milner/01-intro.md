---
title: Type Inference for Hindley-Milner
date: 2023-09-27
---

abc

# Introduction

math $\int_a^b f(x) dx$

```haskell
-- fails because lambda-bound variables are monomorphic under Hindley-Milner
let const = (\v -> \x -> v) in
let f = (\y -> if True then (y 1) else (y True)) in
f const
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
