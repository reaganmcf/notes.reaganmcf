---
slug: "/compilers/lecture-17"
date: "2021-03-28"
title: "Compilers - Lecture 17"
---

# Lecture 17 - Syntax Analysis Part 6 and Context-Sensitive Analysis

## YACC: `parse.y`

```
%{
#include <stdio.h>
#include "attr.h"
int yylex();
void yyerror(char * s);
#include "symtab.h"
%}

%union { tokentype token; }

%token PROG PERIOD PROC VAR ARRAY RANGE OF
%token INT REAL DOUBLE WRITELN THEN ELSE IF
%token BEG END ASG NOT
%token EQ NEQ LT LEQ GEQ GT OR EXOR AND DIV NOT
%token ID CCONST ICONST RCONST

%start proram

%%
program : PROG ID ';' block PERIOD
  ;
block : BEG ID ASG ICONST END 
  ;
%%

void yyerror(char* s) {
  fprintf(stderr, "%s\n", s);
}

int main() {
  printf("1\t");
  yyparse();
  return 1;
}
```

### Error Recovery in Shift-Reduce Parsers

The problem: parser encounters an invalid token
Goal: Want to parse the rest of the file

Basic idea (panic mode):
  - Assume something went wrong while trying to find handle for non terminal A
  - Pretend handle for A has been found; pop "handle", skip over input to find terminal that can follow A

Restarting the parser (panic mode):
  - Find a restartable state on the stack (has transition for nonterminal A)
  - Move to a consistent place in the input (token that can follow A)
  - perform (error) reduction (for nonterminal A)
  - print an informative message

### Error Recovery in YACC

Yacc's error mechanism (note: version dependent!)
- Designated token `error`
- Used in error productions of the form `A -> error 𝛂` 
- 𝛂 specifies synchronization points

When error is discovered
- pops stack until it finds state where it can shift the `error` token
- resumes parsing to match 𝛂
  - special cases:
    - 𝛂 = w, where w is string of terminals: skip input until w has been read
    - 𝛂 = 𝛆 : skip input until state transition on input token is defined
- Error productions can have actions

```
cmpdstmt: BEG stmt_list END
stmt_list : stmt
          | stmt_list ';' stmt
          | error { yyerror("\n***Error: illegal statement\n");}
```

This should:
- Throw out the erroneous statement
- synchronize at ';' or 'end' (implicit: 𝛂 = 𝛆)
- writes message "\*\*\*Error: illegal statement" to stderror

![](https://i.gyazo.com/8e47d182cecc2381bff67408369c9cd6.png)

---

## Context Sensitive Analysis

There is a level of correctness that is deeper than grammar

![](https://i.gyazo.com/bdc7c2542c54d0024b1df09590044dc5.png)

To generate code, we need to understand it's meaning!

### Beyond Syntax

These questions are part of context-sensitive analysis
- Answers depend on "values", i.e., something that needs computation; not parts of speech
- Questions & answers involve non-local information

How can we answer these questions?
- Use formal methods
  - Context-sensitive grammars
  - Attribute grammars
- Use ad-hoc techniques
  - Symbol tables
  - Ad-hoc code

In scanning & parsing, formalism won; somewhat different story here.

Telling the story
- The attribute grammar formalism is important
  - Succinctly makes many points clear
  - Sets the stage for actual, ad-hoc practice (e.g.: yacc/bison)
- The problems with attribute grammars motivate practice
  - Non-local computation
  - Need for centralized information

We will cover attribute grammars, then move on to ad-hoc ideas (syntax-directed translation schemes)

### Attribute Grammars (AGs)

What is an attribute grammar?
- Each symbol in the derivation (instance of a token or non-terminal) may have a value, or _attribute_
- A context-free grammar augmented with a set of rules
- The rules specify how to compute a value for each attribute

*Example grammar*

![](https://i.gyazo.com/3cfa2454dafe182e49caa20ee482871b.png)


#### Example

![](https://i.gyazo.com/1c9d1bd0d1705680865d8db5de1bde45.png)

![](https://i.gyazo.com/6774663637076dfcf983d6139a561a3f.png)

![](https://i.gyazo.com/657385f4de62b70476f6d40c5d886672.png)

![](https://i.gyazo.com/81939b0d04d3a52d3943074cdd25a668.png)

![](https://i.gyazo.com/cde1efafc9fb74830df44c2aefa6d6b6.png)

We can add rules to compute the decimal value of a signed binary number

![](https://i.gyazo.com/8c1b68ba0919c9a4cea1c001788a8623.png)

![](https://i.gyazo.com/69b01cf268d944d10cc3f21b41d647a1.png)

Note: semantic rules associated with production A -> 𝛂 have to specify the values for all
  - **synthesized** attributes for A (root)
  - **inherited** attributes for grammar symbols in 𝛂 (children)
  - => rules must specify **local value flow!**
- Terminals can be associated with values returned by the scanner. These input values are associated with a synthesized attribute
- Starting symbol cannot have inherited attributes

If we peel away the parse tree and just show the computation...

![](https://i.gyazo.com/430c6507b6ac92a9cc69ce7537a2e62d.png)

- All that is left is the attribute dependency graph!
- This succinctly represents the flow of values in the problem instance
- The **dynamic methods** topologically sort this graph, then evaluates edges / nodes in that order
- The **rule-based methods** try to discover "good" orders by analyzing rules
- The **oblivious methods** ignore the structure of this graph

NOTE: THIS GRAPH **MUST BE ACYCLIC**

#### Using AGs

Attribute grammars can specify context-sensitive actions
- Take values from syntax
- Perform computations with values
- Insert tests, logic, ...

- **Synthesized Attributes**
  - Use values from children & from constants
  - **S-attributed** grammars: synthesized attributes only
  - Evaluate in a single bottom-up pass
  - Good match to LR parsing
- **Inherited Attributes**
  - Use values from parent, constants, & siblings
  - **L-attributed** grammars
    - A -> X1X2..Xn and each inherited attribute of Xi depends on
      - attributes of X1X2...Xi-1 and inherited attributes of A
  - Evaluate in a single top-down pass (left to right)
  - Good match for LL parsing

- Non local computation needed lots of suppporting rules
- "Complex" local computation is relatively easy

#### The problems with AGs
- Copy rules increase cognitive overhead
- Copy rules increase space requirements
  - Need copies of attributes
- Result is an attributed tree
  - Must build the parse tree
  - Either search tree for answers or copy them to the root
