---
slug: "/compilers/lecture-3"
date: "2021-01-26"
title: "Compilers - Lecture 3"
---

# Lecture 3

## Instruction Scheduling (Engineer's View)

The Problem:

Given a code fragment (basic block) for some target machine and the latencies for each individual operation, reorder the operations to minimize execution time

The Concept:
![](https://i.gyazo.com/1cde9187be726f4a63026b351963667a.png)

The Task:

- Produce correct code
- Minimize wasted (idle) cycles
- Scheduler operates efficiently

## Data Dependencies (stmt./instr. level)

Dependencies => defined on memory locations / registers

Statement / instruction `b` depends on statement / instruction `a` if there exists:

RAW = Read after Write
WAR = Write after Read
WAW = Write after Write

- _true_ of flow dependence

  - `a` writes a location / register that `b` later reads **(RAW conflict)**

- _anti_ dependence

  - `a` reads a location / register that `b` later writes **(WAR conflict)**

- _output_ dependence
  - `a` writes a location / register that `b` later writes **(WAW conflict)**

Dependencies defines ORDER CONSTRAINTS that need to be respected in order to generate correct code.

![](https://i.gyazo.com/48a219e9482c95b6728ef9801c305db1.png)

## Precedence / Dependence Graphs

#### Example latencies

![](https://i.gyazo.com/29e71dc93d2c9cedca1835afb2a160d0.png)

To capture properties of the code, build a **precedence/dependence graph** _G_

- Nodes n in G are operations with _type(n)_ and _delay(n)_
- An edge _e = (n1, n2) in G_ if _n2_ depends on _n1_

```
a:  loadAI  r0,@w   => r1
b:  add     r1,r1   => r1
c:  loadAI  r0,@x   => r2
d:  mult    r1,r2   => r1
e:  loadAI  r0,@y   => r3
f:  mult    r1,r3   => r1
g:  loadAI  r0,@z   => r2
h:  mult    r1,r2   => r1
i:  storeAI r1      => r0,@w
```

The Precedence Graph

![](https://i.gyazo.com/2a8eb1d60c08bb643f1ea05e80a246df.png)

All other dependencies (output & anti) are covered, i.e., are satisfied through the dependencies shown

## The Big Picture

1. Build a dependency graph, _P_
2. Compute a _priority function_ over the nodes in _P_
3. Use **list scheduling** to construct a schedule, one cycle at a time

- Can only issue / schedule at most one instructions per cycle
- Use a set of operations that are ready
- At each cycle
  1. Choose a ready operation (priority based) and schedule it
  2. Increment cycle
  3. Update the ready set

Local list scheduling

- The dominant algorithm for many years
- A greedy, heuristic, local technique

## Scheduling Example

1. Build the dependency graph (using the same one as above)

2. Determine priorities: longest latency-weighted path

![](https://i.gyazo.com/ed13d76ecd14a54496d1db1d3205940c.png)
