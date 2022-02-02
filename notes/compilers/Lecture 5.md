---
slug: "/compilers/lecture-5"
date: "2021-02-02"
title: "Compilers - Lecture 5"
---

# Lecture 5

## Register Allocation

- **Local**: within single basic block
- **Global**: across procedure / function

Register -> Register model means you use a fresh register for each value

![](https://i.gyazo.com/751cf661c564da3af0493bc82eccc0f3.png)

Critical properties

- Produce **correct** code that uses _k_ (or fewer) registers
- Minimize added loads and stores
- Minimize space used to hold _spilled values_
- Operate efficiently
  - O(n), O(n log2n), maybe O(n^2), but not O(2^n)

## Memory Model / Code Shape

```
a := 1
b := 2
c := a + b + 3
```

Assumption: no aliasing

### Register-Register Model

- Values that **may safely reside** in registers are assigned to a unique virtual register (**alias analysis; unambiguous values**); there are different "flavors"

All in registers

```
loadI 1 => r1
loadI 2 => r2
add r1,r2 => r3
loadI 3 => r4
add r3,r4 => r5
```

Preserve memory view (memory consistency)

```
loadI 1 => r1
storeAI r1 => r0,@a
loadI 2 => r2
storeAI r2 => r0,@b
add r1,r2 => r3
loadI 3 => r4
add r3,r4 => r5
storeAI r5 => r0,@c
```

### Memory-Memory Model

- All program-named values **reside in memory**, and are only kept in registers as briefly as possible (load operand from memory, perform computation, store result back into memory)

```
loadI 1 => r1
storeAI r1 => r0,@a
loadI 2 => r2
storeAI r2 => r0,@b
loadAI r0,@a => r3
loadAI r0,@b => r4
add r3,r4 => r5
loadI 3 => r7
add r5,r7 => r8
storeAI r8 => r0,@c
```

---

Consider the following fragment of assembly code (or ILOC)

```
loadI   2     => r1 // r1 <- 2
loadAI  r0,8  => r2 // r2 <- y
mult    r1,r2 => r3 // r3 <- 2 * y
loadAI  r0,4  => r4 // r4 <- x
sub     r4,r3 => r5 // r5 <- x - (2 * y)
```

The problem

- At each instruction, decide which **values** to keep in registers
  - Note: a value is a _pseudo-register (virtual register)_
  - Simple if |values| <= |registers|
- Harder if |values| > |registers|
- The compiler must automate this process

### The Task

- At each point in the code, pick the values to keep in registerse
- Insert code to move values between registers & memory
  - No reordering transformations (leave that to scheduling)
- Minimize inserted code - both dynamic & static measures
- Make good use of any _extra_ registers

Allocation versus Assignment

- **Allocation** is deciding which values to keep in registers
- **Assignment** is choosing specific registers for values
- This distinction is often lost in the literature
  - The compiler must perform **both**

### Local Register Allocation

- What's "local"?
  - A local transformation operates on basic blocks
  - Many optimizations are done locally
- Does local allocation solve the problem?
  - It produces decent register use inside a block
  - Inefficiencies can arise at boundaries between blocks
- How many passes can the allocator make?
  - This is a compile-time ("off-line") problem (not during program execution); typically, as many passes as it takes
- Memory-to-Memory vs. Register-to-Register model
  - Code shape and safety issues

## Basic Approach of Allocators

Allocator may need to reserve physical registers to ensure feasibility

Notation: _k_ is the number of registers on the target machine

- Must be able to compute memory addresses
- Requires some minimal set of registers, _F_
  - _F_ depends on target architecture
- F contains registers to make spilling work
  - set F registers "aside" for address computation & instruction execution, i.e., these are no available for register assignment
- Note: F physical registers need to be able to support the pathological case where all virtual registers are spilled

What if _k - |F| < |values| < k_?

- The allocator can either
  - Check for this situation
  - Accept the fact that the technique is an approximation

### Top-down allocator

- May use notation of **live ranges** of virtual registers
- Work from "external" notion of what is important
- Assign registers in priority order
- Register assignment **remains fixed for entire basic block**
- Save some registers for the values relegated to memory (feasible set F)

### Bottom-up allocator

- Work from detailed knowledge about problem instance
- Incorporate knowledge of partial solution at each step
- Register assignment **may change across basic block**
- Save some registers for the values relegated to memory (feasible set F)

## Live Ranges

Assume i and j are two instructions in a basic block

A value (virtual register) is _live_ between its _definition_ and its _uses_

- Find definitions (x <- ...) and uses (y <- ... x ...)
- From definition to **last** use is its **live range**
  - How many static definitions can you have for a virtual register
- Can represent live range as an interval _[i,j]_ (in block)
  - Live on exit

Let _MAXLIVE_ be the maximum, over each instruction _i_ in the block, of the number of values (virtual registers) live at _i_.

- If _MAXLIVE <= k_, allocation should be easy
  - No need to reserve set of _F_ registers for spilling
- If _MAXLIVE > k_, some values must be spilled to memory

Finding live ranges is harder in the global case
