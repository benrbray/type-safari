---
title: Quick Look Impredicativity
date: 2023-09-27
---

> Unless otherwise noted, everything on this page is quoted or paraphrased from [@serrano2020:quick-look-impredicativity].

In a predicative system, even something as basic as function composition fails on functions with higher-rank types.

```haskell
-- fails! (.) must be instantiated with a polytype!
f :: (forall a. [a] -> [a]) -> Int
g :: Bool -> (forall a. [a] -> [a])
h = f . g
```