---
slug: "/compilers/lecture-22"
date: "2021-04-18"
title: "Compilers - Lecture 22"
---

# Lecture 22 - Compiler Optimizations

## Code Improvement
- Analyzes IR and rewrites (or _transforms_) IR
- Primary goal is to reduce running time of the compiled code
  - May also improve space, power dissipation, energy consumption
- Must preserve "meaning" of the code (may include approximations, i.e., quality of outcomes and trade-offs)
  - Measured by values of named variables or produced output

## The Optimizer (or Middle End)

> Modern optimizers are structured as a series of passes

Typical transformations
- Discover & propagate some constant value
- Move a computation to a less frequently executed place
- Specialize some computation based on context
- Discover a redundant computation and remove it
- Remove useless or unreachable code
- Encode an idiom in some particularly efficient form

### Benefits

How to assess any technique (transformation) that will improve the overall program outcome or its (dynamic) execution

- (S) - Safety
  - Program semantics has to be preserved (true or false)
- (O) - Opportunity
  - How often can the optimization be safely applied during the execution of the program (percentage)
- (P) - Profitability
  - If the optimization is applied, what is the expected average benefit in terms of the target metric?

Benefit = [(100 - O) + O/P] if S = true

Examples:
- The transformation "a" is safe and improves the execution time of 10% of the executed code by a factor of 5
  - Benefit: execution time reduced to 92%
- The transformation "b" is not safe and improves the execution time 40% of the executed code by a factor of 2
  - Benefit is not defined
  - If "b" were safe, benefit: execution time reduced to 80%

### Interactions

How do these optimizations interact?

A significant body of research tries to find the best sequence of optimizing transformations for different application domains. These transformations are not Church-Rosser, i.e., the particular order of these transformations impact the overall ooutcome.

Some of the optimizations are used as "clean-up" passes (e.g.: constant propagation, dead code elimination). This allows implementers of other transformations to use simpler algorithms and data abstractions that are easier to reason about.

When you decide an optimization pass, keep in mind that the program your optimizing pass is presented with may have run through many previous transformations, significantly changing the program's code shape. Most likely, this code shape would not have been generated directly by any human programmer. Make sure your optimization path algorithms and data structures can deal with "un-natural" shapes.

### Commonality

What do these optimizations have in common?
- Their goal is to reduce the number of machine cycles needed to execute the program (**reduce dynamic execution count**)

Note: reducing dynamic execution cycles does not always imply reducing static program size. In fact, many optimizations increase the program size significantly. This in turn can have negative impact on (dynamic) performance (e.g.: caches, failure of "standard" algorithms to generate good code).

Examples:
  - Procedure in-lining
  - Blocking for memory hierarchy
  - Loop unrolling to increase basic block size

### Optimization Goals

What other optimization goals are there?
- Performance
- Size of executable
- Power
- Energy
- Thermal

How do these different optimization goals interact
- Does one optimization goal subsumes another, or are they all different?
- Can one optimization goal conflict with another?
  - (e.g.: power vs. performance, thermal vs. performance)

### Scope / Granularity

Example: Discover and propagate some constant values (constant folding / propagation)

Local, global (intra-procedural), and inter-procedural optimization

#### Local

Local: Basic block within a procedure

```
a := 2
b := 3
c := a + b
print(c)
```

This get's optimized to:
```
a := 2
b := 3
c := 5
print(5)
```

#### Global

Global: Control flow between basic blocks within a procedure

```
if (...) then {
  a := 2
  b := 3
} else {
  a := 3
  b := 2
}
c := a + b
print(c)
```

This gets optimized to

```
if (...) then {
  a := 2
  b := 3
} else {
  a := 3
  b := 2
}

c := 5
print(5)
```

#### Inter-procedural

Inter-procedural: Control flow across procedure calls

```
procedure foo(a,b) {
  c := a + b // no side effects
  return c;
}

procedure bar() {
  ...
  c := foo(2, 3)
  print(c)

  d := foo(5,5)
  print(d)
}
```

This gets optimized to
