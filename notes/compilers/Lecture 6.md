---
slug: "/compilers/lecture-6"
date: "2021-02-07"
title: "Compilers - Lecture 6"
---

# Lecture 6

## Register Allocation Part 2

### Live Ranges (live on exit)

Assume i and j are two instructions in a basic block

A value (virtual register) is _live_ between its _definition_ and its _uses_

- Find definitions (x <- ...) and uses (y <- ... x ...)
- From definition to _last_ use its **live range**
  - How many (static) definitions can you have for a virtual register?
- Can represent live range as an interval _[i,j]_ (in block)
  - Live on exit

Let _MAXLIVE_ be the maximum, over each instruction _i_ in the block, of the number of values (virtual registers) live at _i_.

- If MAXLIVE <= k, allocation should be easy
  - No need to reserve set of _F_ registers for spilling
- If MAXLIVE > k, some values must be spilled to memory

**Finding live ranges is harder in the global case**

Example:

![](https://i.gyazo.com/c3251de82c7dceb591318e55a0e03c7d.png)

- The live ranges of r1 and r3 do **not** overlap
  - r2, r3 are live on exit
  - r1 is not live on exit

**Physical register** ra assigned to r1 can also be re-assigned to r3

![](https://i.gyazo.com/d85f03932ab52ca35972c775ccf6d62c.png)

#### Register allocation as a graph coloring problem:

Interference Graph:

- Nodes: live ranges
- Edges: live at the same time

![](https://i.gyazo.com/4ab88a9d53329e5dd186dcb7ab4bf9d2.png)

Graph coloring problem

- Color all nodes
- Use minimal number of colors such that no adjacent nodes have the same color

Answer: 2 colors

![](https://i.gyazo.com/71ed0946e690c74329cc417df8d6496a.png)

## Top Down Allocator

The idea:

- Machine has _k_ physical registers
- Keep the "busiest" values in an assigned register
- Use the feasible (reserved) set, _F_, for the rest
- _F_ is the minimal set of registers needed to execute any instruction with all operands in memory
  - Move values with no assigned register from/to memory by adding LOADs and STOREs (SPILL CODE)

Basic algorithm (not graph coloring!)

- Rank values by number of occurrences (or some other metric)
- Allocate first k to F values to registers
- Rewrite code (with spill code) to reflect these choices

### Example

Take the following ILOC code with the live ranges (on exit) for each virtual register

```pascal
loadI   1028    => r1 // r1
load    r1      => r2 // r1 r2
mult    r1,r2   => r3 // r1 r2 r3
loadI   5       => r4 // r1 r2 r3 r4
sub     r4,r2   => r5 // r1    r3    r5
loadI   8       => r6 // r1    r3    r5 r6
mult    r5,r6   => r7 // r1    r3          r7
sub     r7,r3   => r8 // r1                   r8
store   r8      => r1 //
```
