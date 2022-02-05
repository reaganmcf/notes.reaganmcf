# Assignment 1

## Problem 1 - ILOC code shape

#### 1. All variables may be aliased

```
code
```

#### 2. Variables a and b, and c and d may be aliased. However, both a and b are not aliased with c or d. Memory consistency has to be preserved.

```
code
```

#### 3. No two variables are aliased. Memory consistency has to be preserved

```
code
```

#### 4. No two variables are aliased. Memory consistency may not be preserved

```
code
```

## Problem 2 - Anti-Dependencies

Assuming the following latencies (from Lecture 4)

```
load = 3
loadI = 1
loadAI = 3
store = 3
storeAI = 3
add = 1
mult = 2
fadd = 1
fmult = 2
shift = 1
output = 1
outputAI = 1
```

#### 1. What is the number of cycles needed to run this code assuming the latencies used in class (see lecture 3)? Do not reorder the instructions?

- a takes 1 cycle
- b takes 1 cycle
- c takes 3 cycles
- d takes 1 cycle
- e takes 3 cycles
- f takes 3 cycles
- g takes 1 cycle
  - g can be pipelined directly after f, since it has no dependencies to f. Therefore, it will only take 1 additional cycle (2/3 of g will be pipelined with f)
- h takes 1 cycle
- i takes 3 cycles
- j takes 1 cycle

**It takes a total of 18 cycles for this code to run**

> Note: I'm assuming we are allowed to pipeline g with f, if not then this will take 20 cycles not 18.

#### 2. Can you remove the anti dependencies? If so, give the code. What is the number of cycles needed to run the modified code without anti-dependencies using latencies above. Do not reorder or eliminate any instructions?

To remove the first anti-dependency, we can change `d` to use `r4` instead of `r1`, also making sure to update `e` to `store r4 => ...`. To get rid of of the other anti-dependency, we also change `f` to loading into `r5` instead of `r1`, also making sure to update `h` to use `r5` instead of `r1`.

Modified code:

```
a   loadI   1024  => r0
b   loadI   2     => r1
c   storeAI r1    => r0, 4
d   loadI   3     => r4
e   storeAI r4    => r0, 8
f   loadAI  r0, 4 => r5
g   loadAI  r0, 8 => r2
h   add     r5, r2 => r3
i   storeAI r3    => r0, 12
j   outputAI r0, 12
```

The number of cycles needed to run the modified code is actually the same as the original code, since even though we got rid of the anti-dependencies, we didn't reorder any instructions and are just using different registers.

#### 3. What are the advantages and disadvantages of removing anti-dependencies?

One of the most clear advantages of removing anti-dependencies is that it removes constraints on the reordering of instructions for the compiler's instruction scheduler.

One clear disadvantage of removing anti-dependencies is the increased demand for registers. Renaming registers to remove anti-dependencies increase the demand for registers, potentially forcing the register allocator to spill more values. Spilling these values into memory can cause very (relatively) long latency operations by having to access the memory when there are more named registers than actual registers on that particular architecture.

## Problem 3 - Instruction Scheduling
