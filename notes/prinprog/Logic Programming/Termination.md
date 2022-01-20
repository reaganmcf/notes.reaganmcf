# Termination

## Nontermination
- Ideally, we can just state requirements and let the solver find solutions
- but the solver's strategy can result in missing some solutions
- Prolog's depth-first strategy runs into problems if there are infinitely many possibilities
- Consider:
	- 
		```prolog
		?- T = bin(bin(tip,1,tip), x, tip), tree(T).
		```
	- 
		```prolog
		?- tree(T), T = bin(bin(tip, 1, tip), x, tip).
		```
	- The first succeeds, the second does not terminate

## Termination Terminology
- We say a query _terminates existentially_ if it returns a result, or fails
- We say a query _terminates universally_ if returns all results
	- That is `Q` terminates universally if `Q, false` terminates existentially
- When T is uninstantiated, `tree(T)` terminates existentially, but not universally
- Existential termination can be sufficient, but universal termination is safer

## Infinite Missing Trees
```prolog
tree(tip).
tree(bin(L, _, R)) :-
	tree(L),
	tree(R).
```
- Recall: `tree(T), T = bin(bin(tip,1,tip),x,tip).`
- The solver produces:
	- 
		```prolog
		T = tip;
		T = bin(tip,_,tip);
		T = bin(tip,_,bin(tip,_,tip));
		T = bin(tip,_,bin(tip,_,bin(tip,_,tip)));
		...
		```
- Since `tree(R)` produces infinitely many trees, we never backtrack to `tree(L)`
	- There are infinitely many trees that never get produced

## Fixing `tree/1`
- `tree/1` does not behave well when its argument is uninstantiated
	- `tree(T)` produces infinitely many trees, but not all trees
- But `tree/1` works fine if its argument is instantiated
	- In fact, all we need is for the tree structure to be instantiated, the contents can be uninstantiated
- One way to resolve this issue: only use `tree/1` with instantiated arguments
	- The "just don't do that" approach
- You can fix this with [[Mode Annotations]]

## Existential vs. Universal
- We say a Prolog query terminates _existentially_ if we get at least one answer
	- That is, we get a solution or false in some finite amount of time
- We say a Prolog query terminates _universally_ if we get every answer
	- That is, if we keep requesting more answers, we eventually reach the end
- Usually, termination in Prolog means universal termination

## Nonterminating Queries
- There are two ways a query can fail to terminate
	- At some point, it stops producing answers
	- It produces infinitely many answers
- Infinitely many answers is preferable to no answer, but both can cause problems
- Specifically, we cannot backtrack past a nonterminating query

### Illogical Nontermination
- Nonterminating queries do not respect the logical nature of Prolog
	- Logically, the order of terms should not matter
	- Operationally, the order of terms may affect whether they terminate
- This is unfortunate
	- We want to be able to use logical reasoning to understand Prolog programs
	- We don't want to depend too much on how the solver works
- Can we minimize this?

### Avoiding Infinity
- Method 1: document the assumptions made by our code
	- E.g., tree/1 only terminates if its argument is an instantiated tree structure (mode: `tree(+Tree)`)
- We can use this as a guide to rearrange our code
	- E.g., make sure we place `tree(T)` in a part of the query where we know `T` will be instantiated
	- Other languages (Mercury) have explicit mode annotations and do this transformation for you
- Of course, this depends on us understanding how the solver works
 
 ## Procrastinating
 ```prolog
 ftree(T) :- freeze(T, ftree_(T)).
 
 ftree_(tip).
 ftree_(bin(L,X,R)) :- ftree(L), ftree(R).
 ```
 
 - Method 2: don't answer until you have enough information
	 - E.g., use freeze/2 to delay queries until variables are instantiated
	 - More generally, write constraint handling rules (CHR)
 - Transform generate-and-test into gather-constraints-and-generate
 - Getting this right can be tricky; and may require sophisticated tools
 
 ## Controlled Searching
 - Method 3: control the search strategy
 - Prolog uses depth-first search, but this only visits every node in a finite tree
 - Breadth-first search will find every solution, but it requires too many resources
	 - Consider BFS on a complete binary tree: the queue of nodes to visit grows exponentially with the depth of the tree
 - A compromise is limited depth-first search with iterative deepening
	 - Find all solutions with depth 1, then restart and find all solutions with depth 2, and so forth
	 - This might seem wasteful, because we keep re-doing the early steps, but if the number of solutions grows exponentially we only spend half our time repeating work

## Iterative Deepening
- How could we produce solutions where T is increasingly large trees?
	- We could constrain the height, using height/2
	- E.g., `height(T, N)` gives us every tree of height 3
- To. find every tree of every height, we just need a term with one solution for every non-negative integer
- We could write our own, but length/2 already exists
	- `length(_, N), height(T, N).`
	- Each time we finish generating the trees for some height N, we backtrack to length and obtain a larger N
## Constraints vs Deepening
- Which one is appropriate depends on what you are doing
- Constraints are safer if there are only finitely many solutions
	- 
		```prolog
		ftree(T), T = bin(bin(tip, 1, tip), 3, tip).
		```
		- Terminates universally
	- 
		```prolog
		length(_, N), height(T, N), T = bin(bin(tip,1,tip),3,tip)).
		```
		- Terminates existentially, but does not terminate after that
- Iterative deepening can give you concrete solutions, rather than a jumble of constraints


### Example: Route-finding
```prolog
connect_(manhattan, bronx, bridge).
connect_(manhattan, brooklyn, bridge).
connect_(manhattan, staten_island, ferry).
connect_(manhattan, queens, bridge).
connect_(staten_island, bridge).
connect_(brooklyn, queens, road).
connect_(queens, bronx, bridge).

connect(X, Y, Z) :- connect_(X, Y, Z).
connect(X, Y, Z) :- connect_(Y, X, Z).

path(1, X, X, [X]).
path(N, X, Y, [X|P]) :-
	N #> 1,
	N #= M + 1,
	connect(X, Z, _),
	path(M, Z, Y, P).
```

- Recall this example from lecture 24
- connect/3 relates two locations and a connection type
- path/4 relates a number, two locations,and a list of locations when the number is the length of the list, the list is a path following connect3, and the two locations are the start and end
- We can use path/4 to verify that a path exists
- But searching for paths won't produce every answer
	- `path(_, brooklyn, bronx, P)` only finds paths going through queens
- We could rewrite path/4 to prevent paths from looping 
- We could use iterative deepening to get every possible path

#### Looking for routes
```prolog
?- path(N,brooklyn,bronx,P).  
N = 3,  
P = [brooklyn, queens, bronx] ;  
N = 5,  
P = [brooklyn, queens, bronx, manhattan, bronx] ;  
N = 7,  
P = [brooklyn, queens, bronx, manhattan, bronx, manhattan, bronx] ;  
N = 9,  
P = [brooklyn, queens, bronx, manhattan, bronx, manhattan, bronx, manhattan, bronx] ;  
N = 11,  
P = [brooklyn, queens, bronx, manhattan, bronx, manhattan, bronx, manhattan, bronx|...] ;  
N = 13,  
P = [brooklyn, queens, bronx, manhattan, bronx, manhattan, bronx, manhattan, bronx|...] .
```

#### Routes with Iterative Deepening
```prolog
?- length(P,N), path(N,brooklyn,bronx,P).  
P = [brooklyn, queens, bronx],  
N = 3 ;  
P = [brooklyn, manhattan, bronx],  
N = 3 ;  
P = [brooklyn, queens, manhattan, bronx],  
N = 4 ;  
P = [brooklyn, manhattan, queens, bronx],  
N = 4 ;  
P = [brooklyn, staten_island, manhattan, bronx],  
N = 4 ;  
P = [brooklyn, queens, bronx, manhattan, bronx],  
N = 5 ;  
P = [brooklyn, queens, bronx, queens, bronx],  
N = 5 ;  
P = [brooklyn, queens, manhattan, queens, bronx],  
N = 5 ;  
P = [brooklyn, queens, brooklyn, queens, bronx],  
N = 5 .
```

## Debugging Nontermination
- We have a query that we except to terminate, but it doesn't -- how can we find the bug?
- We can use a technique called _failure slicing_ to try to locate it
- Essentially, we insert false/0 into our definitions in various places and see whether things improve
	- Since `false` always fails, any remaining nontermination must be caused by earlier terms
- We can find the smallest part of the program that causes the nontermination

### Example: Failure Slicing
```prolog
connect(manhattan, bronx, bridge).  
connect(manhattan, brooklyn, bridge).  
connect(manhattan, staten_island, ferry).  
connect(manhattan, queens, bridge).  
connect(staten_island, brooklyn, bridge).  
connect(brooklyn, queens, road).  
connect(queens, bronx, bridge).  
connect(X, Y, Z) :- connect(Y, X, Z).
```

- Why didn't we define connect/3 this way?
- Because it doesn't terminate
	- `connect(manhattan, bronx, M)` has infinitely many successes
- How can we find the problem?
	- We still see nontermination if we add false to all the rules except the last, so it must be the problem

## Metaprogramming
- Prolog does not provide higher-order relations
	- Remember: first-order predicate calculus
- But, Prolog programs are just data, like any other Prolog data
	- When I write `freeze(T, ftree_(T))`, there is nothing special that tells Prolog the `ftree_(T)` is a relation; freeze/2 will use it that way
- We can use the call/N series of relations to invoke a relation indirectly

### Example: Generic Route-finding
```prolog
gpath(C, 1, X, X, [X]).
gpath(C, N, X, Y, [X|P]) :-
	N #> 1,
	N #= M + 1,
	call(C,X,Z),
	gpath(C,M,Z,Y,P).
	
connectAny(X, Y) :-
	connect(X,Y,_).
	
connectBR(X,Y) :-
	connect(X,Y,bridge);
	connect(X,Y,road).
```
- gpath/5 is similar to path4/, but the new first argument gives us the connection relation
- 
	```prolog
	gpath(connectAny, N, brooklyn, bronx, P).
	```
- 
	```prolog
	gpath(connectBR, N, staten_island, manhattan, P).
	```
- We can use gpath/5 with any binary relation