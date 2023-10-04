---
title: Hindley-Damas-Milner
date: 2023-09-27
---

```haskell {.edit}
-- fails because lambda-bound variables are monomorphic under Hindley-Milner
let const = (\v -> \x -> v) in
let f = (\y -> if True then (y 1) else (y True)) in
f const
```