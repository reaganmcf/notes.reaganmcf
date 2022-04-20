---
slug: "/compilers/lecture-23"
date: "2021-04-20"
title: "Compilers - Lecture 23"
---

# Lecture 23 - Procedure Abstraction

## The Procedure: 3 Abstractions

- **Control** abstraction
  - Well defined entries & exits
  - Mechanism to return control to caller
  - Some notion of parameterization (usually)
- Clean **Name Space**
  - Clean state for writing locally visible names
  - Local names may obscure identical, non-local names
  - Local names cannot be seen outside
- External **Interface**
  - Access is by procedure name & parameters
  - Clear protection for both caller & callee
- Procedures permit a critical separation of concerns

### The Procedure (Realist's View)

Procedures allow us to **separate compilation**
- Separate compilation allows us to build non-trivial programs
- Keeps compile times reasonable
- Lets multiple programmers collaborate
- Requires independent procedures
Without separate compilation, we _would not_ build large systems

The procedure **linkage convention**
- Ensures that each procedure inherits a valid run-time environment and that the callers environment is restored on return
  - The compiler must generate code to ensure this happens according to conventions established by the system

### The Procedure (More Abstract View)

**A procedure is an abstract structure constructed via software**

Underlying hardware directly supports little of the abstraction - it understands bits, bytes, integers, reals, and addresses, but not
  - Entries and exits
  - Interfaces
  - Call and return mechanisms
    - May be a special instruction to save context at point of call
  - Name space
  - Nested scopes

All these are established by a carefully-crafted system of mechanisms provided by compiler, run-time system, linkage editor and loader, and OS

### Run Time vs. Compile Time

These concepts are often confusing
- The procedure linkages execute at **run time**
- Code for the procedure linkage is emitted at **compile time**
- The procedure linkage is designed long before either of these

### The Procedure as a Control Abstraction

Procedures have well-defined control-flow

The Algol-60 procedure call
- Invoked at a call site, with some set of _actual parameters_
- Control returns to call site, immediately after invocation

![](https://i.gyazo.com/92e1f3957708af645f121ffeef4e9700.png)

- Most languages allow recursion

Implementing procedures with this behavior
- Requires code to **save** and **restore** a "return address"
- Must map **actual parameters** to **formal parameters**
- Must create storage for **local variables** (any, maybe, parameters)
  - _p_ needs space for _d_ (and, maybe, _a_, _b_, and _c_)
  - where does this space go in recursive invocations?
- Must preserve _p_'s **state** while _q_ executes
  - Recursion causes the real problem here
- Strategy: Create unique location for each procedure **activation**
  - Can use a "stack" of memory blocks to hold local storage and return addresses
- Compiler _emits_ code that causes all this to happen at run time

### The Procedure as a Name Space

Each procedure creates its own name space
- Any name (almost) can be declared locally
- Local names obscure identical non-local names
- Local names cannot be seen outside the procedure
  - Nested procedures are "inside" by definition
- We call this set of rules & conventions **"lexical scoping"**

Examples:
- C has global, static, local, and _block_ scopes
  - Blocks can be nested, procedures cannot
- Scheme has global, procedure-wide, and nested scopes
  - Procedure scope (typically) contains format parameters

Why introduce lexical scoping?
- Provides a compile-time mechanism for binding "free" variables
- Simplifies rules for naming & resolves conflicts
- How can the compiler keep track of all those names?

The Problem
- At point _p_, which declaration of _x_ is current?
- At run-time, where is _x_ found?
- As parser goes in & out of scopes, how does it delete _x_?

The answer:
- Lexically scoped symbol tables

#### Where do all these variables go?

- Automatic & Local
  - Keep them in the procedure activation record or in a register
  - Automatic => lifetime matches procedure's lifetime
- Static
  - Procedure scope => storage area affixed with procedure name
  - File scope => storage area affixed with file name
  - Lifetime is entire execution
- Global
  - One or more global data areas
  - One per program
  - Lifetime is entire execution

#### Placing Run-time Data Structure

![](https://i.gyazo.com/f9caa209c9c99d5185f6d4f12469d0bc.png)

- Code, static, and global data have known size
- Heap and stack both grow & shrink over time
- This is a **virtual** address space

## Activation Record Basics

![](https://i.gyazo.com/92a13b359aaf1283189fea44b96334a0.png)

