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
add r8, r7 => r9      // r1                   r9
add r9, r1 => r10     //                         r10
storeAI r10 => r0, 4  //
outputAI r0, 4        //
```

The MAX\_LIVE for the ILOC code is 4
