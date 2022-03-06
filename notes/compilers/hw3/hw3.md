# Homework 3

Name: Reagan McFarland

Date: March 7th, 2022

NETID: rpm141

## Problem 1

Note: the spaces used in all of my regular expressions are **not capturing spaces**, but are rather used to clearly show the difference between sub expressions

#### 1.1) All identifiers that start with a lower-case letter and end with an upper case letter, and are not more than 6 symbols long

Let `any := (a | b | c | d | e | A | B | C | D | E | 0 | 1 | 2 | 3 | 4 | $ | & | _)`, that is, any symbol in the alphabet Σ

Let `inner := (ε | any | any any | any any any | any any any any)`, that is, all strings of length 0-4 composed of symbols in out alphabet.

Solution:
```
letter_lower inner letter_upper
```

#### 1.2) All identifiers that do not have more than 3 digits and have exactly one special symbol.

Let `others := (a | b | c | d | e | A | B | C | D | E | 0 | 1 | 2 | 3 | 4)`, that is, all symbols besides special symbols.

Let `iter1 := (symbol (ε | others) (ε | others))`
Let `iter2 := ((ε | others) symbol (ε | others))`
Let `iter3 := ((ε | others) (ε | others) symbol)`

Solution:
```
(iter1 | iter2 | iter3)
```

#### 1.3) All identifiers that have an odd number of upper case letters and end with a special symbol if they start with a special symbol


Let `others := (a | b | c | d | e | 0 | 1 | 2 | 3 | 4 | $ | & | _)`, that is, all symbols besides upper case letters.

Let `inner := others* letter_upper (others* letter_upper others* letter_upper)* others*`, that is, all identifiers that have an odd number of upper case letters

Solution:
```
(inner | symbol inner symbol)
```

## Problem 2

#### 2.1) The set of all strings with an even number of "a"s and an odd number of "b"s. The empty string is not accepted

Note that the start state is `S0`, and the accepting state is marked green (`S4`)

![](https://i.gyazo.com/e83ee9542a2e599b77a1d7737f8b06e8.png)

#### 2.2) The set of all strings that do not have three consecutive "b"s and end in an "a".

![](https://i.gyazo.com/f0f52400c045870a8db22e136d33a2ef.png)

## Problem 3

#### 3.1) Construct an NFA for the regular expression `a|b(cd)*` using Thompson's Construction Algorithm. 

Note that the start state is `S0`, and the accepting state is marked green

![](https://i.gyazo.com/e5e0fb37d4bdcfac6a9cc450622f381f.png)

#### 3.2) Convert your NFA with epsilon transitions into a DFA using the subset construction algorithm. Show your work.

Note that during this construction, we will be referring to all NFA states as QX compared to SX (Q1 is actually S1 in the NFA, for example).

Applying the subset construction algorithm...

| DFA States | NFA States | a          | b           | c            | d            |
| ---------- | ---------- | ---------- | ----------- | ------------ | ------------ |
| S0         | {Q0}       | {Q1, Q7}   | {Q2, Q3, Q4, Q7} | none    | none         |
| S1         | {Q1, Q7}   | none       | none        | none         | none         |
| S2         | {Q2, Q3, Q4, Q7} | none | none        | {Q5}         | none         |
| S3         | {Q5}       | none       | none        | none         | {Q6, Q4, Q7} |
| S4         | {Q6, Q4, Q7} | none     | none        | S3           | none         | 

Note that S1, S2, and S4 are all accepting states since they contain `Q7`, which was the accepting state in our NFA.

The DFA based on the subset construction above is the following

![](https://i.gyazo.com/42d075b0fe34ee693c9ab2056d26d051.png)

#### 3.3) Is the DFA minimal? If not, give the minimal DFA. Show your work.

Using Hopcroft's Algorithm, let's initially partition our states into the Final states, and not final states.

| Partition | Current Partition      | a       | b       | c         | d        |
| --------- | ---------------------- | ------- | ------- | --------- | -------- |
| P0        | {S1, S4} {S0, S2, S3}  | {S0, S2, S3} splits on a to {S0}, {S2, S3}  | none    | {S1, S4} splits on c into {S1}, {S4}      | none |
| P1        | {S1}, {S4}, {S0}, {S2, S3} | none | none | none | {S2, S3} splits on d into {S2}, {S3} |
| P2        | {S1}, {S4}, {S0}, {S2}, {S3} | none | none | none | none |

This DFA is minimal, as applying Hopcroft's algorithm to our original DFA results in 5 partitions of our 5 states, resulting in the same DFA.

