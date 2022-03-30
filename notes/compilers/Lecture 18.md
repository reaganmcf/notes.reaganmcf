---
slug: "/compilers/lecture-18"
date: "2021-03-30"
title: "Compilers - Lecture 18"
---

# Lecture 18 - Context-Sensitive Analysis Part 2

## Midterm #2
- Regular Expressions
- NFA and DFA
- Regular Expressions to minimal DFA construction
- CFG
  - Derivations
  - Parse Trees
  - ambiguity
- LL(1) parsing
  - FIRST and FOLLOW sets
  - Parse tables
  - Recursive descent parsers
- LR(0) parsing
  - LR(0) items
  - LR(0) canonical collection and its construction
  - ACTION and GOTO tables
  - Shift/reduce and reduce/reduce conflicts

## Attribute Grammars, cont.

The Problems:
- Copy rules increase cognitive overhead
- Copy rules increase space requirements
  - Need copies of attributes
- Result is an attributed tree
  - Must build the parse tree
  - Either search tree for answers or copy them to the root

### Addressing the Problem

What would a good programmer do?
- Introduce a central repository for facts
- Table names
  - Field in table for loaded/not loaded state
- Avoid all the copy rules, allocation & storage headaches
- All inter-assignment attribute flow is through table
  - Clean, efficient implementation
  - Good techniques for implementing the table
  - When it's done, information is in the table
  - Cures most of the problems
- Unfortunately, this design violates the functional, AG paradigm
  - Do we care?

### The Realist's Alternative
**Ad-hoc syntax-directed translation**
- Associate pieces of code with each production
- At each reduction, the corresponding code is executed
- Allowing arbitrary code provides complete flexibility
  - Includes ability to do tasteless and bad things

To make this work:
- Need names for attributes of each symbol on _lhs_ and _rhs_
  - Typically, one attribute passed through parser + arbitrary code (structures, globals, ...)
  - Yacc introduced $$, $1, $2, ..., $n, left to right
- Need an evaluation scheme
  - Fits nicely into LR(1) parsing algorithm

## Project 2
- You do not have to change the scanner (scan.l)
- How to specify and use attributes in YACC?
  - Define attributes as types in `attr.h`
  - `typedef struct info_node { int a; int b } infonode;`
- Include type attribute name in `%union` in parse.y
  - `%union {tokentype token; infonode myinfo; ... }`
- Assign attributes in `parse.y` to
  - Terminals: `%token <token> ID ICONST`
  - Non-terminals: `%type <myinfo> block variables procdecls cmpdstmt`

![](https://i.gyazo.com/52e3b37628c8e43688c4cefd17fb78dc.png)

- At each reduction, the corresponding code is executed.
  - Accessing attribute values in parse.y:
  - use $$, $1, $2, ..., etc. notation:
  - \s
    ```
    block : variables procdecls {$2.b = $1.b + 1;} cmpdstmt
            { $$.a = $1.a + $2.a + $4.b; }
    ```
  - Implemented as
    ```
    block : variables procdecls newsymbol cmpdstmt
            { $$.a = $1.a + $2.a + $4.b; }
    newsymbol: ∈ {$2.b = $1.b + 1;}
    ```

![](https://i.gyazo.com/7c8f68a6d67fd46e927a796bc460d1d4.png)
    
### Summary - is this really ad-hoc?
Relationship between practice and attribute grammars

Similarities
- Both rules & actions associated with productions
- Application order determined by tools
- (Somewhat) abstract names for symbols

Differences:
- Actions applied as a unit; not true for AG rules
- Anything goes in ad-hoc actions; AG rules are (purely) functional
- AG rules are higher level than ad-hoc actions

## Types and Type Systems

Type: A set of values and meaningful operations on them

Types provide semantic "sanity checks" (consistency checks) and determine efficient implementations for data objects

Types help identify
  - errors
  - which operation to use for overloaded names and operators, or what type coercion to use (e.g.: 3.0 + 1)
  - identification of polymorphic functions

### Type System

**Type System**: each language construct (operator, expression, statement, etc.) is associated with a _type expression_. The type system is a collection of rules for assigning _type expressions_ to these constructs.

**Type expressions** for
  - basic types: `integer`, `char`, `real`, `boolean`, `typeError`
  - constructed types, e.g., one-dimensional arrays:
    - `array(lb, ub, elem_type)`, where `elem_type` is a _type expression_

A **Type Checker** implements a type system. It computes or "constructs" type expressions for each language construct
