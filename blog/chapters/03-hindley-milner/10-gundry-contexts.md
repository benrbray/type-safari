---
title: Gundry Thesis Notes
date: 2024-03-10
---

> these notes are almost entirely quoted from [@gundry2013:phd-inference-haskell-dependent]

## Chapter 1:  Introduction

Proper management of variable scope is crucial for correctly implementing type inference.

* type inference algorithms create existential variables to stand for unknown type expressions, then solve for these variables by unification
* with higher-rank types, it is necessary to carefully manage which universally-quantified variables are in scope for each existential variable
* even in the simple Hindley-Milner system, variable dependencies are key to understanding **let-generalization**
* a careful, systematic treatment of contexts can lead to better algorithms (for example, [@gundry2011:type-inference-units] resolves issues with let-generalization faced by [@kennedy1996:programming-dimensions] when adding *dimension* types to Hindley-Milner)

Considering **contextualized** type inference and unification problems leads to a precise notion of the minimal commitment necessary to solve a problem, and reveals the underlying structure behind the let-generalization step.

## Chapter 2:  Hindley-Milner

### 2.1 Unification for Type Expressions with Free Variables

To define unification for type expressions with free variables, we must first define:

* a notion of well-formed contexts
* a notion of well-formed types-in-context
* a notion of equality on types

#### Well-Formed Contexts

A **context** $\Theta$ is a dependency-ordered list which introduces named variables and ascribes properties to them.  Syntactically, contexts are read left-to-right and contain

* unknown type metavariables, annotated with kind $*$
* definitions of metavariables
* given term variables, annotated with a type scheme
* markers $(\textbf{;})$ which divide the context into **locales**

Formally,

$$
\begin{aligned}
\Theta
&::= \cdot                       && \text{(empty context)} \\
&\mid \Theta, \alpha : *         && \text{(unknown metavariable)} \\
&\mid \Theta, \alpha := \tau : * && \text{(metavariable definition)} \\
&\mid \Theta, x : \sigma         && \text{(term variable)} \\
&\mid \Theta \textbf{ ; }        && \text{(locale marker)}
\end{aligned}
$$

We define a well-formedness judgement $\Theta \vdash \mathbf{ctx}$ (pronounced *"$\Theta$ is a context"*), which holds when

* every variable is distinct
* every property is well-formed for the preceding context

:::example
(Valid Contexts)
* $[\alpha \colon *, \beta\colon *, x\colon \alpha \rightarrow \beta]$ is valid
:::

:::example
(Invalid Contexts)
* $[x:\alpha, \alpha: *]$ is invalid, because $\alpha$ is not in scope for $x$
:::

### Generalization and Instantiation

As explained by @[diehl2018-hindley-milner], at the heart of Hindley-Milner are two fundamental operations:

* **Generalization** converts a type $\tau$ into a scheme $\sigma$ by binding all free type variables in $\tau$ with a `forall`
* **Instantiation** converts a type scheme $\sigma$ into a type $\tau$ by creating fresh names for each type variable which does not appear in the current typing environment



### Type Inference vs. Unification

* **Unification** is the problem of finding definitions for metavariables in order to make an equation hold.
* **Type inference** involves solving unification problems and finding a type that makes typing judgements hold.

Solutions to both problems should be "most general" in that they should make the least commitment necessary to solve the equation or assign a type.

* @[gundry2013-type-inference-haskell] makes this precise by introducing a general notion of "statements" that can be judged in contexts, and defining the permissible "information increases" that move a context towards making a statement hold.

### Advice: Type Variables vs. Unification Variables

Reproducing @[prophet2023_type-inference-advice]'s advice:

> * **Type Variables** are always bound by `forall` and represent variables that can be instantiated to any possible concrete type.  For example, `forall a. a -> a` can be instantiated to `Int -> Int` or `Bool -> Bool`
> * **Unification Variables / Metavariables** are placeholders that stand for as-of-yet-unknown concrete types.  These usually originate from usages of polymorphic types (type variables are instantiated with *fresh* unification variables at every use site, instantiating the type variable to a possibly different concrete type which may or may not yet be known.)
> * **Skolems** are type constants that are only equal to themselves.  These are needed when *checking against* polymorphic types.  The idea is that a function with type `forall a. a -> a` cannot make any assumptions about the type of its parameter, which is ensured by checking it against the type `#a -> #a` where `#a` is a fresh skolem.

* **type variables** are always bound by `forall` and represent variables that can be instantiated to any possible concrete type.  For example, \`for

### Occurs Check

> In Algorithm W, the occurs check is used to discover type dependencies just in time for generalisation. When inferring the type of `let x = t1 in t2`, the type of `t1` must first be inferred, then *‘generic’* type variables, those occurring in `t1` but not the enclosing bindings, must be quantified over.
>
> The idea is that type variables may be generalised over (and freely substituted) if they are not recording a necessary coincidence. For example, a typing derivation for `λy.let x = y in x` might have ``{y :α} ` y :α`` for the definiens. One is certainly not free to generalise over `α`, as this would allow any type to be assigned to `x`! On the other hand, a derivation for `let x = λy.y in x x` could include $∅ \vdash λy.y : α → α$, and α must be generalised over for the whole expression to be well-typed.
>
> In both unification and type inference, the occurs check is used to detect dependencies between variables. The traditional approach of leaving unification variables floating in space, without any structure, works for the Hindley-Milner system because there are no scoping conditions on candidate solutions for variables. This will not always be the case, so it is better to expose the structure and manage dependencies explicitly.
>
> In further contrast to other presentations of unification and Hindley-Milner type inference, the algorithm I will describe is based on contexts carrying variable definitions as well as declarations. This allows the context to record the entire result of the algorithm.

### Let-Generalization

The notion of [[let-generalization]] refers to the assignment of polymorphic types to definitions.  The term

```haskell
let f x = (x, x) in (f True, f 3) :: ((Bool, Bool), (Int, Int))
```

is well typed because `f` is assigned the type `forall a. a -> (a,a)`, which is determined by inferring the type

## References

### Reference Implementations of Hindley-Milner

@[diehl2018-hindley-milner] for a Haskell implementation




## References