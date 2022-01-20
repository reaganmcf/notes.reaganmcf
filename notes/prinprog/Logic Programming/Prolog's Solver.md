# Prolog's Solver
- Recall: a _query_ is one or more terms, separated by commas or semicolons
	- Commas mean "and", semicolons mean "or"
	- 
		```prolog
		president(M), has_pet(M, P), (cat(P); dog(P)).
		```
- The solver looks for variable assignments that satisfy the query
	- That is, what values result in statements that can be proven?
- Strategy: prove each term, from left to right
	- If we can't prove a term, backtrack to the last choice point and make a different choice

## Solving
```prolog
president(chris).
president(jackie).
president(pat).

has_pet(chris, polly).
has_pet(pat, barksalot).

dog(barskalot).
```

- 
	```prolog
	president(M), has_pet(M,P), (cat(P); dog(P)).
	```
- Solve for `president(M)`
	- 
		```prolog
		M = chris; % ...1
		```
- Solve for `has_pet(chris, P)`
	- 
		```prolog
		P = polly
		```
- Solve for `cat(polly);` ...2
	- False, backtrack, to ...2
- Solve for `dog(polly)`
	- False, backtrack to ...1
- Resume solving for `president(M)`
	- 
		```prolog
		M = jackie; % ...3
		```
- Solve for `has_pet(jackie, P)`
	- False, backtrack to ...3
- Resume solving for `president(M)`
	- 
		```prolog
		M = pat
		```
- Solve for `has_pet(pat, P)`
	- 
		```prolog
		P = barksalot
		```
- Solve for `cat(barksalot);` ...4
	- False, backtrack to ...4
- Solve for `dog(barksalot)`
	- True
- Final solution: `M = pat, P = barksalot`

## How it works
- Prolog's solving strategy is depth-first, with backtracking
	- Go as far as we can with a solution
	- Retreat to the last decision if we cannot proceed
- Each time the solver makes a choice, it leaves a _choice point_ describing the alternative path
	- When backtracking, it rewinds to the most recent point and goes the other way
	- The solver uses a few tricks to avoid leaving choice points when no other solution is possible
	- Sometimes, a choice point is left that won't succeed; e.g., `member(1, [1,2])`

## Case Study
![[Binary Search Trees]]