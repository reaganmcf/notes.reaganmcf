## Sections
- [[Functions]]
- [[Evaluation]]
- [[Types]]
- [[Parametric Polymorphism]]
- [[Operators]]
- [[Qualified Polymorphism]]
- [[Higher Order Functions]]

## Parentheses
- Function application occurs when one subexpression immediately follows another
	- `sqrt 25` - no parentheses needed for simple terms
	- `mean 5 7` - no parentheses needed when applying a function returned from another function
- Function application has higher precedence than all operators
	- `square 4 + 5` is the same as `(square 4) + 5`
	- `mean (a - b) (c - d)` - use parentheses for non-simple arguments
	- `mean (sqrt 25) (sqrt (dist (0,0) (17,25)))`


## Order of Equations
- Variable patterns always succeed
- This means they may overlap with other patterns
- Overlapping patterns are fine, as long as their order is correct
	- More specific patterns come earlier
```hs
-- any order is fine
and True	True	= True
and True	False	= False
and False	True	= False
and False	False	= False

-- Must be in this order
and True	True	= True
and	p		q		= False
```

## The Wildcard Pattern
- A special pattern `_` always succeeds
	- Like a variable pattern that does not bind the argument
- Useful if some part of the input is unused
	- Signals to the reader that the input is deliberately ignored

```hs
and True	True	= True
and p 	 	q		= False

-- same as
and True	True	= True
and _		_		= False
```

### Quick Aside: Strictness
Definition A:
```hs
and True True = True
and True False = False
and False True = False
and False False = False
```

Definition B:
```hs
and True p = p
and False _ = False
```
- Are these definitions the same?
	- We can prove they will never disagree
- Note that definition A needs to evaluate both arguments to determine which equation to use
	- `and False (loop x)` diverges
- Definition B only needs to evaluate the first argument
	- `and False (loop x)` evaluates to `False`
- We say that definition A is more *strict* than definition B

## Guards
- Adding a guard to an equation lets us choose whether to use it even if the pattern matches
	- If the guard evaluates to `False`, we move to the next equation
- We can attach multiple guards to the same pattern
	- In that case, the first guard that evaluates to `True` wins
	- If no guards are true, we go to the next equation
```hs
-- note: `otherwise` is a constant equal to True
fizzbuzz n
	| mod n 15 == 0 = "fizzbuzz" 
	| mod n 3 == 0 = "fizz"      
	| mod n 5 == 0 = "buzz"      
	| otherwise    = show n      
```

## Case Statements
- Allows us to pattern matching within an expression	
	- Helpful when matching the result of a function
- Attempt to match expression between `case` and `of` using patterns
- Uses `->` instead of `=`
- Patterns may include guards
```hs
least []	= Nothing
least (x:xs) =
	case least xs of
		Nothing -> Just x
		Just y
			| x < y 	-> Just x
			| otherwise -> Just y
```

## Local Variables
- We can attach `where` to an equation to add local definitions
	- Variables bound in a where block are visible in the main definition, including guards
	- Definitions can refer to each other, or variables bound by the patterns
	- We can define local functions as well!
- The first line following the `where` establishes the minimum indentation level
- Each equation has a separate `where` block
```hs
fizzbuzz n
	| div3 && div5 = "fizzbuzz"
	| div3		   = "fizz"
	| div5		   = "buzz"
	| otherwise	   = show n
	where
	div3 = mod n 3 == 0
	div5 = mod n 5 == 0
```

### Example: Computing the Variance
- The variance of a list of numbers is the mean of the squared differences of each number from their mean
- We can use `where` to avoid recomputing the length and mean of the list
```hs
variance xs = sum (map sqdiff xs) / len
	where
	len		 = genericLength = xs
	mean	 = sum xs / len
	sqdiff x = (x - mean)^2
	
-- We could also leave the local function anon
variance xs =
		sum (map (\x -> (x - mean)^2) xs) / len
	where 
	len = genericLength xs
	mean = sum xs / xs
```

### Define Local Variables in an Expression
- we can use `let ... in` to define variables within an expression
	- Variables are defined between `let` and `in`
	- The expression after determines overall value
	- The variables are in scope within the definitions and the `in` expression
