# `type-safari`

With this project, I aim to collect reference implementations of type inference algorithms, with particular emphasis on those features which are necessary for practical implementations, such as error reporting and incrementality.  

## Inspiration

* The original code is based off of Stephen Diehl's excellent, but sadly unfinished, ["Write You a Haskell"](https://web.archive.org/web/20181017074008/http://dev.stephendiehl.com/fun/006_hindley_milner.html) series, but it has already diverged substantially.
* The name (and project) is inspired by Andrej Bauer and Matija Pretnar's ["Programming Language Zoo"](http://plzoo.andrej.com/) and Andras Kovacs' ["Elaboration Zoo"](https://github.com/AndrasKovacs/elaboration-zoo).  I briefly considered *Type Petting Zoo* for the name, but thought it might be a bit too silly :)
* Stephen Dolan's ["Counterexamples in Type Systems"](https://counterexamples.org/title.html)

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
* [ ] Units of Measure, Commutative Group Unification a la [Gundry 2013](https://adam.gundry.co.uk/pub/thesis/thesis-2013-12-03.pdf)

Type Inference for Dependent Types

* [ ] Calculus of Constructions
* [ ] Calculus of Inductive Constructions
* [ ] Bidirectional Type Inference
* [ ] Higher-Order Unification, Pattern Unification

## Uncategorized

Here are some topics I hope to cover, but I'm not quite sure how/where they fit in:

* interacttions between Hindley-Milner and subtyping
  * subsumption, and Haskell's "simplified subsumption"
  * Stephen Dolan's [Algebraic Subtyping](https://api.repository.cam.ac.uk/server/api/core/bitstreams/d50b4d1a-a688-46eb-bb4f-9f4e204d0f60/content)
* ML's value restriction, and OCaml's relaxation of the value restriction


## Resources

Hindley-Milner

* Ben Lynn, ["Hindley-Milner Type Inference (Outcoding Unix Geniuses)"](https://crypto.stanford.edu/~blynn/lambda/hm.html)
* Okmij, ["How OCaml Type Checker Works -- or What Polymorphism and Garbage Collection Have in Common"](https://okmij.org/ftp/ML/generalization.html)
  * explains Rémy's "efficient level-based generalization" [Rémy 1992, "Extension of ML Type System with a Sorted Equational Theory on Types"](http://gallium.inria.fr/~remy/ftp/eq-theory-on-types.pdf)
* StackOverflow, ["What part of Hindley-Milner do you not understand?"](https://stackoverflow.com/questions/12532552/what-part-of-hindley-milner-do-you-not-understand/42034379#42034379)
* Mark P. Jones, ["Typing Haskell in Haskell"](https://web.cecs.pdx.edu/~mpj/thih/thih.pdf)
* Brian McKenna 2013, ["Bottom-Up Type Annotation with the Cofree Comonad"](https://brianmckenna.org/blog/type_annotation_cofree)
  * a partial implementation (missing let-generalization) of Heeren2002's constraint-based Hindley-Milner using `Cofree` to represent annotated AST

Bidirectional Type-Checking

* Pfenning 2004, ["Lecture Notes on Bidirectional Type-Checking"](https://www.cs.cmu.edu/~fp/courses/15312-f04/handouts/15-bidirectional.pdf)
* Pierce & turner 2000, ["Local Type Inference"](https://www.cis.upenn.edu/~bcpierce/papers/lti-toplas.pdf)
  * Type inference algorithms have not caught up with the development of type _systems_, because it is hard to guarantee completeness.  Instead, this paper presents a bidirectional _local type inference_ algorithm for _partial type inference_.
