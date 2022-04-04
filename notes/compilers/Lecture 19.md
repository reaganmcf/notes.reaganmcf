---
slug: "/compilers/lecture-19"
date: "2021-04-04"
title: "Compilers - Lecture 19"
---

# Lecture 19 - Type systems

## Types and Type Systems

Type: A set of values and meaningful operations on them

Types provide semantic "sanity checks" and determine efficient implementations for data objects

Types help identify
  - Errors
    - Dereferencing a non-pointer
    - Adding a function to something
    - Incorrect number of parameters to a procedure
  - Which operation to use for overloaded names and operators, or what type of type coercion to use (e.g.: 3.0 + 1)
  - Identification of polymorphic functions

### Type System

Type system: Each language construct (operator, expression, statement, ...) is associated with a **type expression**. The type system is a collection of rules for assigning **type expressions** to these constructs

Type expressions for:
  - Basic types: `integer`, `char`, `real`, `boolean`, `typeError`
  - Constructed types, e.g., one-dimensional arrays: `array(lb, ub, elem_type)`, where elem\_type is a **type expression**

A **type checker** implements a type system. It computes or "constructs" type expressions for each language construct.

### Inference rules

Example type inference rule:

E ⊢ e1 : integer, E ⊢ e2 : integer => E ⊢ e1 + e2 : integer

Where E is a type environment that maps constants and variables to their type expressions

### Example

Let's say we have the expression `1 + 5`.

We can describe our E as E = {1 : integer, 5 : integer}

We also have the following inference rules (that are fairly trivial)
- E = {1 : integer, 5 : integer} ⊢ 1 : integer
- E = {1 : integer, 5 : integer} ⊢ 5 : integer

This means that we also have the following inference rule

E ⊢ 1 : integer, E ⊢ 5 : integer => E ⊢ 1 + 5 : integer

### Polymorphic example

What would the type of dereferencing a pointer?
- E ⊢ e1 : pointer (𝛂) => E ⊢ \* e1 : 𝛂
- 𝛂 is any type expression

What would be the type of referencing a value?
- E ⊢ e1 : 𝛂 => E ⊢ & e1 : pointer (𝛂)
- 𝛂 is any type expression

### More complicated example

Let's say we have the following expression `*(&a)+3`, and E starts off as E = {3 : integer}

1. We don't know what type `a` is, so let's just call it 𝛃
    - E = {3 : integer, a : 𝛃 }
2. Using the inference rule E ⊢ e1 : 𝛂 => E ⊢ &e1 : pointer(𝛂), we know that E ⊢ (&a) : pointer(𝛃)
3. Using the inference rule E ⊢ e1 : pointer (𝛂) => E ⊢ \* e1 : 𝛂, we know that E ⊢ \*(&a) : 𝛃
4. Since our addition rule **only works with integers**, using the inference rule E ⊢ \*(&a) : 𝛃, E ⊢ 3 : integer => E ⊢ \*(&a)+3 : integer
    - E = {3 : integer, a : 𝛃, 𝛃 : integer}
    - Which also means that E ⊢ a : integer since E ⊢ 𝛃 : integer

## Type Equivalence

**Structural** type equivalence: _type names_ are expanded
**Name** type equivalence: _type names_ are not expanded

Example:
```
type A is array(1..10) of integer;
type B is array(1..10) of integer;
a: A;
b: B;
c, d: array(1..10) of integer;
e: array(1..10) of integer;
```

Are a,b,c,d,e the same type? 
- For **structural type equivalence they are equivalent**
- For **name equivalence**, a and b are different, while c,d,e are equivalent

Project 2 hint:

The definition of type expression as C types (structs) should be done in attr.h. attr.c may contain helper functions
The assignment of type expression C types to terminals and nonterminals of the grammar is done in parse.y

### Lexically-scoped Symbol Tables

The problem
- The compiler needs a distinct record for each declaration
- Nested lexical scopes admit duplicate declarations

The interface
- `insert(name, level)` creates a record for `name` at `level`
- `lookup(name, level)` returns pointer or index
- `delete(level)` removes all names declared at `level`

Many implementation schemes have been proposed
- We'll stay at the conceptual level
- Hash table implementation is tricky, detailed, & fun
