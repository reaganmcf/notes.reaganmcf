---
slug: "/compilers/lecture-21"
date: "2021-04-13"
title: "Compilers - Lecture 21"
---

# Lecture 21 - Code Generation Continued and IR

## Boolean and Relational Values

How should the compiler represent them?
- Answer depends on the target machine

Two classical approaches
- Numerical representation
- Positional (implicit) representation

Correct choice depends on both context and ISA

Examples:

- `x < y` -> `cmp_LT rx, ry => r1`

What if the ISA uses a condition code?
- Must use a conditional branch to interpret result of compare
- Necessitates branches in the evaluation

Example: `r2` should contain boolean value of `x < y` evaluation

```
cmp rx, ry => cc1
cbr_LT cc1 => LT, LF
LT: loadI 1 => r2
    br => LOUT
LF: loadI 0 => r2
LOUT: ...
```

## Intermediate Representation

- Front end produces an IR 
- Middle end transforms the IR into an equivalent IR that runs more efficiently
- Back end transforms the IR into native code
- IR encodes the compiler's knowledge of the program
- Middle end usually consists of several passes

### Choosing an IR

- Decisions in IR design affect the speed and efficiency of the compiler
- Some important IR properties
  - Ease of generation
  - Ease of manipulation
  - Size
  - Level of abstraction
- The importance of different properties varies between compilers
  - Selecting an appropriate IR for a compiler is critical

### Types of IR

Three major categories

1. Structural
  - Graphically oriented
  - Heavily used in source-to-source translation
  - Tend to be large
  - Examples: Trees and DAGs
2. Linear
  - Pseudo-code for an abstract machine
  - Level of abstraction varies
  - Simple, compact data structures
  - Easier to rearrange
  - Examples: 3 address code, stack machine code
3. Hybrid
  - Combination of graphs and linear code
  - Example: Control-flow graph

### Level of Abstraction

- The level of detail exposed in an IR influences the profitability and feasibility of different optimizations
- Two different representations of an array reference
  - an AST array reference is much easier to comprehend and optimize than a linear code stream
- Level of granularity is up to the designer

## AST

An abstract syntax tree is the procedure's parse tree with the nodes for most non-terminal nodes removed
- Can use linearized form of the tree
  - `x 2 y * -`
  - `- * 2 y x`
  

## Stack Machine Code

Originally used for stack-based computers, now Java
- Example: `x - 2 * y` becomes
```
push x
push 2
push y
multiply
subtract
```

Advantages:
- Compact form
- Introduced names are _implicit_, not _explicit_
- Simple to generate and execute code

Useful where code is transmitted over slow communication links (like the Internet)

## Control Flow Graph

Models the transfer of control in the procedure
- Nodes in the graph are basic blocks
  - Can be represented with quads or any other linear representation
  - Edges in the graph represent control flow

## Static Single Assignment Form (SSA)

- The main idea: each name defined exactly once in program
- Introduce Φ-functions to make it work

Original:
```
x <- ...
y <- ...
while (x < k)
  x <- x + 1
  y <- y + x
```

SSA Form:
```
      x0 <- ...
      y0 <- ...
      if (x0 > k) goto next
loop: x1 <- Φ(x0, x2)
      y1 <- Φ(x0, y2)
      x2 <- x1 + 1
      y2 <- y1 + x2
      if (x2 < k) goto loop
next: ...
```

Strengths of SSA form:
- Sharper analysis
- "minimal" Φ-functions placement is non-trivial
- (sometimes) faster algorithms
