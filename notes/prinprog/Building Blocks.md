---
slug: "/prinprog/building-blocks"
date: "2021-01-17"
title: "Prin Prog - Building Blocks"
---

- To use a programming language we must understand its syntax and semantics
- *Syntax* says whether a program is well-formed
	- That is, can a text be understood as a program
- *Semantics* says how a program is understood
- These days syntax usually has a formal specification 
	- Few languages have formally specified semantics
	- Note that *informal* does not mean simple

## Building Blocks
- Common syntactic structures in programming languages
- *Declarations* indicate that a name will be used for something
- *Definitions* link a name to something (e.g., a function body)
- *Statements* describe an action, or a sequence of actions
- *Expressions* describe how to compute something
- The boundaries of these can be fuzzy

```c
int foo(int, int); // Declaration of foo

// This whole func is the definition of bar
int bar(int x, int y) 
{
	int z; 				// Statement
	if (x > y) { 		// Statement
		z = foo(x, y);  // Function call is an Expression
	} else { 			// Statement
		z = foo(y, x);	// Function call is an Expression
	}

	return z;
}
```

## Expressions
- In general, a sequence of symbols that we can interpret in some way
- Simple expressions: variables (`x`), literal values (`5`)
- Compound expressions involve *subexpressions*
	- Operators (`x + 5`); function application ($sin \ \theta$)
	- More complicated forms ($\sum_{k=1}^nk^2$)

### Variables
- Variables are expressions that stand for something (value or subexpression)
- Interpreting an expression that contains variables requires a *context*
	- A context or *variable assignment* tells us what the variable means
	- Changing the context of an expression can change its resulting value
- In math, contexts are often implicit, but programming languages can't rely on reading comprehension and common sense

### Expression Trees
We can think of expressions as trees, with subexpressions as child nodes
<p align="center">
	<img src="https://i.gyazo.com/d743daec3ace3904dd5aeb5e9347923f.png" />
</p>

### Evaluating Expressions
Given an expression and context, we can *evaluate* it to produce a result
![](https://i.gyazo.com/43da6c5463491ded3381f64d526295b4.png)

### Free and Bound Variables
- Consider $\sum_{k=1}^nk^2$
	- $n$ is a *free* variable; its value cannot be understood just from the expression itself
	- $k$ is a *bound* variable; it is introduced by the summation form and is only meaningful within that subexpression (within its *scope*)
	- $(\sum^n_{k=1}k^2) + k$ doesn't make sense unless we assume the $k$ inside the parentheses is different from the $k$ outside the parentheses

### Binding Forms
- A *binding form* is an expression (or statement/definition/etc.) is a syntactic form that introduces a variable that is scoped over some subexpression(s)
	- Math notation has several of these that all look different and are sometimes implicit
	- Programming languages are explicit about where variables are bound in their scope
	
## Functions
- In general, a mapping from elements of one set to elements of another
- Many ways to define them: tables, algorithms, informal descriptions
- Common to write an expression that gives the answer in terms of its parameter: $f(x) = x^2$
	- More explicitly, $\forall x \ f(x) = x^2$
- Lambda calculus lets us define functions with an explicit variable binder
	- $f = \lambda x \ x ^ 2$
	- "f is a function that returns the square of its argument"

### Evaluating Functions
- If we know $f(x) = x^2$, how can we evaluate $f(2)$?
	- Substitution: set $x = 2$, replace $f(2)$ with $2^2$, and continue
- What about $f(a + b)$?
	- If we know $a$ and $b$, we can evaluate the argument and then evaluate the application
	- Or we can evaluate the application first, get $(a + b)^2$, and continue
	- These are called *applicative order* and *normal order*, respectively

## Semantics
- Syntax tells us how to turn program text into an expression tree
	- For example, operator precedence says what the root of `a + b * c` will be
- Semantics tells us how to evaluate / execute the tree
	- How do compound statements work?
	- Do arguments get evaluated before the function?
	- Does it matter in what order sibling nodes in the tree get evaluated?
