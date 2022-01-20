# Types
### Logic Variables
- Haskell lets us pass computations to functions before evaluating them
- Prolog lets us use variables before assigning them values
- For some queries, we can get back answers that don't assign values at all
	- 
		```prolog
		?- member(X, [Y]).
		X = Y.
		```
- What are X and Y? Anything we can imagine, as long as they are the samse

---

- Prolog is largely untyped
	- We can say that certain terms have certain types, but this is not enforced by the language itself or checked by the compiler
- This is not necessarily a problem
- Relations are inherently partial, so we don't need to say what to do for inappropriate input
	- e.g., `height(apple, N)` will just fail

## Type Relations
```prolog
tree(tip).
tree(bin(L, _, R)) :-
	tree(L),
	tree(R).
```

- We can write relations that require their argument to belong to some type
- E.g., `tree(T)` requires T to be a binary tree
- `bst/1` also acts as kind of type requirement 

---

- Failure is not always the best choice for type errors - it can hide bugs
- Prolog provides exception for when we _really_ want to fail
	- Throwing an exception causes the entire query to fail, without backtracking
	- There is also a mechanism to catch exceptions
- The CLP(FD) relations throw type error exceptions when given inappropriate arguments
- Using exceptions correctly is subtle and involves tools we haven't discussed yet
	- We need to make sure we either succeed or throw the exception, but not both

## Termination
![[Termination]]

