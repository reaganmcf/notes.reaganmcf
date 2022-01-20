---
slug: "/compilers/lecture-1"
date: "2021-01-19"
title: "Compilers - Lecture 1"
---

# Compilers

- What is a **compiler**?
  - A program that translates an _executable_ program in one language into an _executable_ program in another language
  - A good compiler should improve the program, _in some way_
- What is an **interpreter**?
  - A program that reads an _executable_ program and produces the results of executing that program
- C is typically compiled, Scheme is typically interpreted
- Java is compiled to bytecode (for the Java VM)
  - Which is then interpreted
  - Or a hybrid strategy is used
    - Just-in-time compilation
    - Dynamic optimization (hot paths)

## Why Study Compilation?

- Compilers are important system software components
  - They are intimately interconnected with architecture, systems, programming methodology, and language design
- Compilers include many applications of theory to practice
  - Scanning, parsing, static analysis, instruction selection
- Many practical applications have embedded languages
  - Commands, macros
- Many applications have input formats that look like languages
  - Matlab, Mathematica
- Writing a compiler exposes practical algorithmic & engineering issues
  - Approximating hard problems; efficiency and scalability
  - No free lunch, i.e., there are multi-dimensional trade-offs

## Intrinsic interest

- Compiler construction involves ideas from many different parts of computer science

| Discipline              | Topics                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Artificial Intelligence | Greedy algorithms, Heuristic search, ML                                              |
| Algorithms              | Graph algorithms, union-find, DP, approximations                                     |
| Theory                  | DFAs & PDAs, pattern matching, fixed-point algos                                     |
| Systems                 | Allocation & naming, synchronization, data locality                                  |
| Architecture            | Pipeline & hierarchy management, instruction set use, parallelism, quantum computing |

## Intrinsic merit

- Compiler: construction poses challenging and interesting problems
  - Compilers must do a lot but also **run fast**
  - Compilers have primary responsibility for **run-time performance**
  - Compilers are responsible for making it acceptable to use the **full power** of the programming language
  - Computer architects perpetually create new challenges for the compiler by building more **complex machines** (e.g.: multi-core, GPUs, FPGAs, quantum computers, neuromorphic processors)
  - Compilers must/should hide that complexity from the programmer
  - Success requires mastery of complex interactions

## Making languages usable

> It was our belief that if FORTRAN, during its first months, were to translate any reasonable "scientific" source program into an object program only half as fast as its hand-coded counterpart, then acceptance of our system would be in serious danger.. I believe that had we failed to produce efficient programs, the widespread use of languages like FORTRAN would have been seriously delayed.

\- John Backus

## High-level View of a Compiler

![](https://i.gyazo.com/e7685fddf81282b6e74eb0faa9e147af.png)

Implications:

- Must recognize legal (and illegal) programs
- Must generate correct code
- Must manage storage of all variables (and code)
- Must agree with OS & linker on format for object code
- Big step up from assembly language - use higher level notations

## Traditional Two-pass Compiler

![](https://i.gyazo.com/b1e47ab4bbb2aa30565311f637a97f68.png)

Implications:

- Use an intermediate representation (IR)
- Front end maps legal source code into IR
- Back end maps IR into target machine code
- Extension: multiple front ends & multiple passes (better code)
- Typically, front end is O(N) or O(n log n), while back end is NP-complete

### A Common Fallacy

![](https://i.gyazo.com/afe010faa4972eef865754a8c87a4695.png)

Can we build n x m compilers with n + m components?

- Must encode all language specific knowledge in each front end
- Must encode all features in a single IR
- Must encode all target specific knowledge in each back end
- Limited success in systems with very low-level IRs

## The Front End

![](https://i.gyazo.com/681184ea09d807ae0da65f1792e7563e.png)

Responsibilities:

- Recognize legal (& illegal) programs
- Report errors in a useful way
- Produce IR & preliminary storage map
- Shape the code for the back end
- Much of front end construction can be automated

### Scanner

- Maps character stream into words - the basic unit of syntax
- Produces pairs - a word & its part of speech
  - `x = x + y;` becomes `<id,x> = <id,x> + <id,y>;`
  - word ~= lexeme, part of speech ~= token type
  - In casual speech, we call the pair a _token_
- Typical tokens include _number_, _identifier_, _+_, _-_, _new_, _while_, _if_
- Scanner eliminates white space (including comments)
- Speed is important

### Parser

- Recognizes context-free syntax & reports errors
- Guides context-sensitive ("semantic") analysis (type-checking)
- Builds IR for source program
- Hand coded parsers are fairly easy to build
- Most books advocate using automatic parser generators

### Context-free Syntax

Context-free syntax is specified with a grammar

```
SheepNoise -> SheepNoise baa
                  | baa
```

This grammar defines the set of noises that a sheep makes under normal circumstances.

It is written in a variant of Backus-Naur Form (BNF)

Formally, a grammar $G = (S, N, T, P)$

- $S$ is the _start symbol_
- $N$ is the set of _non-terminal symbols_
- $T$ is a set of _terminal symbols_ or _words_
- $P$ is a set of _produictions_ or _rewrite rules_ ($P: N \rarr N \cup T$)

Context-free syntax can be put to better use

### Context-free Grammar

```
1. goal -> expr
2. expr -> expr op term
3.       | term
4. term -> number
5.       | id
6. op   -> +
7.       | -
```

```
S = goal
T = { number, id, +, - }
N = { goal, expr, term, op }
P = { 1, 2, 3, 4, 5, 6, 7 }
```

- This grammar defines simple expressions with addition & subtraction over "number" and "id"
- This grammar, like many, falls in a class called "context-free grammars", abbreviated CFG

Given a CFG, we can **derive** sentences by repeated substitution

![](https://i.gyazo.com/9cf7f929afe3b2ccc6226601b8c2c0df.png)

To recognize a valid sentence in some CFG, we will need to construct a derivation automatically (forward or backwards)

### Parse Trees

A parse can be represented by a tree (**parse tree** or **syntax tree**)

![](https://i.gyazo.com/4044d554e82dbdf9e7db152009a3153e.png)

Compilers often use an **abstract syntax tree (AST)**

![](https://i.gyazo.com/11306b8470b8286c4c7a663237dd9524.png)

- The AST summarizes grammatical structure, without including detail about the derivation
- This form is much more concise
- ASTs are one kind of _intermediate representation (IR)_

## The Back End

![](https://i.gyazo.com/38beca6ba450f71de49aff690f4342be.png)

Responsibilities:

- Translate IR into target machine code
- Choose instructions to implement each IR operation
- Decide which value to keep in registers
- Ensure conformance with system interfaces
- Automation has been _less_ successful in the back end

### Instruction selection

- Produce fast, compact code
- Take advantage of target features such as addressing models
- Usually viewed as a pattern matching problem
  - _ad hoc_ methods, pattern matching, dynamic programming
- This was the problem of the future in 1978
  - Spurred by transition from PDP-11 to VAX-11
  - Orthogonality of RISC simplified this problem

### Register Allocation

- Have each value in a register when it is used
- Manage a limited set of resources
- Select appropriate `LOAD`s and `STORE`s
- Optimal allocation is NP-complete

Typically, compilers approximate solutions to NP-Complete problems

### Instruction Scheduling

- Avoid hardware stalls and interlocks
- Use all functional units productively
- Can increase lifetime of variables (changing the allocation)

Optimal scheduling is NP-Complete in nearly all cases
Heuristic techniques are well developed

## Traditional Three-pass Compiler

![](https://i.gyazo.com/b3b9d24c41b427fcd7ef40f388a4681f.png)

Code improvement (or **Optimization**)

- Analyzes IR and rewrites (or transforms) IR
- Primary goal is to reduce running time of the compiled code
  - May also improve space, power dissipation, energy consumption
- Must preserve "meaning" of the code (may include approximations, i.e., quality of outcomes trade-offs)

### The Optimizer (or Middle End)

![](https://i.gyazo.com/04263bdbd07d7f6c847f2c2907e08e8d.png)

Typical Transformations

- Discover & propagate some constant value
- Move a computation to a less frequently executed place
- Specialize some computation based on context
- Discover a redundant computation & remove it
- Remove useless or unreachable code
- Encode an idiom in some particularly efficient form

## Modern Restructuring Compiler

![](https://i.gyazo.com/c8e152f11c795d771667171d7a376fa1.png)

Typical **Restructuring** (source-to-source) Transformations:

- Blocking for memory hierarchy and register reuse
- Vectorization
- Parallelization
- All based on dependence
- Also full and partial inlining

## Rule of the Run-time system

- Memory management services
  - Allocate
    - In the heap or in an activation record (stack frame)
  - Deallocate
  - Collect garbage
- Run-time type type-checking
- Error processing (exception handling)
- Interface to the operating system
  - Input and output
- Support for parallelism
  - Parallel thread initiation
  - Communication and synchronization
