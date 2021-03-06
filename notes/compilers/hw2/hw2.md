# Assignment 1

Compilers - CS415 - 02/16/2022

Reagan McFarland

NETID - rpm141

## Problem - Top-down and Bottom-up Register Allocation

Assume the following code

```pascal
loadI 1024 => r0
loadI 1 => r1
loadI 2 => r2
subI r2, 4=> r3
add r1, r2 => r4
addI r4, r1 => r5
mult r3, r5 => r6
sub r5, r6 => r7
add r4, r5 => r8
add r8, r7 => r9
add r9, r1 => r10
storeAI r10 => r0, 4
outputAI r0, 4
```

#### 1. Give the live ranges for all virtual registers (ignore r0). What is the MAX_LIVE of the ILOC code?

```pascal
loadI 1024 => r0      //
loadI 1 => r1         // r1
loadI 2 => r2         // r1 r2
subI r2, 4=> r3       // r1 r2 r3
add r1, r2 => r4      // r1    r3 r4
addI r4, r1 => r5     // r1    r3 r4 r5              -- MAXLIVE
mult r3, r5 => r6     // r1       r4 r5 r6           -- MAXLIVE
sub r5, r6 => r7      // r1       r4 r5    r7        -- MAXLIVE
add r4, r5 => r8      // r1                r7 r8
add r8, r7 => r9      // r1                      r9
add r9, r1 => r10     //                            r10
storeAI r10 => r0, 4  //
outputAI r0, 4        //
```

The MAX_LIVE for the ILOC code is 4

#### 2a. EAC Top-Down Allocation

We have (MAX_LIVE - 1) available registers, which in our case is 3 (MAX_LIVE = 4, 4 - 1 = 3) (note: we don't include r0) as per the problem statement.

Our feasible set (F) is 2 as per the problem statement.

We will call the 5 registers we have available `ra, rb, rc, f1, f2`, where `f1, f2` as our feasible set.

The heuristic we will be using, as described in EAC, is priority based. That is, the number of times the virtual register appears in the block (it's frequency). Tie breaker's will be decided by just using the register that occurs first.

1. Compute priority for each virtual register.

| Register | Frequency |
| -------- | --------- |
| r1       | 3         |
| r2       | 3         |
| r3       | 2         |
| r4       | 3         |
| r5       | 4         |
| r6       | 2         |
| r7       | 2         |
| r8       | 2         |
| r9       | 2         |
| r10      | 2         |

2. Sort the virtual register into priority order

| Register | Frequency |
| -------- | --------- |
| r5       | 4         |
| r1       | 3         |
| r2       | 3         |
| r4       | 3         |
| r3       | 2         |
| r6       | 2         |
| r7       | 2         |
| r8       | 2         |
| r9       | 2         |
| r10      | 2         |

3. Assign registers in priority order

`r5` gets assigned to `ra`, `r1` gets assigned to `rb`, `r2` gets assigned to `rc`. The rest get spilled

Our code now looks like the following:

```pascal
loadI 1024 => r0
loadI 1 => rb
loadI 2 => rc
subI rc, 4=> r3
add rb, rc => r4
addI r4, rb => ra
mult r3, ra => r6
sub ra, r6 => r7
add r4, ra => r8
add r8, r7 => r9
add r9, rb => r10
storeAI r10 => r0, 4
outputAI r0, 4
```

4. Rewrite the code

The rest of the virtual registers will get spilled, and the feasible registers will be used instead.

Our final code now looks like the following:

```pascal
loadI 1024 => r0
loadI 1 => rb
loadI 2 => rc
subI rc, 4=> f1
storeAI f1 => r0, @r3 // spill r3
add rb, rc => f2
storeAI f2 => r0, @r4 // spill r4
loadAI r0, @r4 => f2 // load spilled r4
addI f2, rb => ra
loadAI r0, @r3 => f1 // load spilled r3
mult f1, ra => f2
storeAI f2 => r0, @r6 // spill r6
loadAI r0, @r6 => f1 // load spilled r6
sub ra, f1 => f2
storeAI f2 => r0, @r7 // spill r7
loadAI r0, @r4 => f1 // load spilled r4
add f1, ra => f2
storeAI f2 => r0, @r8 // spill r8
loadAI r0, @r8 => f1 // load spilled r8
loadAI r0, @r7 => f2 // load spilled r7
add f1, f2 => f2
storeAI f2 => r0, @r9 // spill r9
loadAI r0, @r9 => f1 // load spilled r9
add f1, rb => f2
storeAI f2 => r0, @r10 // spill r10
loadAI r0, @r10 => f1 // load spilled r10
storeAI f1 => r0, 4
outputAI r0, 4
```

Note that after every use of a feasible register, I am making sure to spill it into memory. Also, every location where a spilled value is used I have added a loadAI instruction before. The instructions were not clear on if we are able to skip loads if we know a feasible register already contains the spilled register value. There are trivial cases where we could skip some of these instructions, but to be safe, I am spilling and loading every single time.

Lastly, for the sake of clarity I keep the spilled value offsets in the form of `@r` instead of actual immediate values. "Real" ILOC code would determine the actual addresses of these values.

#### 2b. In-Class Top-Down Allocation

We have (MAX_LIVE - 1) available registers, which in our case is 3 (MAX_LIVE = 4, 4 - 1 = 3) (note: we don't include r0) as per the problem statement.

Our feasible set (F) is 2 as per the problem statement.

We will call the 5 registers we have available `ra, rb, rc, f1, f2`, where `f1, f2` as our feasible set.

The heuristic we will be using is similar to the EAC method (priority based on frequency), but our tie breakers will be decided on the length of the live range, not on which comes first.

1. Compute priority for each virtual register.

| Register | Frequency | Live Range |
| -------- | --------- | ---------- |
| r1       | 3         | 9          |
| r2       | 3         | 2          |
| r3       | 2         | 3          |
| r4       | 3         | 4          |
| r5       | 4         | 3          |
| r6       | 2         | 1          |
| r7       | 2         | 2          |
| r8       | 2         | 1          |
| r9       | 2         | 1          |
| r10      | 2         | 1          |

2. Sort the virtual register into priority order

| Register | Frequency | Live Range |
| -------- | --------- | ---------- |
| r5       | 4         | 3          |
| r1       | 3         | 9          |
| r4       | 3         | 4          |
| r2       | 3         | 2          |
| r3       | 2         | 3          |
| r7       | 2         | 2          |
| r6       | 2         | 1          |
| r8       | 2         | 1          |
| r9       | 2         | 1          |
| r10      | 2         | 1          |

`r5` gets assigned to `ra`.
`r1` gets assigned to `rb`.
`r4` gets assigned to `rc`.

The rest get spilled.

Our code now looks like the following

```pascal
loadI 1024 => r0
loadI 1 => rb
loadI 2 => r2
subI r2, 4=> r93
add rb, r2 => rc
addI rc, rb => ra
mult r3, ra => r6
sub ra, r6 => r7
add rc, ra => r8
add r8, r7 => r9
add r9, rb => r10
storeAI r10 => r0, 4
outputAI r0, 4
```

4. Rewrite the code

The rest of the virtual registers will get spilled, and the feasible registers will be used instead.

Our final code now looks like the following:

```pascal
loadI 1024 => r0
loadI 1 => rb
loadI 2 => f1
storeAI f1 => r0, @r2 // spill r2
loadAI r0, @r2 => f1 // load spilled r2
subI f1, 4=> f2
storeAI f2 => r0, @r3 // spill r3
loadAI r0, @r2 => f1 // load spilled r2
add rb, f1 => rc
addI rc, rb => ra
loadAI r0, @r3 => f1 // load spilled r3
mult f1, ra => f2
storeAI f2 => r0, @r6 // spill r6
loadAI r0, @r6 => f1 // load spilled r6
sub ra, f1 => f2
storeAI f2 => r0, @r7 // spill r7
add rc, ra => f1
storeAI f1 => r0, @r8 // spill r8
loadAI r0, @r7 => f1 // load spilled r7
loadAI r0, @r8 => f2 // load spilled r8
add f2, f1 => f2
storeAI f2 => r0, @r9 // spill r9
loadAI r0, @r9 => f1 // load spilled r9
add f1, rb => f1
storeAI f1 => r0, @r10 // spill r10
loadAI r0, @r10 => f1 // load spilled r10
storeAI f1 => r0, 4
outputAI r0, 4
```

Note that after every use of a feasible register, I am making sure to spill it into memory. Also, every location where a spilled value is used I have added a loadAI instruction before. The instructions were not clear on if we are able to skip loads if we know a feasible register already contains the spilled register value. There are trivial cases where we could skip some of these instructions, but to be safe, I am spilling and loading every single time.

Lastly, for the sake of clarity I keep the spilled value offsets in the form of `@r` instead of actual immediate values. "Real" ILOC code would determine the actual addresses of these values.

#### 3. Bottom-Up Allocation

Just lie in Top-Down allocation, we have (MAX_LIVE - 1) available registers, which in our case is 3 (MAX_LIVE = 4, 4 - 1 = 3) (note: we don't include r0) as per the problem statement.

We will call the 3 registers we have available `ra, rb, rc`.

The heuristic we will be using when we need to spill a register to memory is spill the value whose next use is the farthest in the future.

| Step | Instruction            | `ra` | `rb` | `rc`  | What happened                                                                                |
| ---- | ---------------------- | ---- | ---- | ----- | -------------------------------------------------------------------------------------------- |
| 1    | `loadI 1024 => r0`     |      |      |       | `r0` is a special register, nothing to do.                                                   |
| 2    | `loadI 1 => r1`        | `r1` |      |       | Assign `r1` to `ra`, and rewrite the instruction.                                            |
| 3    | `loadI 2 => r2`        | `r1` | `r2` |       | Assign `r2` to `rb`, and rewrite the instruction.                                            |
| 4    | `subI r2, 4 => r3`     | `r1` | `r2` | `r3`  | Replace `r2` with `rb`, assign `r3` to `rc`, and rewrite the instruction                     |
| 5    | `add r1, r2 => r4`     | `r1` | `r2` | `r4`  | Spill `r3` to memory to free `rc`, and assign `r4` to `rc`.                                  |
| 6    | `addI r4, 1 => r5`     | `r5` | `r2` | `r4`  | Spill `r1` to memory to free `r1`, since it's next use is farthest away. Assign `r5` to `ra` |
| 7    | `mult r3, r5 => r6`    | `r5` | `r3` | `r6`  | Spill `r2` and `r4` to memory, and assign `r3` to `rb`, and `r6` to `rc`                     |
| 8    | `sub r5, r6 => r7`     | `r5` | `r7` | `r6`  | Spill `r3` to memory, and assign `r7` to `rb`                                                |
| 9    | `add r4, r5 => r8`     | `r5` | `r4` | `r8`  | Spill `r7` and `r6` to memory, and assign `r4` to `rb`, and `r8` to `rc`                     |
| 10   | `add r8, r7 => r9`     | `r7` | `r9` | `r8`  | Spill `r5` and `r4` to memory, and assign `r7` to `ra`, and `r9` to `rb`                     |
| 11   | `add r9, r1 => r10`    | `r1` | `r9` | `r10` | Spill `r7` and `r8` to memory, and assign `r1` to `ra`, and `r10` to `rc`                    |
| 12   | `storeAI r10 => r0, 4` | `r1` | `r9` | `r10` | `r0` is special, nothing to do here.                                                         |
| 13   | `outputAI r0, 4`       | `r1` | `r9` | `r10` | `r0` is special, nothing to do here.                                                         |

```pascal
loadI 1024 => r0
loadI 1 => ra
loadI 2 => rb
subI rb, 4 => rc
storeAI rc => r0, @r3 // spill r3
add ra, rb => rc
storeAI ra => r0, @r1 // spill r1
addI rc, 1 => ra
storeAI rb => r0, @r2 // spill r2
storeAI rc => r0, @r4 // spill r4
loadAI r0, @r3 => rb // load spilled r3
mult rb, ra => rc
storeAI rb => r0, @r3 // spill r3
sub ra, rc => rb
storeAI rb => r0, @r7 // spill r7
storeAI rc => r0, @r6 // spill r6
loadAI r0, @r4 => rb // load spilled r4
add rb, ra => rc
storeAI ra => r0, @r5 // spill r5
storeAI rb => r0, @r4 // spill r4
loadAI r0, @r7 => ra
add rc, ra => rb
storeAI ra => r0, @r7 // spill r7
storeAI rc => r0, @r8 // spill r8
loadAI r0, @r1 => ra // load spilled r1
add rb, ra => rc
storeAI r10 => r0, 4
outputAI r0, 4
```

As discussed in the previous problems, we are aggressively loading and storing spilled values even when they are technically not necessary for thoroughness.
