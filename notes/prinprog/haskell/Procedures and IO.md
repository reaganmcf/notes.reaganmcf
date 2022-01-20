## What about I/O?
- We have only talked about functions so far
- But how can we write programs that interact with the user or the computer
- We can do a lot by entering expressions into GHCi and looking at the output
- GHC itself is written in Haskell - how?

## The Problem of Impurity
- We can't write a function that prints a line to the terminal
	- What does it return?
	- If we don't examine the result, how do we ensure that it got printed?
	- How can we ensure that prints happen in a deterministic order?
- We can't write a function that reads a line from the keyboard
	- Its result depends on something other than its input
	- A function that never returns different values for the same input is not a function

## Handling Impurity
- Most functional languages cheat
	- They define "functions" that read or print that have side-effects
	- To have predictable behavior, they mandate that expressions are evaluated in a particular way
- Side-effects and lazy evaluation do not mix
	- Understanding _when_ something will be evaluated can be challenging
- Introducing side-effects prevents algebraic understanding of programs
	- In Haskell, we can rewrite `map f . map g` as `map (f . g)`, because we know they will produce the same answer
	- But if `f` and `g` have side-effects, this rewrite will change the order in which they occur!
- Instead of cheating, Haskell enforces a separation between computations that can and cannot have effects
- Function evaluation never has effects: only the result matters
- Computations with effects are represented as `IO` values, not functions
- For any type `a`, we can think of `op :: IO a` as an "IO procedure" that will produce a result of. type `a` when executed
- Executing an IO procedure may involve interacting with the outside world
	- Executing the same procedure multiple times may produce different results
- A complete Haskell program executes a single IO procedure: `main :: IO ()`

## Hello, World
```hs
main = putStrLn "Hello, world!"
```
- `purStrLn :: String -> IO ()`
	- When executed, prints its argument to standard output, followed by a new line
	- The value produced is always `()`, the only value of type `()`
- `()` is the "unit" type that carries no information
	- `IO ()` is essentially the type of a procedure that returns no value, like a void function in Java or C

## Building Procedures
- Haskell provides several procedures and functions that return procedures
	- `getLine :: IO String`
	- `putStr :: String -> IO ()`
- Haskell provides ways to combine smaller procedures to make longer procedures
- We can combine procedures sequentially using `>>`
	- `m1 >> m2` is a procedure that performs `m1` followed by `m2`
		- The result of `m1 >> m2` is the result of `m2`; the result of `m1` is discarded
	- `putStr "Hello, " >> putStrLn "World!"`

## More Procedures
- `pure x` is a procedure that produces `x` without any other effects
	- For historical reasons, there is also `return`, which does the same thing
- `sequence_` takes a list of procedures, its result will perform each procedure in sequence, discarding the results
	- `sequence_ [putStr "Hello, ", putStr "World!"]`
	- `sequence_ = foldr (>>) (pure ())`
- `mapM_` applies a function to each element of a list, then sequences the resulting list of procedures
	- `mapM_ putStr ["Hello", ", ", "World!"]`
	- `mapM_ f = sequence_ . map f`

## Using Results
- But what about `getLine :: IO String`? How can we actually get the string?
	- Function evaluation cannot execute a procedure, so there is no way for a function to get string using `getLine`
- We can use `>>=` to pass the result of a procedure to a function
- `m >>= f` gives us a procedure that:
	1. Executes `m` and obtains a result, `x`
	2. Evaluates `f x` to get another procedure
	3. Executes that procedure and returns the value it produces
- `getLine >>= \s -> putStrLn ("hello, " ++ s)`

## Function vs. Procedure
- `>>`, `>>=`, `sequence_`, `mapM_` are all regular functions
- The values they produce are "IO procedures"
- We use these to construct our program's `main` procedure
- Functions can manipulate procedures, but they cannot _execute_ them and obtain their results
- Executing a procedure usually involves evaluating functions
- We clearly separate the pure and impure parts of our program: the impure part depends on the pure part, but not the other way around

## Just `do` it
- We can use `>>` and `>>=` to build up longer procedures
- We can write these on multiple lines to make it more readable
- Haskell provides a special syntax for procedures, do blocks, which are rewritten internally to use `>>` and `>>=`

```hs
main =
	putStrLn "What is your name?" >>
	getLine						  >>= \name ->
	putStr "Hello, "			  >>
	putStrLn name
	
-- with do syntax

main = do
	putStrLn "What is your name?"
	name <- getLine
	putStr "Hello, "
	purStrLn name
```

## Statements
- `do` introduces a sequence of _statements_, which have one of these forms
- _expression_
	- Any expression whose type is a procedure can be a statement
- _pattern <- expression_
	- Matches _pattern_ against the result obtained by executing _statement_ (avoid patterns that can fail)
	- Any variable bound by _pattern_ will be available in subsequent statements
- `let` _pattern_ `=` _expression_
	- Matches _pattern_ against the result of the evaluating expression
	- Variables bound by _pattern_ are available in subsequent statements and in _expression_

### Examples
```hs
main = do
	putStrLn "What is your name?"
	name <- getLine
	let caps = map toUpper name
	putStr "Hello, "
	putStrLn caps
```

```hs
main = do
	putStrLn "What is your name?"
	name <- getLine
	if null name
		then do
			putStr "Try again: "
			main
		else do
			putStr "Hello, "
			putStrLn name
```

```hs
-- You can even make your own control constructs!
until p op = do
	r <- op
	if p r
		then pure r
		else until p op
		
main = do
	name <- until (not . null) $ do
		putStrLn "What is your name?"
		getLine
	putStr "Hello, "
	putStrLn name
```

## Returning Procedures
- We can write functions that take or return procedures
- `sequence xs` takes a list of procedures
	- It returns a procedure that executes each element in sequence, and produces a list of their results
- `mapM f xs` applies `f` to each element in `xs`, and then sequences their results
	- `mapM f = sequence . map f`
- Often, `fooM` is a variant of `foo` that works on procedures
- Often, `bar_` is a variant of `bar` that discards (or never generates) the result
- A procedure that prints a question and returns an answer
	
###  Example
```hs
main = do
	nums <- forM [1..5] $ \i -> do
		putStr "Enter integer #"
		print i
		readLn
	putStr "Total: "
	print (sum nums)
```
- `forM = flip mapM`, but it can make writing some loops more convenient
	- These are just regular functions, not built-in syntax!
- `print` and `readLn` are variants of `putStr` and `getLine` that use `show` and `read` to convert to/from strings
	- `read` and `readLn` do not handle errors gracefully and are not recommended for serious use

## Function vs Procedure
- `a -> b` -> function type: takes `a`, returns `b`
	- Functions are evaluated using substitution
	- Evaluation never has effects beyond producing the answer
- `IO b` -> IO procedure type: produces `b`
	- Procedures are executed by the run-time system
	- Procedure execution may have effects; the same procedure may produce different results each time it is executed
- `a -> IO b` -> a function returning a procedure
	- Sometimes called an "impure function", but that is not strictly accurate
	- Not actually special: just a combination of two existing ideas

## Is This Cheating?
- Haskell uses `IO` to separate pure and impure computations
	- Evaluating pure computations never has side effects
	- Executing an impure computation may have side effects or depend on an external environment
- Procedures like `getLine` and procedure-returning functions like `printStrLn` cannot be fully defined within Haskell
	- We can describe complex procedures within Haskell, but the actual execution will be performed by an impure run-time system
	- Can we call Haskell a complete programming language if it relies on external code?

### No Language Stands Alone
- All high-level programming languages will rely on a core of "primitive" functions/methods/subroutines that cannot be defined in the language
- Haskell relies on a run-time system (typically written in C) to handle the low-level execution of `IO` procedures
- But even the C standard library relies on architecture-specific assembly code to implement calls into the OS and other low-level operations
- And assembly language itself is limited to the operations provided by the CPU

