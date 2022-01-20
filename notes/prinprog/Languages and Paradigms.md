## Why "Languages"?
- Programming languages aren't like English or French. Why do we call them t hat?
- What is the analogy?
	- Syntax (what is a well-formed statement?)
	- Semantics (what does a statement mean?)
	- You can express algorithms with them
- What are the differences?
	- Syntax is rigid, simple, unambiguous
	- Meaning unambiguous
	- You can only talk about algorithms
## Why do we have multiple programming languages?
- Most languages are equally capable of expressing a given algorithm
- If all languages are equally expressive, then why have more than one?
- Emphasis: the features of a language affect how you approach a problem
	- e.g., recursion vs loops
- East of use: not all features are equally convenient to use
	- e.g., languages can be designed to make certain mistakes difficult or impossible
## What are Paradigms?
- Ways of looking at a problem and seeing a program
- Example: printing a "large X" of size n
```
X		X
  X   X
  	X
  X	  X
X	    X
```
We could recursively loop each circle until we get to the terminal case. Or, we could just print line by line
### Procedural Paradigm
- Programs are sequences of state-changing actions
- Manipulate an abstract machine with:
	- Variables naming memory locations
	- Arithmetic and logical operations
	- Assignment operations
	- Explicit control flow statements
- Key operations: Assign, Call, Go To, Go To If 0
	- If, While, etc.
- Example: Calculate $$f(n) = \sum_{i=0}^ni^2$$
- Pseudo-BASIC:
```BASIC
10 $SUM = 0
20 $K = 1
30 GOTO 60
40 $SUM = $SUM + $K * $K
50 $K = $K + 1
60 IF $K < $N GOTO 40
```
- C (and friends)
```c
int sum = 0;
for(int i = 0; i < n; i++) {
	sum += i * i;
}
```

- Closely matches the Von Neumann architecture
	- Program performs calculations based on data stored in memory
	- Results written to memory for later use
- Can be too low-level
	- Always specifies a sequence of operations
	- Difficult to reorder or parallelize for efficiency
	- Can be hard to get a high-level view of code
	- Unexpected interactions between unrelated code

### Functional Paradigm
- Programs are compositions of functions and data
- Characteristics (for "pure" functional programs):
	- Variable name values, not memory locations
	- Value binding through parameter passing
	- Recursion rather than iteration
- Key Operations: Function Application and Function Abstraction
	- Based on the Lambda calculus
- Example: Calculate $$f(n) = \sum_{i=0}^{n}i^2$$
$$f(n) = \begin{cases} 0 \ \ \ if x = 0 \\ n^2 + f(n-1) \ \ \ if x > 0 \end{cases}$$
- [[Haskell]]:
```hs
f 0 = 0
f n = n^2 + f (n-1)
```
- Also [[Haskell]]:
```hs
f n = sum [ i^2 | i <- [1..n]]
```

- Many different definitions over the years
	- Composition of functions
	- First-class functions
	- Pure functions
	- Pure and total functions
- More declarative than procedural programming
	- Describe what the answer is, not how to compute it
	- Highly modular
	- Can require sophisticated compilers for good performance
- But how do you deal with things that aren't functions (e.g., keyboard input)?

### Logic Paradigm
- Programs are formal logic specifications of the problem
- Characteristics (for "pure" logical programs):
	- Programs say what properties the solution must have, not how to find it
	- Solutions are obtained through theorem-proving
- Key Operations: Unification and Non-Deterministic Search
	- Based on first-order predicate logic
- Example: Calculate $$f(n) = \sum_{i=0}^ni^2$$
- [[Prolog]]:
```prolog
sumx2(0,0).
sumx2(N, Sum) :-
	N #> 0,
	M #= N - 1,
	sumx2(M, R),
	Sum #= R + N^2.
```
- Queries and results:
```prolog
?- sumx2(1,1).
yes
?- sumx2(2,2).
no
?- sumx2(4,S).
S = 30
```

- Among the most declarative paradigms
	- Just say what the answer is, and get it!
	- ...expect it isn't quite that easy
- Compiler (or solver) can have great freedom to choose methods for finding answers
	- Not always obvious what is happening

## Summary
- At the risk of over-simplifying
	- Procedural programming: describe steps to take to obtain the answer
	- Functional programming: define the answer
	- [[Logic Programming]]: define what it means for an answer to be correct
- These are *styles*, not absolute choices
	- The design of a language will make some styles easier than others
	- Ultimately, the compiler will translate your program into procedural machine language
### Why learn more than one programming language?
- Each language encourages thinking about a problem in a different way
- Each language provides slightly different expressiveness and efficiency
- The language should match the problem
### Other considerations
- Programs can be written by
	- One person
	- A small group (2-5)
	- A very large group (e.g., 10,000 people on the Linux kernel)
- Programs can be used by
	- One person, once
	- Many people, many times
- Programs can be
	- A few lines
	- A few hundred lines
	- Millions of lines
### Size Matters
- As the scale goes up, complexity goes up
- Need new tools
	- Debuggers
	- Version control
- Need new language features
	- Block-structured naming
	- Multiple file programs