## Reducing a list
- We have seen several functions that combine all the elements of a list using some function: `sum`, `product`, `and`, `or`
	- `sum [a,b,c,d]` -> `a + b + c +d`
	- `product [a,b,c,d]` -> `a * b * c * d`
- More precisely 
	- `sum (a : b : c : d : [])` -> `a + (b + (c + (d + 0)))`
	- Since `:` groups to the right, we are essentially replacing `:` and `[]` with a function and a base case
## Folding a list
- `foldr f z` maps a list to an expression that replaces `:` with `f` and `[]` with `z`
	- `sum = foldr (+) 0`
	- `product = foldr (*) 1`
	- `and = foldr (&&) True`
	- `concat = foldr (++) []`
- These examples are all associative functions with neutral elements, but this does not have to be the case
- `foldr f z` turns a list into some result value, where
	- `z` is the result value of an empty list
	- `f` returns a result, given some element of the list and the result from all the subsequent elements
	- E.g., the sum of an empty list is 0, the sum of a non-empty list is the head plus the sum of the tail
```hs
foldr f z []     = z
foldr f z (x:xs) = f x (foldr f z xs)
```

## `foldr :: ?`
- What type do we assign `foldr`?
	- `z` must have the same type as the final result
	- `f` must have two arguments and return the type of the result
		- The first is the type of the list of elements
		- The second is the type of the final result
	- Call the list element `a` and the result `b`
```hs
f :: a -> b -> b, z :: b
foldr :: (a -> b -> b) -> b -> a -> b
```

## A Conundrum
- `reverse` returns the elements of a list in reverse order
- If we reverse a list twice, we get the original list back
- So, do we have `reverse . reverse = id`?
- `reverse xs` is a list whose first element is the last element of `xs`
	- ...but what if `xs` is infinite? No last element!
- So `reverse . reverse = id` only for _finite_ lists

## Endless Folding
```hs
foldr f z []     = z
foldr f z (x:xs) = f x (foldr f z xs)

foldl f z []     = z
foldl f z (x:xs) = foldl f (f z x) xs
```
- Do we really have `foldr (:) [] = id`?
	- Yes; because `(:)` does not force evaluation of its arguments, we only examine the input list when demanded
- Note that the recursive call to `foldr` is an argument to `f`
	- If `f` does not force its argument to be evaluated, then we wait to evaluate the rest of the fold
- In contrast, the recursive call to `foldl` is the outer expression
	- Evaluating `foldl f z xs` examines the entire list before any calls to `f` are evaluated