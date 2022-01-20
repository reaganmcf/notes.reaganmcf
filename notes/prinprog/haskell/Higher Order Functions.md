## Functions that take Functions
- A higher-order function is parameterized by a function
	- An $(n+1)$-order function has a parameter that is an $n$-order function
- We have seen a few of these
	- `map :: (a -> b) -> [a] -> [b]`
	- `map` applies a function to each element of a list, returning the list of results
- Higher-order functions behave just like every other function
	- Functions are just values!

## Defining `map`
```hs
map :: (a -> b) -> [a] -> [b]
map f []	 = []
map f (a:as) = f a : map f as
```
- `map f` applied to an empty list is an empty list
- `map f` applied to a non-empty list returns a list
	- Containing `f` applied to the head
	- Followed by `map f` applied to the tail
- Note the parentheses!
	- Contrast with `a -> b -> [a] -> [b]`
		- This is the type of a function that takes 3 arguments

### Using `map`
```hs
  map square [1,2,3] 
= map square (1:2:3:[])
= square 1 : map square (2:3:[])
= square 1 : square 2 : map square (3:[])
= square 1 : square 2 : square 3 : map square []
= square 1 : square 2 : sqaure 3 : []
= 1 : 4 : 9 : []
= [1,4,9]
```

## Defining `zipWith`
```hs
zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
zipWith f (a:as) (b:bs) = f a b : zipWith f as bs
zipWith f _	     _		= []
```
- `zipWith f` applies `f` to corresponding elements of two lists and returns the list of results
	- If both lists are non-empty, it returns `f` applied to the heads followed by the result of zipping the tails
- Generalizes `zip`
	- `zip = zipWith (,)`

## Nested Functions
- We have several ways to define functions inside another function's definition
	- `let` and `where` variables, anonymous functions, operator sections
- Nested functions can use their outer function's local variables
	- This can cause problems in languages that permit mutation
	- In Haskell, variables are just names for values, so using a local variable just provides access to the (immutable) value

## Working with Functions
### Testing for Primes
```hs
prime n = all nonFactorN [2..n-1]
	where nonfactorN d = n `mod` d /= 0
```
- How can we check whether `n` is prime?
- A naive approach: check whether any number from 2 up to n-1 evenly divides n
- `[2..n-1]` includes every integer that is at least 2 but not more than `n-1`
- The local function `nonfactorN` is True for any number `d` such that n / d has a remainder
- Thus, we return True if none of the numbers between 2 and n-1 evenly divide n
- This is a technique called generate and test
- We can save some time with a different list
	- e.g., ```2 : [3, 5 .. n `div` 2]```
- Because Haskell is lazy, we can create the list per-element on demand
	- That is, this runs in constant space
	- This is essentially a for loop
- We probably should handle n <= specially

- Now that we have prime, we can use with `filter` to get all the prime numbers in a list
	- `filter prime [2,4,17,15,3,18]` -> `[2,17,3]`
- But what if want the composite (non-prime) numbers?
	- We could define `composite n = not (prime n)`
	- But this might result in many short functions with limited utility
- We can use *function composition* to combine `not` and `prime`
	- `filter (not . prime) [2,4,17,15,3,18]` -> `[4,15,18]`

## Function Composition
- Function composition creates a new function from two existing functions by sending the output of the right function to the left function
- For function `f` and `g`, `f . g` is a function that maps `x` to `f (g x)`
- The `.` is just a regular operator, not special syntax
- Three equivalent definitions:
	- `(f . g) x = f (g x)`
	- `(.) f g x = f (g x)`
	- `f . g = \x -> f (g x)`

## Example: Primes Again
- Recall that we defined a function `nonfactorN` to test whether a number divided n
- We could just use an anonymous function instead

```hs
prime n = all (\d -> n `mod` d /= 0)
	(2 : [3, 5 .. n `div` 2])

prime n = not $ any (\d -> n `mod` d == 0)
	(2 : [3, 5 .. n `div` 2])
```

## $\eta$-equivalence
- The principal of $\eta$-equivalence says that `(\x -> f x)` is the same as `f`
	- By this, we mean that they will always produce the same result
- Technically, `undefined` and `\x -> undefined x` are different, but only in terms of which programs terminate, not the results you get, so we will ignore that
- For all practical purposes, we consider these equivalent:
```hs
filter (\x -> even x) some_list
filter even some_list
```


## Composition
- We can simplify some programs using compositions
	- `filter (\x -> not (prime x)) some_list`
	- `filter (not . prime) some_list`
- Composition can save us the trouble of naming intermediate values and parameters
	- We can focus on the functions, rather than the values passing through the functions
- All one-argument functions can be expressed using composition, but this is only worth doing if it improves readability
	- Instead of ```\d -> n `mod` d /= 0```, we could write ```(/= 0) . (n `mod`)```
		- ... but is it an improvement?

## Composition and Laws
- We can also use composition to describe the properties our functions have
- For example, mapping two functions over a list is the same as mapping their composition
	- For all lists x, `map f (map g x)` = `map \y -> f (g y )) x`
	- For all lists x, `map f (map g x)` = `map (f . g) x`
	- `map f . map g` = `map (f . g)`
- Knowing this fact about `map` allows us to simplify our understanding of what our programs do (it may also allow us to simplify our programs)

## More Laws
- These rules hold for all lists x, y, and z, and all functions f and g
```hs
filter f . filter g 
-- is equivalent to
filter (\a -> f a && f b)

any f
-- is equivalent to
or . map f

all f
-- is equivalent to
and . map f

zip x y
-- is equivalent to
zipWith (,) x y

zipWith f x y
-- is equivalent to
map (\(a,b) -> f a b) (zip x y)

zip x (zip y z)
-- is equivalent to
map (\((a,b),c) -> (a,(b,c))) (zip (zip x y) z)
```

## Organizing Lists
- `sort` sorts a list according to the ordering of its elements
	- `sort [2,1,6,0]` -> `[0,1,2,6]`
- `sortBy` sorts a list using a supplied ordering 
	- The ordering function takes two list elements and returns an `Ordering`
	- `sort` = `sortBy compare`
	- `sortBy (\(a, _) (b,_) -> compare a b)` sorts a list of pairs by comparing their first elements
	- The ordering functions should defined a consistent total order
- `group` returns a list of lists containing consecutive equal elements in the argument list
	- `group [1,1,2,1,3,3]` -> `[[1,1], [2], [6,8], [7,9]]`
	- `groupBy (\a b -> even a == even b)`
- `group = groupBy (==)`
- `concat . group = id`

## Making Functions
- If you write a lot of comparison and equivalence functions, you will quickly realize that they are very similar
- Haskell provides functions that abstract over the similar parts
- `comparing` (in Data.Ord) creates a comparison function
	- Instead of `\x y -> compare (fst x) (fst y)`, write `comparing fst`
	- `comparing f x y = compare (f x) (f y)`
	- `sortBy (comparing fst) some_list_of_pairs`
	- `sortBy (comparing length) list_of_lists`

## Further Abstraction
- `on` (in Data.Function) is a further generalization
	- ```f `on` g = \x y -> f (g x) (g y)```
- When the first argument is `compare`, we get `comparing`
	- ```comparing f = compare `on` f```
- When the first argument is `(==)`, we can define an equivalence function
	- ```parity = (==) `on` even```
	- ```groupBy ((==) `on` even) [13, 5, 7, 16, 12, 9]``` -> `[[13,5,7], [16,12], [9]]`