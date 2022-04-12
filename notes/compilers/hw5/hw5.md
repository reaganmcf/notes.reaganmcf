# Homework 5

Name: Reagan McFarland
NETID: rpm141
Date: April 18th, 2022

## Problem 1 - LR(1) Parsing

Give the grammar below
```
1 |     S' ::= S
2 |     S  ::= L = R
3 |          | R
4 |     L  ::= *R
5 |          | id
6 |     R  ::= L
```

#### 1. Compute the canonical collection of sets of LR(1) items


#### 2. LR(0)

Show that the above grammar (Problem 1) is not LR(0). Note that it is sufficient to show one state where there is a conflict (Hint: you don't need to enumerate _all_ states)

#### 3. Type Systems

Assume a type system with the following inference rules

- Rule 1: _E ⊢ e1 : integer   E ⊢ e2 : integer => E ⊢ (e1 + e2) : integer_
- Rule 2: _E ⊢ e : ɑ => E ⊢ (&e) : pointer(ɑ)_
- Rule 3: _E ⊢ e : pointer(ɑ) => E ⊢ *e : ɑ_

Assuming that variable **a** and constant **3** are of type integer, and variable **b** is of type boolean. Use the inference rules to determine the types of the following expressions. Note: if a proof does not exist, the type system reports a type error

##### 1. `&a`

Initially, _E = { a : integer }_
- Using rule 2, we can deduce _E ⊢ a : integer => E ⊢ &a : pointer(integer)_

Therefore, the type of `&a` is `pointer(integer)`

##### 2. `&b`

Initially, _E = { b : boolean }_
- Using rule 2, we can deduce _E ⊢ b : boolean => E ⊢ &b : pointer(boolean)_

Therefore, the type of `&b` is `pointer(boolean)`

##### 3. `(&a + 5)`

Initially, _E = { a : integer, 5 : integer }_
- Using rule 2, we can deduce _E ⊢ a : integer => E ⊢ &a : pointer(integer)_
- We add this to our type environment, leaving us with _E = { a : integer, &a : pointer(integer), 5 : integer }_
- The expression is attempting to do an add, but the only inference rule we have for addition requires that 2 integers are on either side of the + operator, but we have a _integer_ and _pointer(integer)_, so we cannot do anything.

Therefore, the type of `(&a + 5)` is `type error`

##### 4. `*a`

Initially, _E = { a : integer }_
- Rule 3 is what we will have to use for dereference, but it requires that _E ⊢ e : pointer(ɑ)_ in order to deduce the type of `*ɑ`. But, our ɑ in this case is of type _integer_ as states in our type environment, which means this is not allowed.

Therefore, the type of `*a` is `type error`

##### 5. `&3`

Initially, _E = { 3 : integer }_
- Using rule 2, we can deduce _E ⊢ 3 : integer => &3 : pointer(integer)_

Therefore, the type of `&3` is `pointer(integer)`

###### 6. `*(a + b)`

Initially, _E = { a : integer, b : boolean }_
 
 - Using order of operations, we need to deduce the type of `a + b` before we can deduce the type of the dereference operation. However, our rule 1 requires that _e1_ and _e2_ must be of type integer, while we have _E ⊢ a : integer    E ⊢ b : boolean_, which means we cannot deduce the type of this.

 Therefore, the type of `*(a + b)` is `type error`

###### 7. `&&a`

Initially, _E = { a : integer }_

- Using rule 2, we can deduce _E ⊢ a : integer => &a : pointer(integer)_
- Using rule 2, we can deduce _E ⊢ &a : integer => &&a : pointer(pointer(integer))_

Unlike rule 3, rule 2 has no constraints on the type _ɑ_ in the first part of the inference rule. Therefore, the type of `&&a` is `pointer(pointer(integer))`
