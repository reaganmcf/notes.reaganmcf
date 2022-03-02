---
slug: "/compilers/lecture-12"
date: "2021-03-02"
title: "Compilers - Lecture 12"
---

# Parsing (Syntax Analysis)

![](https://i.gyazo.com/3b9ee4b7a8e089c58c00c3d28ba7e887.png)

Parser
- Checks the stream of _words_ and their _parts of speech_ (produced by the scanner) for grammatical correctness
- Determines if input is syntactically well-formed
- Guides checking at deeper levels than syntax
- Builds an IR representation of the code

## The Study of Parsing

The process of discovering a _derivation_ for some sentence
- Need a mathematical model of syntax - a grammar _G_
- Need an algorithm for testing membership in _L(G)_
- Need to keep in mind that our goal is building parsers, not studying the mathematics of arbitrary languages

Roadmap
1. Context-free grammars and derivations
2. Top-down parsing
  - LL(1) parsers, hand-coded recursive descent parsers
3. Bottom-up parsing
  - Automatically generated LR(1) parsers

### Specifying Syntax with a Grammar

Context-free syntax is specified with a context-free grammar

```
SheepNoise -> SheepNoise baa
                | baa
```

This _CFG_ defines the set of noises sheep normally make

It is written in a variant of Backus-Naur form

Formally, a grammar is a four tuple, _G = (S, N, T, P)_, where
- _S_ is the _start symbol_ (set of strings in L(G))
- _N_ is the set of _non-terminal symbols_ (syntactic variables)
- _T_ is a set of _terminal symbols_ (words or tokens)
- _P_ is a set of _productions_ or _rewrite rules_ (_P: N -> N ∪ T)*_)

**L(G) = { w ∈ T\* | S =>\* w }**

## A Simple Expression Grammar

To explore the uses of CFGs, we need a more complex grammar G

```
Expr -> Expr Op Expr
      | number
      | id
Op   -> +
      | -
      | \*
      | /
```

- Such a sequence of rewrites is called a _derivation_
- Process of discovering a derivation is called _parsing_

Is `x - 2 \* y` ∈ L(G)?

| Rule | Sentential Form |
| ---- | --------------- |
| -    | Expr            |
| 1    | Expr Op Expr    |
| 3    | <id,x> Op Expr  |
| 5    | <id,x> - Expr   |
| 1    | <id,x> - Expr Op Expr |
| 2    | <id,x> - <num,2> Op Expr |
| 6    | <id,x> - <num,2> \* Expr |
| 3    | <id,x> - <num,2> \* <id,y> |

### Derivations
- At each step, we choose a non-terminal to replace
- Different choices can lead to different derivations

Two derivations are of interest
- **Leftmost derivation** - replace the leftmost NT at each step
  - Generates _left sequential forms_ (=>\*lm)
- **Rightmost derivation** - replace the rightmost NT at each step
  - Generates _right sequential forms_ (=>\*rm)

These are the two _systematic derivations_
  - We don't care about randomly-ordered derivations!

The example above was a _leftmost_ derivation
- Of course, there is also a _rightmost_ derivation
- Interestingly, the resulting parse trees may be different

### Parse Trees

Rule in our grammar: `Expr -> Expr Op Expr`

A single derivation step `... Expr ... => ... Expr Op Expr ...` can be represented as a tree structure with the left-hand side non-terminal as the root, and all right-hand side symbols as the children (ordered left to right)

The entire derivation of a sentence in the language can be represented as a **parse tree** with the start symbol as its root, and leave nodes that are all terminal symbols

NOTE: **the structure of the parse tree has semantic significance**


### Two derivations for `x - 2 * y`

![](https://i.gyazo.com/3dbe3ab56f9b280d26edaf889003860f.png)

In both cases, `Expr =>* id - num * id`
- The two derivations produce different parse trees
- The parse trees imply different evaluation orders!

### Derivations and Precedence

These two derivations point out a problem with the grammar. How to resolve ambiguity?
Answer: **Change grammar to enforce operator _precendence and associativity_**

To add precedence
- Create a non-terminal for each _level of precendence_
- Isolate the corresponding part of the grammar
- Force the parser to recognize high precendence subexpressions first

For algebraic expressions
- Multiplication and division, first (level one)
- Subtraction and addition, next (level two)

> Note: we are ignoring the issue of associativity for now

Adding the standard algebraic precendence produces:

```
Goal    -> Expr
Expr    -> Expr + Term
         | Expr - Term
         | Term
Term    -> Term * Factor
         | Term / Factor
         | Factor
Factor  -> number
         | id
```

The grammar is slightly larger
- Takes more rewriting to reach some terminal symbols
- Encodes expected precedence
- Produces same parse tree under leftmost & rightmost derivations


Let's see how it parses x - 2 * y

![](https://i.gyazo.com/71e06409572bfaec31bbc9ede7aba0b3.png)

This produces `x - (2 * y)`, along with an appropriate parse tree.
Both the leftmost and rightmost derivations give the same expression, because the grammar directly encodes the desired precedence.

## Ambiguous Grammars

Definitions
- If a grammar has more than one leftmost derivation for a single _sentential form_, the grammar is **ambiguous**
- If a grammar has more than one rightmost derivation for a single _sentential form_, the grammar is **ambiguous**
- The leftmost and rightmost derivations for a sentential form may differ, even in an unambiguous grammar

Classic example - the `if-then-else` problem

```
Stmt -> if Expr then Stmt
      | if Expr then Stmt else Stmt
      | ... other stmts ...
```

This ambiguity is entirely grammatical in nature

This sequential form has two derivations
`if Expr then if Expr then Stmt else Stmt`

```
if Expr then
  if Expr then Stmt
  else Stmt
```

OR

```
if Expr then
  if Stmt then Stmt
else Stmt
```

### Removing the Ambiguity

- We must rewrite the grammar to avoid generating the problem
- Match each _else_ to innermost unmatched if (common sense rule)
```
Stmt     -> WithElse
          | NoElse
WithElse -> if Expr then WithElse else WithElse
          | OtherStmt
NoElse   -> if Expr then Stmt
          | if Expr then WithElse else NoElse
```


### Deeper Ambiguity

Ambiguity usually refers to confusion in the CFG

Overloading can create a deeper ambiguity
  - `a = f(17)`
  - In many Algol-like languages, f could either be a function or a subscripted variable

Disambiguing this one requires context
- Really an issue of _type_, not context-free syntax
- Requires extra-grammatical solution (not in CFG)
- Must handle these with a different mechanism
  - Step outside grammar rather than use a more complex grammar


### Final Word

Ambiguity arises from two distinct sources
- Confusion in the context-free syntax
- Confusion that requires context to resolve

Resolving ambiguity
- To remove context-free ambiguity, rewrite the grammar
- Change language (e.g.: if ... endif)
- To handle context-sensitive ambiguity takes cooperation
  - Knowledge of declarations, types, ...
  - Accept a superset of L(G) & check it by other means
  - This is a language design problem

Sometimes, the compiler writer accepts an ambiguous grammar
  - Parsing techniques that "do the right thing"
  - i.e., always select the same derivation

## Parsing Techniques

### Top-down Parsers

LL(1), recursive descent
- Input: read left-to-right
- Construction leftmost derivation (forwards)
- 1 input symbol look ahead

![](https://i.gyazo.com/bba8b2cf034e19ca5d7b09349965be93.png)

### Bottom-up parsers

LR(1), operator precedence
- Input: read left-to-right
- Construct rightmost derivation (backwards)
- 1 input symbol look ahead

![](https://i.gyazo.com/54f74ee2e5b4256fccb4c666a0eab788.png)

### Comparing them both

![](https://i.gyazo.com/814123516ae7b5ea1a5e8e5c30695863.png)

![](https://i.gyazo.com/0093a23fc090fb7e6626c6e01043c233.png)
