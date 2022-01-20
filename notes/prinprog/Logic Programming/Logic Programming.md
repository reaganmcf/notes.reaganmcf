 ## What are programs for?
 - Programs tell a computer how to find the answer to some question
	 - Often a parameterized question, e.g., `sqrt(x)` where x = 25
 - We can think of "question" and "answer" very broadly
	 - We could compute the answer the answer to a math problem
	 - We could generate a report based on a data set
	 - We could decide what actions to perform in response to user input

### Procedural Programming
- Compute answers by performing a sequence of actions
	- Manipulate the state of an abstract machine
	- Variables represent storage locations that can be read and updated
	- Explicit control flow: procedure calls, loops, branches

### Functional Programming
- Compute answers by evaluating functions
	- Evaluate function application with substitution
	- Variables represent values in a defined environment
	- Higher-order: Functions can have function arguments and can return functions
- Instead of saying how to compute a correct answer, say what the answer is
```haskell
length L
	if L = Nil, 0
	otherwise, 1 + length tail(L)
```

### Logic Programming
- Compute answer by solving logical queries
	- Provide facts and inference rules
	- Variable represent values, and may be bound or free
	- A solver searches for variable assignments that satisfy the query
- Instead of saying what the correct answer is, describe what it means for an answer to be correct
```prolog
the length of Nil is 0
the length of L is N, if the length of tail(L) is M and N = M + 1.
```

---

# Logic Programming
- The goal of logic programming
	- State facts
	- Let computer answer queries based on those facts
- Reality
	- State facts in restricted first-order predicate calculus
	- Answer some queries, time permitting

## Example: Sorting

- List LS is a sorted version of List L, if
	- LS is a permutation of L
	- LS is in order
- Algorithm for finding LS, given L
	- For each permutation LP of L,
		- If LP is in order, then LS = LP
- How fast is this algorithm?
	- Let _n_ be the length of L
	- There are n! possible permutations, and checking for order requires _O(n)_ comparisons
	- If L has 20 elements, the worst case is ~4.8x10^19 comparisons

## What Computes?
- In functional programming, we describe the correct answer in terms of the question parameters
	- Actual computation is performed by an _evaluator_
	- Sometimes, we need to understand how the evaluator works in order to achieve good performance or avoid nontermination (divergence)
- In logic programming, we give rules that imply the correct answer(s)
	- Actual computation is performed by a _solver_
	- Sometimes, we need to understand how the solver works in order to achieve good performance or avoid nontermination

## Solvers
- Ideally, we just state facts and use them to answer queries
- Logic programs divide this into two parts
	- A question-specific set of facts and rules
	- A general-purpose solver
- The solver, or theorem prover, uses its own algorithms to answer queries based on the facts
	- Methods: unification, backward chaining, backtracking
	- Solvers can be simple and general (basic [[Prolog]]) or use sophisticated, domain-specific tactics (advanced [[Prolog]], SMT solvers)

### Haskell's Type System
- We have already seen logic programming hidden in Haskell's type system
- An instance states a fact
	- 
		```haskell
		instance Eq Int where ...
		```
- Or a rule for inferring facts
	- 
		```haskell
		instance (Eq a) => Eq (Tree a) where
		```
- The type checker will use these to infer facts, such as 
	```haskell
	Eq (Tree (Tree Int))
	```
	
