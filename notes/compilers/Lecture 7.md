---
slug: "/compilers/lecture-7"
date: "2021-02-09"
title: "Compilers - Lecture 7"
---

# Lecture 7

## Top-down Allocator

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
loadI   5       => r4 // r1 r2 r3 r4              -- MAXLIVE = 4
sub     r4,r2   => r5 // r1    r3    r5
loadI   8       => r6 // r1    r3    r5 r6        -- MAXLIVE = 4
mult    r5,r6   => r7 // r1    r3          r7
sub     r7,r3   => r8 // r1                   r8
store   r8      => r1 //
```

- 3 physical registers to allocate: _ra, rb, rc_
- 1 selected register: f1 (feasible set)

  - Note: ILOC needs larger F set
  - _k = 4, F = 1, (k-F) = 3_

- Consider statements with MAXLIVE > (k-F) (basic algorithm)
- Spill heuristic
  - 1. Number of occurrences of virtual register
  - 2. Length of live range (tie breaker)

| Virtual Register | Number of occurrences | Length of live range |
| ---------------- | --------------------- | -------------------- |
| r1               | 4                     | 8                    |
| r2               | 3                     | 3                    |
| r3               | 2                     | 5                    |
| r4               | 2                     | 1                    |
| r5               | 2                     | 2                    |
| r6,r7,r8         | 2                     | 1                    |

In our case, we will spill `r3` (meaning our MAXLIVE <= k)

```pascal
loadI   1028    => r1       // r1
load    r1      => r2       // r1 r2
mult    r1,r2   => f1       // r1 r2
storeAI f1      => r0, @r3  // ** spill code
loadI   5       => r4       // r1 r2    r4              -- MAXLIVE = 3
sub     r4,r2   => r5       // r1          r5
loadI   8       => r6       // r1          r5 r6        -- MAXLIVE = 3
mult    r5,r6   => r7       // r1                r7
loadAI  r0,@r3  => f1       // ** spill code
sub     r7,r3   => r8       // r1                   r8
store   r8      => r1       //
```

## Spill Code

- A virtual register is spilled by using only registers from the feasible set (F), not the allocated set (k-F) = {ra, rb, ..}
- How to insert spill code, with F = {f1, f2, ..}?
  - For the **definition** of the spilled value r (assignment of the value to _virtual register r_), use a feasible register f as the target register; assign fixed memory location for spilled value (spill offset @r), and store feasible register value to the address offset @r
    ```pascal
      add ra, rb => f       // target of operation is spilled
      storeAI f => r0, @a   // spilled value "lives" in memory offset @r
    ```
  - For the **use** of spiled value, load value from memory into a feasible register
    ```pascal
      loadAI r0, @r => f // value lives at memory with offset @r
      add f, rb => ra    // loaded into feasible register
    ```

## Bottom-up Allocator

The idea:

- Focus on replacement rather than allocation
- Keep values "used soon" in registers
- Only parts of a live range may be assigned to a physical register (!= top down allocation's "all-or-nothing" approach)

Algorithm:

- Start with an empty register set
- Load on demand
- When no register is available, free one

Replacement (heuristic):

- Spill the value whose next use is farthest in the future
- Sound familiar? Think page replacement ...
