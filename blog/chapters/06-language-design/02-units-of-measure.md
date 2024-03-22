---
title: Units of Measure
date: 2023-09-27
---

> Note: The text on this page is not mostly copied from one of the references.

## Units and Dimensions

* a system of measurements specifies a set of **base dimensions** (time, length, mass, current, temperature, amount, luminous intensity)
* only quantities having the same dimension may be compared, equated, added, or subtracted
* a **unit** facilitates _measurement_ and _comparison_ of numeric values of a specific dimension (`kg` and `lbs` both measure mass)
* there are also derived dimensions (velocity) and derived units (watt-hours)



## Types and Units of Measure

How are units _different_ from types?  As observed by [@kennedy2009:units-theory-practice], one might encode types in an ML-style language by defining wrapper types for each unit:

```haskell
newtype Met = Met Double
newtype Sec = Sec Double

newtype Unit num = UOne num
type Mult a b = (a,b)
type Inv a = ???

type Acceleration = Mult<Met, Inv<Prod<Sec,Sec>>>

newtype Amp = Amp Double
type Coulomb = Mult Amp S

mult :: a -> b -> Mult a b
mult = (a,b)

-- type error! Mult<Sec, Amp> =/= Mult<Amp,Sec>
charge :: Coulomb
charge = mult (Sec 1.0) (Amp 4.0)
```

As shown above, this encoding of units does not capture the _equations_ that hold between syntactically distinct units.  For example, the units `m*s` and `s*m` are equivalent, and `s / s` can be simplified to `1`.  

### Grammar for Units

Here is a formal grammar for units of measure:

$$
u,v,w ::= b | \alpha | 1 | u * v | u^{-1}
$$

* $u$, $v$, $w$ stand for unit expressions derived from the above grammar
* $b$ ranges over a set of _base units_ $B$ such as `kg`, `m`, `s`
* the "unit" unit, written `1`, represents dimensionless quantities without nits
* 

## Polymorphism, Constants

> ([@kennedy1996:programming-dimensions, page 8]), it is assumed that for each base dimension $B$ introduced, a value of type $\mathrm{float}\langle B \rangle$ is available which acts as the default unit of measure associated with that dimension.  Other values of type $\mathrm{float}\langle B \rangle$ are constructed by multiplying this unit by a dimensionless numeric constant.

* numeric constants are dimensionless, except zero which must be polymorphic

### Dimensions and Dependent Types

Consider the function `pow n x` which raises `x` to the `n`th power. 

```
pow :: Int -> Float
pow 0 x = `.0
pow n x = if n < 0 
	then 1.0 / pow (-n)  x
	else x   * pow (n-1) x
```

In a language with dimensions, if $x :: \mathtt{float}[d]$, we would like $\mathtt{pow}\,n\,x :: \mathtt{float}[d^n]$.  However, this type depends on the _runtime value_ of the argument `n`, so the only way of expressing the intuitive type of this function is by a **dependent type** such as

```
forall (d: dim) (n: Int). float[d] -> float[d^n]
```

The inability to write such functions is not much of a problem in pratcice, as almost all numerical algorithms deal with constant integer powers.  If necessary, the type of higher-order unit operations like `pow` could be hard-coded into the type system.

### Dimensions and Higher-Order Polymorphism

Consider the following function:

```
polyadd prod = prod 2.0 kg + prod kg 3.0
```

Assuming `kg :: float[M]`, the function `prod` is used at more than one dimension type.  This is sometimes called *polymorphic abstraction*.  The type of `polyadd` can only be expressed by allowing a type scheme in the argument position in a function type:

```
(forall (d1 d2 : dim), real[d1] -> real[d2] -> real[d1*d2]) -> real[M]
```

> [@kennedy1996:programming-dimensions] Type inference for ML in the presence of polymorphic abstraction is undecidable and equivalent to the problem of **semi-unification**.


### Dimensions and Let-Generalization

As observed by [@gundry2011:type-inference-units],

* the Damas-Milner type inference algorithm uses the **occurs-check** to identify generalizable variables (those that are free in the type but not the environment)
* however, **variable occurrence does not imply variable dependency** for the equational theory of abelian groups, and so the occurs-check is insufficient
* (given the equation $\alpha \equiv \tau$, where $\alpha$ is a unification variable and $\tau$ is a type, the solution $\alpha := \tau$ is not necessarily most general!)

Consider the following lambda abstraction, with a local `let`,

```haskell
\x -> let d = div x in (d mass, d time)
where
  div :: forall a b. float[a*b] -> float[a] -> float[b]
  mass :: float[kg]
  time :: float[s]
```

The inference algorithm of Kennedy fails to infer a type for this term, because polymorphism is lost:

* `d` is given the monotype `float[a] -> float[c/a]` for unification variables `a` and `c`
* the unification variable `a` cannot unify with both **kg** and **s** simultaneously

However, if `d` were given the principal type scheme `forall a. float[a] -> float[c/a]`, then the original term could be assigned type `float[c] -> (float[c/kg], float[c/s])`


## References

[@kennedy2009:units-theory-practice]
[@kennedy1996:programming-dimensions]
[@kennedy1996:type-inference-equational-theories]