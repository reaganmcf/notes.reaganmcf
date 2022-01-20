## Functions
### Defining a Function
```hs
square x = x * x
```

- We define functions and values in Haskell using the equal sign
	- The left side says what we are defining
	- The right side gives the definition
- Top-level definitions are in scope throughout the file (module)
	- Order does not matter
	- Definitions can be recursive/mutually recursive

### Applying a Function
- Function application in Haskell uses just a space between function and argument
	- Parentheses are not required
- Thus: `square 10` says apply `square` to argument `10`
	- We could write `square (10)` or `square(10)`, but the parentheses are redundant
	- We do need parentheses if the argument is a compound expression
		- `square (a + b)` (application is higher precedence than operators)
		- `square (square 10)` (application associates to the left)

### Function Parameters
- Note that the function type is `argument -> result`
- All functions in Haskell take exactly one argument
- But lots of interesting / useful functions have multiple parameters
- There are two ways to "fake" multiple parameters
- First, we can use tuples to bundle multiple values together
- Second, we can return a function that takes the second argument

### Returning Functions
- Instead of passing the arguments bundled together, we can return new functions that accept the remaining arguments
- Recall, we can rewrite `mean` from earlier like so:
	- `mean = \(x,y) -> (x + y) / 2`
- Instead, `mean` can be a function that takes `x` and returns another function
	- `mean = \x -> \y -> (x + y) / 2
	- `mean :: Float -> (Float -> Float)`
- The function arrow associates to the right, so we typically write
	- `mean :: Float -> Float -> Float`
	- The two inputs are to the left of arrows; the final value on the right
- Using pattern-matching, we simply add more patterns
	- `mean x y = (x + y) / 2`
	- `dist (a,b) (x,y) = sqrt ((a - x)^2 + (b - y)^2)`

### Using Returned Functions
- We call `mean` by applying it to two arguments
	- `mean 6 8` => `7`
	- `mean 6 8` => `(\y -> (6 + y)/2) 8` => `(6 + 8)/2` => `7`
- Application groups to the left
	- `mean a b` is the same as `(mean a) b`
	- `mean a` evaluates to the function `\y -> (a + y)/2`
	- `mean (a b)` evaluates to `\y -> (a b + y)/2`

### Anonymous Functions
- Have the form `\patterns -> expression`
	- We will see where these are useful later
- Using multiple patterns is the same as returning a function
	- `\x y -> (x + y)/2` is the same as `\x -> \y -> (x + y) / 2`
- Anonymous functions extend as far to the right as they can
	- `\x -> x * x 4` is the same as `\x -> (x * x 4)`
	- We probably wanted `(\x -> x * x) 4`
