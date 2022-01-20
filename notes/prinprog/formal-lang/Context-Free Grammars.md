# Context-Free Grammars
- A formalism for specifying languages
	- First developed by Noam Chomsky as a way of describing natural languages
- We can specify many languages using CFGs
- Tools exist to write a recognizer for any given CFG
- We can use CFGs to construct strings in the specified language
- A CFG can describe the _structure_ of a string
- CFGs are commonly used to define (the syntax of) programming languages

## CFG: The Idea
- A CFG is a set of _rules_ (also called _productions_) describing the components of a structure
- We define two sets of symbols
	- _Terminal symbols_ are the symbols in our underlying alphabet
	- _Non-terminal symbols_ have at least one rule showing how they are made up of sequences or other symbols
- For example, this language has two rules, one non-terminal, and two terminal symbols
	- _Parens -> ( Parens ) Parens_
	- _Parens ->_
- We can generate a _Parens_ by choosing one of the rules and replacing it with the right side, and then repeating until our string only contains terminal symbols

## Some CFGs
```
E -> 0
E -> 1
E -> E + E
E -> E - E
E -> E * E
E -> (E)
```
- _E_ describes a simple language containing some arithmetic expressions
	- For example: 1 * (0 + 1)
	- Note that _E_ is non-terminal, and does not appear in the language

```
S -> E;
S -> if (E) S
S -> if (E) S else S
S -> { SS }
SS -> S SS
SS -> S
```
- _S_ incorporates _E_, and describes strings that resemble statements in a C-like language
	- SS represents a sequence of one or more statements
- How can we determine whether a string is a part of _E_?
- "1 + 0" is, because we can replace E with E + E, and then replace those with 1 and 0, respectively
- "1 + 0 -" is not
	- Proof: any string in _E_ that includes - must have another string in _E_ following the -, and "" is not a string in _E_
- _E_ gives us a way to say which strings are part of the language that we can all agree on

```
P ->
P -> a
P -> b
P -> a P a
P -> b P b

Q ->
Q -> a Q b
```
- What sort of strings do the languages _P_ and _Q_ contain?
- Every string in _P_ longer than one symbol will begin and end with the same symbol and have another string in $_P_ between them
	- Every string in _P_ is a _palindrome_
- Every string in _Q_ is empty, or begins with a, ends with b, and has another string in _Q_ between them
	- A string that begins with some number of a's must end with an equal number of b's
	- No 'a' can occur after a 'b'
	- Q describes strings in the form $a^nb^n$ for all $n \ge 0$

## Why "Context-Free"?
- To generate strings in a CFG, we start with a designated non-terminal and repeatedly replace non-terminal symbols according to rules until only terminals remain
	- _E -> E + E -> 1 * (E) -> 1 * (E + E) -> 1 * (0 + 1)_
- To do the replacement, we only need to look at the non-terminal itself and choose an appropriate rule
	- That is, we don't need to consider the _context_ where that non-terminal appears in the string
- No CFG can describe a language like $a^nb^nc^n$, because we cannot break it down into independent non-terminals

## Parse Trees
![](https://i.gyazo.com/88587e369d3eaf735a7994d8ada92779.png)
- A parse tree shows the derivation of a string in some language
- Each interior node is a non-terminal symbol, and each leaf is a terminal
- The children of a non-terminal symbol correspond to some rule
- A string is part of the language if and only if we can construct a parse tree
- Knowing the parse tree for a particular string can give us additional information
- Programming languages use their parse trees to explain the organization of their code: functions, statements, expressions, etc.
- Instead of just saying whether or not a string is part of the language, we can produce a parse tree for the string ([[Parsing]])
	- for example, we could use the parse tree of an arithmetic expression to guide our evaluation
	- The parse tree encodes the "order of evaluation"

## Ambiguity
- How can we avoid ambiguity?
- Provide some way of breaking ties
- Rewrite the grammar to be unambiguous
	- Usually easier to understand
	- Tools can detect whether a CFG is ambiguous, just rewrite until it isn't
```
F -> 0
F -> 1
F -> (E)

T -> F
T -> T * F

E -> T
E -> E + T
E -> E - T
```
> Note: E rewritten to avoid right recursion

## Backus-Naur Form (BNF)
- A language for writing CFGs
- Rules have the form _NT ::= S S S..._, where _NT_ is a non-terminal and _S_ may be a terminal or non-terminal
	- We can write terminals in quotes, or skip the quotes if its unambiguous
- We can define multiple rules for a terminal, or combine them using `|`
	- _E ::= "1" | "0" | E "+" E | E "-" E | "(" E ")"_
- Each rule shows how a terminal is made up of other symbols
- Terminal symbols in quotes (optional), non-terminals regular
- We can have multiple rules for a given non-terminal, or use `|` to combine

```
Sentence  ::= NP Predicate
NP        ::= Article Noun
Article   ::= "a" | "the"
Predicate ::= Verb
Predicate ::= Verb NP
Noun	  ::= "cat" | "dog" | "mouse"
Verb	  ::= "saw" | "chased" | "slept"
```
- Can we prevent sentences like "the cat slept the mouse"?
	- We could refine the grammar to separate transitive and intransitive verbs
	- We could defer that to a later step (arity checking)

## Extended BDF (EBNF)
- EBNF provides some additional short-hand for common cases
- `(...)` for grouping a sequence of alternatives
	- `NP ::= ("A" | "The") Noun
- `[...]` for optional sequences of symbols
	- `Predicate ::= Verb [NP]`
- `{...}` for sequences of symbols that can be repeated 0 or more times
	- `Modifier ::= {Adverb} Adjective`
