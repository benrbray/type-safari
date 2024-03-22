---
title: Unification
date: 2024-03-09
---

# E-Unification

For an equational theory $=_E$, the **e-unification** problem asks:

> given terms $t$ and $u$, find a substitution $S$ such that $S(t) =_E S(u)$

There may be infinitely many unifiers.  A unifier $S_1$ is **more general than** unifier $S_2$, written $S_1 \preccurlyeq S_2$, if $S_1 ; R =_E S_2$ for some substitution $R$.  In this case, we also say $S_2$ is an **instance** of $S_1$.

* an equational theory is **regular** if $t_1 =_E t_2 \implies vars(t_1) = vars(t_2)$.  The theory of abelian groups is nonregular due to the axiom of inverses.
* some properties of the equational theory of commutative groups:
	- **unitary** -- possesses most general unifiers
	- unification is **decidable**