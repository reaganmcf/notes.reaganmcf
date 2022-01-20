## Overview
- We will discuss three more formalisms for specifying formal languages
	- Regular expressions, deterministic finite [[Automata]] ([[DFA]]), and non-deterministic finite [[Automata]] ([[NFA]])
- We will show that these are equivalent in power: any language I can specify with one can be specified by the others
	- Our proof will be a process for constructing these specifications (e.g, given RE, construct an NFA that recognizes the same language)
- A language is _regular_ if we can specify it using a Re/NFA/[[DFA]]
	- Note: We have already seen several non-regular languages
## Regular Expressions
- Each regular expression describes a unique language
- $\epsilon$ (epsilon) is the language that contains only the empty string
- $\emptyset$ is the language that contains no strings
- A symbol by itself is the language containing one string consisting of only that symbol
- We can combine regular expressions to create more complex expressions
	- We will use operators and parenthesis, just like arithmetic expressions
	- If $R$ is a regular expression, then $(R)$ is an equivalent expression

## Alternatives
- If $R$ and $S$ are regular expressions, $R|S$ is a regular expression indicating a choice between $R$ and $S$ 
	- $L_{R|S} = L_R \cup L_S$
	- $s \in L_{R|S}  \iff s \in L_R \lor s \in L_S$
- $\alpha|\epsilon$ describes a language with two strings "a" and ""
- $a|b|c$ describes a language with three strings: "a", "b", and "c"

## Composition
- If $R$ and $S$ are regular expressions, then $RS$ is a regular expression
	- Every string in $L_{RS}$ is a string in $L_R$ followed by a string in $L_S$
	- $L_{RS} = \{ r \bigoplus s : r \in L_R, s \in L_S\}$
	- $t \in L_{RS} \iff \exists u,v(t = u \bigoplus v \land u \in L_R \land v \in L_S)$
- $ab$ describes a language with one string "ab"
- $ab|cd$ describes a language with two strings: "ab" and "cd"
- $a(b|c)$ describes a language with two strings: "ab" and "ac"

## Repetition
- If $R$ is a regular expression, $R^*$ describes a language where every string is the concatenation of zero or more strings in $L_R$
	- $R^* = \epsilon | R | RR | RRR | \ldots = \epsilon | RR^*$
	- This is called the _Kleene_ star, after Stephen Cole Kleene
- $a^*$ describes a language containing: "", "a", "aa", "aaa", ...
- $(ab)^*$ describes a language containing: "", "ab", "abab", "ababab", ...
- Shorthand: $R^+ = RR^*$

## Notation
- We assume the following precedence: * or +, then composition, then |
	- $a|bc^8$ is identical to $a|(b(c^*))$
- We will ignore whitespace: a b is the same as ab
- We will avoid the need for quoting by not describing languages that include the symbols $\epsilon$, $\emptyset$, |, (, ), *, or +
- Note that other notations exist that are designed for different use cases
	- For example, grep uses a syntax designed for searching text

## Generating Strings
- Replace $R^*$ or $R+$ with $R$ copied some number of times
	- $(a|bc|\epsilon)^*$ -> $(a|bc|\epsilon)(a|bc|\epsilon)(a|bc|\epsilon)$
- Replace each choice $R|S$ with either $R$ or $S$
	- $(a|bc|\epsilon)(a|bc|\epsilon)(a|bc|\epsilon)$ -> $(a)(bc)(\epsilon)$
- Replace $\epsilon$ with nothing; remove parenthesis
	- $(a)(bc)(\epsilon)$ -> $abc$
- If our string does not contain $\emptyset$, we have a string

## Recognizing Strings
- We might say a string matches $R$ if it is a part of $L_R$
- How can we tell if a string matches $R$
	- With practice, you will be able to see how to break a string into substrings that match subexpressions in $R$
- Does "ababcab" match $(ab|c)^*$
	- Yes, we can break it into "ab" "ab" "c" and "ab", each of which matches some part of $(ab|c)$
- Does "ababca" match $(ab|c)^*$
	- No, because we can only break into "ab" "ab" "c", but we will have "a" left over which does not match the expression

## Equivalence
- Two regular expressions are equivalent if they can describe the same language
- We can prove several laws
	- Concatenation is associative: $R(ST) =(RS)T$
	- Choice is associative: $R|(S|T) = (R|S)|T$$
	- Choice is commutative: $R|S = S|R$
	- $\epsilon$ is the unit for concatenation: $R\epsilon = R = \epsilon R$
	- $\emptyset$ is the unit for choice: $R|\emptyset = R = \emptyset | R$
	- $\emptyset$ is a zero for concatenation: $R\emptyset = \emptyset = \emptyset R$
	- Right and left distribution: $R(S|T) = RS|RT$ and $(R|S)T = RT|ST$
- Show $R^{**} = R^*$
	- A string matching $R^*$ trivially matches $R^{**}$
	- Any string matching $R^{**}$ can be broken into substrings, each matching $R^*$. These strings can then be broken into substrings, each matching $R$. Thus, the string could be broken into substrings matching $R$, meaning it could be matched by $R^*$

# BNF and AST for RE
## BNF
```
RE3 ::= Symbol
RE3 ::= "ε"
RE3 ::= "∅"
RE2 ::= RE2 "*"
RE2 ::= RE2 "+"
RE1 ::= RE1 RE2
RE  ::= RE "|" RE1
RE3 ::= "(" RE ")"
RE2 ::= RE3
RE1 ::= RE2
RE  ::= RE1
```

## AST
```hs
data RE sym
	= RSym sym
	| REps
	| RZero
	| RStar (RE sym)
	| RPlus (RE sym)
	| RSeq (RE sym) (RE sym)
	| RAlt (RE sym) (RE sym)
```

## Using the AST
- What can we do with a data structure representing an RE?
- We could write a parser (by hand, or using a parser generator)
- We could write the string using our RE notation
- We could generate every string that matches the RE
- We could transform the Re in some way (e.g., simplifying it)
- We could check whether a string matches the RE

![[Regex Parser]]