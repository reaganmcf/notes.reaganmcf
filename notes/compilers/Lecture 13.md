---
slug: "/compilers/lecture-13"
date: "2021-03-07"
title: "Compilers - Lecture 13"
---

# Lecture 13 - More Parsing

## Top-down parsers

#### LL(1), recursive descent
- Input: read left to right
- Construct leftmost derivation
- 1 input symbol look ahead
 
 ![](https://i.gyazo.com/b308810ac88c6522d477b7272095ac4f.png)


#### Example

Grammar `S -> % S % | & S & | $`

Our language can be described mathematically as: _{w $ w^R | w â (%, &)^*}_

Is this LL(1)?

Yes! Because as you push the left most derivation through, **you only need to look ahead one token at a time**, and you end up with a deterministic parse tree.

The grammar `S -> % S % | % & S % | $` is NOT LL(1), but rather LL(2).


### Formally defining LL(1)

_A -> ğ° | ğ s.t. First(ğ°) â© First(ğ) = â_

But, how do we compute the _First_ sets?

### Left Recursion

Remember the expression grammar?

```
Goal    -> Expr
Expr    -> Expr + Term
        |  Expr - Term
        |  Term
Term    -> Term * Factor
        | Term / Factor
        | Factor
Factor  -> number
        | id
```

**Top-down parsers cannot handle left-recursive grammars**

Formally, A grammar is _left recursive_ if â A â NT such that â a derivation A =>^+ Ağ°, for some string ğ° â (NT âª T)^+

Our expression grammar is left recursive
- This can lead to non-termination in a top-down parser
- For a top-down parser, any recursion must be right recursion
- We would like to convert the left recursion to right recursion

**Non-termination is a bad property in any part of a compiler**

#### Eliminating Left Recursion

To remove left recursion, we can transform the grammar

Consider a grammar fragment of the form
```
Fee -> Fee ğ°
     | ğ±
```
where neither ğ° nor ğ± start with _Fee_

We can rewrite this as
```
Fee -> ğ± Fie
Fie -> ğ° Fie
     | ğ´
```
where _Fie_ is a new non-terminal

**This accepts the same language, but uses only right recursion**

## Roadmap (Where are we?)

We set out to study parsing
- Specifying syntax
  - Context free grammars
  - Ambiguity
- Top-down parsers
  - Algorithm & its problem with left recursion
  - Left-recursion removal
  - Left factoring (will discuss later)
- Predictive top-down parsing
  - The LL(1) condition
  - Table-driven LL(1) parsers
  - Recursive descent parsers
    - Syntax directed translation (example)

### Picking the "Right" production

**If it picks the wrong production, a top-down parser may backtrack. Alternative is to look ahead in input & use context to pick correctly**

How much look ahead is needed?
- In general, an arbitrarily large amount
- Use the Cocke-Younger, Kasami algorithm or Earley's algorithm

Fortunately
- Large subclasses of CFGs can be parsed with limited look ahead
- Most programming language constructs fall in those subclasses

Among the interesting subclasses are _LL(1)_ and _LR(1)_ grammars

## Predictive Parsing

Basic idea
Given A -> ğ° | ğ±, the parser should be able to choose between ğ° and ğ±

FIRST Sets
  - For some rhs ğ° â G, define **FIRST(ğ°)** as the set of tokens that appear as the first symbol in some string that derives from ğ°
  - That is, a â FIRST(ğ°) iff a =>^* ağ², for some ğ²

The LL(1) property
If A -> ğ° and A -> ğ± both appear in the grammar, we would like _FIRST(ğ°) â© FIRST(ğ±) = â_ 
  - Note: This is _almost_ correct, but not quite!

This would allow the parser to make a correct choice with a look ahead of exactly one symbol!

### The FIRST Set - 1 Symbol Look ahead

![](https://i.gyazo.com/fc09b7d26c594a3c2d60bc1d31165440.png)

### The FOLLOW Set - 1 Symbol

For a non-terminal A, define FOLLOW(A) as

_FOLLOW(A) := the set of terminals that can appear immediately to the right of A in some sentential form_

Thus, a non-terminal's FOLLOW set specifies the tokens that can legally appear after it; a terminal has no FOLLOW set

_FOLLOW(A) = { a â (T âª {eof}) | S eof =>^* ğ° A a ğ² }_

To build FOLLOW(X) for all non-terminal X

1. Place eof in FOLLOW(\<goal\>)
  - Iterate until no more terminals or eof can be added to any FOLLOW(X)
2. If A -> ğ°Bğ± then put {FIRST(ğ±) - ğ´} in FOLLOW(B)
3. If A -> ğ°B then put FOLLOW(A) in FOLLOW(B)
4. If A -> ğ°Bğ± and ğ´ â FIRST(ğ±) then put FOLLOW(A) in FOLLOW(B)

If A -> ğ° and A -> ğ± and ğ´ â FIRST(ğ°), then we need to ensure that FIRST(ğ±) is disjoint from FOLLOW(A), too

![](https://i.gyazo.com/ab0480e11752f40f10fed1f3983f3c9e.png)
