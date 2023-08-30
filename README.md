# `type-safari`

With this project, I aim to collect reference implementations of type inference algorithms, with particular emphasis on those features which are necessary for practical implementations, such as error reporting and incrementality.  

* The original code is based off of Stephen Diehl's excellent, but sadly unfinished, ["Write You a Haskell"](https://web.archive.org/web/20181017074008/http://dev.stephendiehl.com/fun/006_hindley_milner.html) series, but it has already diverged substantially.
* The name (and project) is inspired by Andras Kovacs' ["Elaboration Zoo"](https://github.com/AndrasKovacs/elaboration-zoo).  I briefly considered *Type Petting Zoo* for the name, but thought it might be a bit too silly :)

## Goals

* implement a wide range of type inference algorithms in a consistent style to facilitate comparison
* maintain a clear correspondence between typing judgements on paper and Haskell code
* develop a generic web interface (not necessarily a language server, but something similar) for debugging and for comparing the behavior of different type systems.
  * should show detailed typing information about the typing context at each source position
  * if possible, allow the user to interactively step through the inference procedure

## Road Map / References

Hindley-Milner & Extensions

* [ ] Algorithm W
* [ ] Algorithm M
* [ ] Constraint Generation & First-Order Unification
* [ ] Type Annotations
* [ ] Typed Holes
* [ ] Recursive Definitions
* [ ] Mutual Recursion
* [ ] Pattern Matching
* [ ] Local vs. Top-Level
* [ ] Higher Rank Polymorphism
* [ ] Row Polymorphism

Type Inference for Dependent Types

* [ ] Calculus of Constructions
* [ ] Calculus of Inductive Constructions
* [ ] Bidirectional Type Inference
* [ ] Higher-Order Unification, Pattern Unification