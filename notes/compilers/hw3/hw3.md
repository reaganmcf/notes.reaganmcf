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

Solution:
```
others* (letter_upper | letter_upper (letter_upper letter_upper)*) ```

