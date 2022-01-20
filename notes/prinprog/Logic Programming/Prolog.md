# Prolog
- Abbreviation for programmation en logique ("programming in logic")
- Created in France in the 1970s by AI researchers
- A program consists of fact and rule declarations and a particular query to solve
- Untyped: all values are terms
- Depth-first, backtracking solver


## Using Prolog
- After loading a source file, we can ask a Prolog environment questions
```prolog
?- 1 + 1 #= 2.
true.
?- 1 + 1 #= X.
X = 2.
?- X + 1 #= 2.
X = 1.
?- X * X #= 4.
X in -2\/2.
?- X * X #= 4, X #> 0.
X = 2.
```

## Relations
- A function is a mapping from a domain to a co-domain
	- We compute a single output for each input
	- $f(x) = x^2+1$
- A relation either holds or does not hold
	- $P(x,y) \equiv y < x^2 + 1$
	- Relations do not have a "direction": we can hold any parameter constant while allowing others to vary
		- $\exists \ y . \ P(5,y)$ vs $\exists \ x . P(x,26)$

## Variables
- In Prolog, all variables begin with a capital letter or `_`
- Every variable is scoped over a _clause_
	- That is, a single fact, rule, or query
- Variables are implicitly declared
- Variables are initially _free_ (not assigned to any value)
	- The solver will constrain variables
	- If the constraints become inconsistent, the query cannot be satisfied

## Syntax: Variables and Atoms
- Everything in Prolog is a _term_
- A term may be a variable, such as `X`, `Sum`, or `_127`
- A term may be an _atom_ (or symbol)
	- A word stating with a lower-case letter or digit: `x`, `square`, `17`
	- Text surrounded by single quotes: 'Jim', '#=', 'long atom'
	- Each atom is its own value (similar to strings)
		- The quotes are not part of the name: `x` and `'x'` are the same

## Syntax: Terms with Arguments
- A term may be an atom to arguments (sub-terms)
	- Usually written with parentheses and commas
		- `square(X, 25)`, `+(A, 1)`, `'fancy insert'(2, [1,3,4], L)`
	- Some atoms can be declared 'infix'
		- E.g., `X + 1` is the same as `+(X,1)`
		- Each infix atom has a precedence and associativity
	- These are not function calls! An atom applied to arguments is a tree
	- Note: it has to be an atom, not a variable; `X(1,2)` is not allowed


## Syntax: Lists
- Lists in Prolog are just terms constructed with specific atoms
- Traditionally, the empty list is `'[]'` and non-empty list is '.' applied to two arguments
- Instead of using those directly, we use square brackets
	- Empty list: `[]`
	- Non-empty lists separate elements with commas: `[1, hello, 'how are you?', [2,3,4]]`
	- The tail of the list can be given after |: `[Head, Tail]`, `[1,2|X]`
	- `[1,2,3] = [1,2,|[3]] = [1|[2,3]] = [1|[2|[3]]] = [1|[2|[3|[]]]]`
- Don't confuse Haskell list notation with Prolog list notation

## Terms are Trees
```prolog
person(name('John', 'Smith'), date(1785,6,2), deceased)
```

![](https://i.gyazo.com/06de9c6d6c63522e0779cfad16a83312.png)

```prolog
X + 1 = 2 * Y
= (+(X,1), *(2,Y))
``` 

![](https://i.gyazo.com/27e247e7272af6deea152454307a37e8.png)

```prolog
[a,b,X|Y]
'.'(a,'.'(b,'.'(X,Y)))
```
![](https://i.gyazo.com/9e459818844a7c123a7640ff5a30f21b.png)

## Terms are not Functions
- Do not be fooled by your experience with other programming languages!
	- A term with arguments is _data_, not a function call
- Prolog uses terms to represent everything: facts, rules, queries
- When you enter a term in the solver, it is treated as a query
- When you load a file containing terms, they are added to the solver's database

## Facts
- Prolog files contain facts, rules, and directives
- A _fact_ is a term followed by a period
	- 
		```prolog
		eats(jim, vegetables).
		```
	- 
		```prolog
		eats(jane, Anything)
		```
- Facts have no inherent meaning, beyond what we give to them
	- All prolog cares about is "provable" vs "non-provable"
- Any variables used are defined only for that fact

## Rules
- A _rule_ is a fact written with `:-`
	- 
		 ```prolog
		 carnivore(X) :- eats(X, meat).
		 ```
	- For all `X`, `eats(X, meat)` implies `carnivore(X)`
	- For all `X`, to prove `carnivore(X)`, try proving `eats(X, meat)`
- We can call the left the "head", the "consequent", or the "conclusion"
- We can call the right the "tail", the "antecedent", or the "premise"
- Supposedly, `:-` looks like <-

## Conjunction and Disjunction
- To require proving multiple terms, separate them with commas
	- 
		```prolog
		?- eats(P,X), nondairy(X).
		```
	- 
		```prolog
		eats(jim, X) :- seafood(X), fresh(X).
		```
- Alternatives can be separated by semicolons
	- 
		```prolog
		?- (P = jim; P = jane), eats(P, X).
		```
	- 
		```prolog
		eats(bob, X) :- seafood(X), (fresh(X); preserved(X)).
		```
		
## Solving
- [[Prolog's Solver]] is fairly simple
- To solve some query G:
	- For each rule whose head _unifies_ with G:
		- Attempt to solve the tail
- If we can recursively solve all the subgoals, the query is satisfied
- There may be multiple solutions

### Example
```prolog
mouse(jerry).

cat(garfield).
cat(tom).

dog(odie).
dog(scooby).

chases(X, Y) :- cat(X), mouse(Y).
chases(X, Y) :- dog(X), cat(Y).
chases(garfield, odie).
chases(ghosts, scooby).
```

- This Prolog code defines four relations
- The convention in Prolog is to refer to a relation by giving its name and the number of parameters (arity)
	- `mouse/1`, `cat/1`, `dog/1`, `chases/2`
- The name and the arity together identify the relation
	- If we defined `dog/2`, it would be unconnected to `dog/1`
- Once we load this into a Prolog environment, we can ask questions
- If a fact matching our question is present in the database, Prolog will answer true
	- 
		```prolog
		?- cat(garfield).
		true.
		```
- If the query contains variables, Prolog will try to unify it with its facts and report the _unifier_
	- 
		```prolog
		?- cat(X).
		X = garfield ;
		X = tom.
		```
- If no fact matches the query, Prolog returns false.
	- 
		```prolog
		?- cat(heathcliff).
		false.
		```
- If the query has multiple subterms, Prolog will try to find a consistent assignment of variables
	- 
		```prolog
		?- cat(X), dog(X).
		false.
		```
- If the query matches the head of a rule, Prolog will add the tail as additional goals
	- 
		```prolog
		?- chases(odie, G).
		```
- Two rules unify with the query, so Prolog will try both
- Goal: `cat(odie), mouse(G)`.
	- The first subgoal fails
- Goal: `dog(odie), cat(G).`
	- Succeeds with `G = garfield; G = tom`

## Matching
- Formally, a query matches a fact or rule head if they _unify_
	- Similar to pattern matching in [[Haskell]], but more powerful
- Two terms unify if there is an assignment of variables that make them _equal_
	- Meaning, the same term structure with the same atoms and variables
- So, `pie(apple)` and `pie(F)` unify, because we can make `F = apple`
	- `pie(meat)` and `cheese` do not unify
	- `pie(meat)` and `pie(cheese)` do not unify

## Equality
- When are two terms considered _equal_?
	- Atoms are equal to themselves (ignoring some syntax; e.g., `x` = `'x'`)
	- Variables are equal to themselves
	- Compound terms are equal if they have the same functor, the same number of arguments, and the corresponding arguments are equal
- For the most part, equal terms look identical
	- Exceptions: quotes around atoms, infix vs prefix terms

## Substitutions
- Recall: A _substitution_ is a mapping of variable names to values
- Applying a substitution to a term replaces variables with their corresponding values
	- Applying a substitution to a term produces an _instance_ of that term
	- Applying {X = pie, Y = Z} to `eats(Y, X)` produces `eats(Z, pie)`
- Two terms unify if at least on term is an instance of both
	- That term is called a _unifier_
	- `eats(alice, pie)` is the unifier of `eats(X, pie)` and `eats(alice, Y)`

## Another Solving Example
- To attempt to solve a goal G
- For each rule head F
	- If G and F unify, apply the same substitution to the tail of F and add its contents as sub-goals
	- Recursively prove all sub-goals
- Remember: all variables in Prolog are local to a single cause
	- To avoid confusion/capture, replace all the variables in a rule with unused names before unifying

```prolog
parent(alice, eve).
parent(bob, eve).
parent(carol, frank).
parent(dan, frank).
parent(eve, gerald).
parent(frank, gerald).

grandparent(X, Z) :-
	parent(X, Y),
	parent(Y, Z).
```

### Example 1
- Query: `parent(X, gerald).`
- Try each clause defining `parent/2`
- Succeed with `X = eve`
- Succeed again with `X = frank`

### Example 2
- Query: `grandparent(bob, X).`
- One relevant rule
	- Rename variables to avoid capture
	- `grandparent(_1, _2) :- parent(_1, _3), parent(_3, _2).`
- Unify with {`_1` = `bob`, `_2` = `X`}
- Introduce subgoals
	- `parent(bob, _3), parent(_3, X)`
- Goals: `parent(bob, _3), parent(_3, X)`
- Try to prove first goal
- Succeeds with {`_3` = `eve`}
- Substitute with remaining goal: `parent(eve, X)`
- Try to prove last goal
- Succeeds with {`X` = `gerald`}
- Report `X = gerald`

### Example 3
- Query: `grandparent(Y, gerald)`
- One relevant rule, rename vars to avoid capture
	- `grandparent(_1, _2) :- parent(_1, _3), parent(_3, _2)`
- Unify succeeds: {`_1` = `Y`, `_2` = `gerald`}
- Goals: `parent(Y, _3), parent(_3, gerald).`
- First solution: {`Y` = `alice`, `_3` = `eve`}
- Goal: `parent(eve, gerald)`
- Proven, with `Y = alice`
- If we ask more answers, the solver will backtrack to the previous goal and find {`Y` = `bob`, `_3` = `eve`}

## Meaning vs. Procedure
- Ideally, we want to think about what our rules _mean_
	- E.g., X is the grandparent of Z if there is some Y such that X is the parent of Y and Y is the parent of Z
- The specific process used by the solver should not be important
	- ...except that certain ways of expressing rules may cause the solver to waste time
	- ...or get s tuck trying infinitely many subgoals
- So we must dirty our hands with process, from time to time
	- [[Prolog's Solver]] is relatively simple, so it's easier to see where it gets stuck

## Working with Data
- How do I add up all the elements in a list?
- Wrong question!
- What _relation_ exists between lists and their sums?
- 
	```prolog 
	sum([], 0). % the sum of the empty list is 0
	```
- 
	```prolog
	sum([X|Tail], Sum) :- sum(Tail, S), Sum #= X + S.
	```
	- `X` is the first element of the list, `Tail` is the rest of the list
	- `Sum` is the sum of the whole list, `S` is the sum of the tail

## Relations are Flexible
```prolog
?- sum([1,2,3], 6).
true.

?- sum([1,2,3], X).
X = 6.

?- sum([1,X,3], 6).
X = 2.

?- sum([1, X, 3], Y).
Y #= X + 4. 		% or something that simplifies to this

?- sum(L, 6).
L = [6]				% and infinitely many other solutions...
```

## List Membership
- How can I tell whether `X` is part of some list `L`
- 
	```prolog
	member(X, [X|_]).
	```
	- X is part of a list if the first element of the list is X
	- Unlike in Haskell, variables can occur multiple times in a Prolog pattern
- 
	```prolog
	member(X, [_|T]) :- member(X, T).
	```
	- X is part of a list if X is part of the tail of the list.
### Example
```prolog
member(X, [X|_]).
member(X, [_|T]) :- member(X, T).
```
- 
	```prolog
	?- member(2, [1,2,3]).
	true ;
	false.
	```
- What happened?
- The solver tries every possibility
- When we tried to solve `member(2, [2,3])`, both rules match
	- We know only the first will succeed, but the solver doesn't, so it offers to try again
- Remember: the semicolon means _or_, if we succeed once, it doesn't matter if we fail later

### Another example
- 
	```prolog
	?- member(1, [1,1,2]).
	true ;
	true ;
	false.
	```
- What happened?
- Again, the solver tries every possibility, and here two of them lead to success
- From a theoretical standpoint, this is not a problem
- From a practical standpoint, this may slow down solving of larger goals

---

## Facts/Queries/Statements/Terms
- Prolog only knows about _terms_ (atoms, variables, atoms applied to arguments)
- We use terms to model the actual things we want to talk about
- `parent(joel, ellie).` "Joel is the parent of Ellie"
- `square(5, X).` "X is the square of 5"
- `length([1,2,3], 5).` "The length of [1,2,3] is 5"
- `bst(bin(tip, 4, bin(tip, 6, tip))).` "bin(tip, 4, bin(tip, 6, tip)) is a binary search tree"
- We can always tell whether a term is being used as a query, fact, or part of an implication, but any meaning beyond that is outside the scope of Prolog

### Facts
- In Prolog source code, a term followed by a period states a fact
	- 
		```prolog
		age(john, 37).
		```
- Prolog queries can be entered into the Prolog environment
	- `age(john, 37).` "Is John's age 37?"
	- `age(john, X).` "What is X, such that John's age is X?"
	- `age(X, 37).` "What is X such that X's age is 37"
	- `age(X, Y).` "What are X and Y, such that X's age is Y?"

### Rules/Implications
- A rule says how infer facts from other facts
	- Or, what other facts must be proven in order to prove some fact
- `eligible(X) :- age(X, Y), Y #> 35.`
	- The head, `eligible(X)`, says what this rule can prove
	- The tail says what needs to be proven in order to prove the head
	- "X is eligible if the age of X is Y, and Y > 35."
	- "For all X, X is eligible if, for some Y, the age of X is Y and Y > 35"

## Variable Scope
- All variables in Prolog are scoped over a single _clause_
	- A sequence of terms separated by commas/semicolons and terminated by a period
- Variable names can be re-used in different clauses, but they are unrelated
- We can always rename a variable to avoid confusion
- Variables are initially uninstantiated, but may become constrained or instantiated as a result of unification
	- Variables in facts and rule heads are effectively universally quantified
	- Variables in queries or only used in rule tails are effectively existentially quantified

## Solving
- To use a fact or rule to prove a query, we _unify_ the query with the fact or rule head
	- We find substitutions that will make the terms equal
- Example: using `eligible(X) :- age(X, Y), Y #> 25.` to prove `eligible(john)`
	- Unify `eligible(X)` with `eligible(john)` - succeeds with `X = john`
	- Apply substitution to rule tail: `age(john, Y), Y #> 25.`
	- Prove each of these terms


## Constraints
- Originally, Prolog variables were either instantiated or uninstantiated
	- That is, they had a specific value, or could take on any value
- Most Prologs now support _constrained_ variables, which are limited to a subset of all possible values
	- This allows the solver to answer queries such as `dif(X, Y), X = Y.` in finite time
- Constraint Logic Programming (CLP) is a general framework for expressing these constraints
	- If a Prolog environment offers CLP(X), it means we can constrain variables to fall within X (e.g., finite sets of integers, integers, real numbers, etc.)

### Using `dif/2`
- `\=/2` is true if its arguments cannot be unified, based on _previous_ substitutions
	- Its meaning is tied to the solving process
	- Its meaning is not purely logical
- `dif/2` constrains its argument to be non-equal
	- Its meaning is independent of how [[Prolog's Solver]] works
	- `\=` can only react to the past, but `dif` can constrain the future

## Integer Arithmetic
- Prolog has a standard set of terms for working with numbers
	- ...but they aren't great, so we will use CLP instead
- CLP(FD) or CLP(Z) let us set constraints for integer-valued variables
	- 
		```prolog
		:- use_module(library(clpfd)). % in a Prolog file
		```
- `A #= B` asserts that A and B are equal, if interpreted as arithmetic expressions

## `=` vs `#=`
- `A = B` means that A and B are unifiable
	- Can be made equal by substituting values
	- `1 + 1 = 2.` - false: `+(1, 1)` and `2` are distinct terms
- `A #= B` means that A and B are numerically equal
	- Can be made equal by substituting variables and performing arithmetic
	- `1 + 1 #= 2.` - true, because we can simplify `+(1, 1)` to `2`
- You may see `is` and `=:=` in textbooks/tutorials; use `#=` instead

## Numeric Operations
- We can form arithmetic expressions with the usual operators
	- `+, -` (binary and unary), `*`, `^`
	- `//, rem` (integer division/remainder using truncation)
	- `div, mod` 
	- `abs, min, max`
- Relations: `#=, #\=, #<, #>, #=<, #>=`
	- Note `#\=` for not equal, and `#=<` for less than or equal

## Solving
- `CLP(FD)` can solve most statements involving finite sets of integers, but can struggle with infinite sets
- 
	```prolog
	?- X #< 5, X #> 5.
	false.
	```
- 
	```prolog
	?- X #< Y, X #> Y.
	```
- CLP(FD) isn't quite strong enough to realize these constraints are unsatisfiable, but it can if we assert a finite domain
- 
	```prolog
	?- X #< Y, X #> Y, Y in 0..1000.
	false.
	```
	
## Domains
- We can set the domain of a variable using `in`/2
	- 
		```prolog
		X in 0..20.
		```
- Domains are:
	- A single integer
	- A range, `Lower .. Upper`, where the bounds may be integers, `inf`, or `sup`
	- A union, `D1\/D2`, where D1 and D2 are domains
	- Domains may not contain uninstantiated variables
- E.g.., `X in -10 .. -1 \/ 1 .. 10.`

### `#\=` vs `dif`
- What is the difference between `dif(X, 0)` and `X #\= 0`?
- They may seem equivalent: X $\neq$ 0
- But `#\=` also constrains X to be an integer
- `dif(X, 0), X = good.` - provable
- `X #\= 0, X = good.` - error!
- Operationally, `dif` and `#\=` use different parts of the solver that don't necessarily communicate (may miss some opportunities to simplify)

## Example: Cryptarithmetic
- A _cryptarithmetic_ puzzle presents an arithmetic puzzle where letters stand for digits
	- An answer is correct if each letter is assigned to a different digit
	- Substitution results in a correct statement
	- No letter used in the most significant of a number is 0
- E.g., `EAT + PIE = MORE`
	- 350 + 893 = 1243
	- 420 + 954 = 1374

### Solving Cryptarithmetic
- How could we solve SEND + MORE = MONEY?
- A naive approach: try every assignment of digits to letters, and test each one until we find a correct one
- Problem: there are 10 digits and 8 letters in the puzzle: 100,000,000 posible solutions
	- We can reduce it to 10!/(10-8)! = 1,814,400 possible solutions if we only generate cases where the assignments are distinct
- Alternative: express more constraints before generating possible solutions

### Cryptoarithmetic Constraints
- Puzzle: SEND + MORE = MONEY
- We can use `in` to constrain our variables to the range `0..9`, or `ins` to restrict to a list of variables
	- 
		```prolog
		[S,E,N,D,M,O,R,Y] ins 0..9, S #\= 0, M #\= 0
		```
- We can use `all_different`/1 to require that every variable in a list be different from every other variable
	- 
		```prolog
		all_different([S,E,N,D,M,O,R,Y])
		```
- Finally, the equality itself
	- 
		```prolog
		S * 1000 + E * 100 + N * 10 + D + M * 1000 + O * 100 + R * 10 + E #= M * 10000 + O * 1000 + N * 100 + E * 10 + Y
		```

### Resolving the Puzzle
- We added `Vars = [S,E,N,D,M,O,R,Y]` to avoid repeating the list of variables
	- Thus, `all_different(Vars), Vars ins 0..9`
- We can use `indomain`/1, `label`/1, or `labeling`/2 to force the solver to look for specific solutions
	- `indomain` instantiates a single variable, `label` instantiates a list of variables, and `labeling` has an additional argument that specifies a strategy
	- e.g., `label(Vars)`
	- But this only works if `Vars` is already instantiated with a list of variables, each of which is constrained to a finite domain - more non-logical aspects!


## Data Structures
- We use terms to build data structures
- Lists have a special syntax that creates nested terms
	- `[1,2,3]` is actually `[1|[2|[3|[]]]]`
- We can define our own data structures by using terms as constructors
	- e.g., `tip`/0 and `bin`/3 for binary trees
	- There is no type system to prevent mistakes, but we just fail for non-examples

### Height of a Tree
- What is the height of a tree?
	- `height`/2 is a relation between a binary tree and an integer
- `height(tip, 0).`
	- The height of the empty tree is 0
- 
	```prolog
	height(bin(L, _, R), N) :-
		N #= 1 + max(LH, RH), height(L, LH), height(R, RH).
	```
	- The height of a non-empty tree is one more than the height of its taller child

## Types
![[Prolog Types]]