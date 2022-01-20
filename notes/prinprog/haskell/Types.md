## Types
- Haskell is **strongly** typed
	- Every expression and variable has a type
	- The compiler confirms that all expressions have the correct types
- Haskell uses *type inference*
	- Based on what functions you call, the compiler can figure out the types for nearly all variables and expressions on its own
	- The type inference algorithm produce the most general type that fits the expression (more on this when we discuss *polymorphism*)

### Type Signatures
```hs
square x = x * x

square :: Int -> Int
```
- The definition we gave for `square` has no explicit types
	- This is fine: the compiler will infer a (generalized) type
- We can explicitly give a type for `square` using a type signature
	- Signatures have the form `expression :: type`
		- For top-level signatures, the expression must be a name
	- Function types have the form `argument -> result`
- Top-level type signatures are recommended, but not required
	- Giving an explicit type can catch buggy definitions

## Tuples
- A *tuple* is an ordered sequence of values, possibly of different types
	- Syntax: parentheses and commas `(1, 2, "Buckle my shoe")`
- A tuple's type is parameterized by the types of each field
	- Syntax: parentheses with commas `(0, True) :: (Int, Bool)`
	- `(1, 2, 3) :: (Int, Int, Int)`
	- `() :: ()` - zero-length tuple, a.k.a "Unit"

### Using Tuples
- We can use `fst` and `snd` to obtain the fields of a pair (2-tuple)
	- `mean :: (Float, Float) -> Float`
	- `mean t = (fst t + snd t) / 2`
- We can use *pattern matching* to obtain the fields of general tuples
	- `mean (x, y) = (x + y) / 2`
- A tuple pattern can use any pattern to match its fields, including other tuples
	- `dist ((a,b), (x,y)) = sqrt ((a - x)^2 + (b - y)^2)`
## Data Types
- Haskell's Prelude module defines several useful data types
	- One is `Bool`, with two constructors `True` and `False`
- Data constructors can be used to create values of some type and as patterns
- Unlike variable patterns, constructor patterns can *fail*
	- For example, `True` does not match `False`
- If we provide multiple equations, we use the first one where the pattern succeeds
- For example, we can define a function `not` with the following definition
```hs
not True = False
not False = True
```
## Lists
- Lists are a traditionally important data type in functional languages
- Haskell lists have two constructors with special syntax
	- `[]` ("nil") is an empty list
	- `:` ("cons") combines an element and a list into a new list
- A list with three elements `1 : 2 : 3 : []`
	- `:` associates to the right, so that is the same as `1 : (2 : (3 : []))`
- More conveniently, `[1, 2, 3]` is the same as `1 : 2 : 3 : []`

### List Patterns
- Use pattern matching to get the contents of a list
```hs
empty [] = True
empty _ = False
```

- The pattern `x : xs` matches a non-empty list
	- binds `x` to the first element (the *head*)
	- binds `xs` to the list following x (the *tail*)
```hs
sum [] = 0
sum (x:xs) = x + sum xs
```

### A Bigger Example: `zip`
- `zip` is a function defined in the Prelude that pairs up corresponding elements of two lists
	- `zip [1,2] [3,4]` => `[(1,3), (2,4)]`
- How can we define it?
	- If the two lists are non-empty, the result list will be a tuple of the head items, recursively calling the rest of both lists

```hs
zip (x:xs) (y:ys) = (x,y) : zip xs xy
zip (x:xs) [] = []
zip [] (y:ys) = []
zip [] [] = []

-- A better definition
zip (x:xs) (y:ys) = (x,y) : zip xs xy
zip (_:_) [] = []
zip [] (_:_) = []
zip [] [] = []

-- An even better definition
zip (x:xs) (y:ys) = (xy) : zip xs xy
zip _ _ = []
```

### Generating a List
- Let's write a function that makes a list containing $n$ copies of something
- To make zero copies, we just return `[]`
	- `copies 0 _ = []`
- To make n copies, we return a list that starts with the element followed by $n-1$ copies
	- `copies n x = x : copies (n-1) x`
- Can you think of any problems with this definition?
	- Infinite recursion with $n < 0$
- We can use `if` to test whether the input is positive

Our final definition of copies is now
```hs
copies n x =
	if x < 1
		then []
		else x : copies (n - 1) x
		
-- Alternative: use guard condition
copies n x | n < 1 = []
copies n x = x : copies (n - 1) x
```

### Combining Lists
```hs
(++) :: [a] -> [a] -> [a]
[]	   ++ bs = bs
(a:as) ++ bs = a : (as ++ bs)

concat :: [[a]] -> [a]
concat [] 	  = []
concat (l:ls) = l ++ concat ls
```
- `++` groups to the right
- `++` is associative: `a ++ (b ++ c) = (a ++ b) ++ c`
	- But grouping to the right is more efficient
	- `++` does work proportional to the length of its left operand
- `concat` is to `++` and `[]` as `sum` is to `+` and `0`

### `++` vs `zip`
- `[1, 2, 3] ++ [4, 5, 6]` -> `[1,2,3,4,5,6]`
- `zip [1,2,3] [4,5,6]` -> `[(1,3),(2,5),(3,6)]`
- We can also 'multiply' lists by finding the Cartesian product
	- `cartprod [1,2] [3,4]` -> `[(1,3), (1,4), (2,3), (2,4)]`

### Transforming Lists
```hs
filter :: (a -> Bool) -> [a] -> [a]
filter p [] = []
filter p (a:as)
	| p a       = a : filter p as
	| otherwise = filter p as
```
- `filter` applies a function to every element of a list, and makes a new list containing those elements where the function returned True
	- `filter even [1..8]` -> `[2,4,6,8]`
	- `filter isPrime [2..15]` -> `[2,3,5,7,11,13]`
	
### Querying Lists
- We have seen `sum` and `product`
- `and` checks whether every element is True
- `or` checks whether any element is True
- `all` takes a function and a list, and returns whether the function returned True for every element
	- `all even [2,4,6]` -> `True`
	- `all even [2,3,4]` -> `False`
- `any` takes a function and a list, and returns whether the function returned True for any element
## Type Synonyms
- We can use *type* to introduce a new name for a type
	- `type String = [Char]`
	- `type Point = (Double, Double)`
- The synonym can be parameterized
	- `type TwoLists a = ([a], [a])`
	- `type Binary a = a -> a -> a`
- The synonyms can be used interchangeably with its definition
	- That is, this is only useful for documentation or to simplify a type

## Isomorphic Types
- We can use `newtype` to make a distinct type based on another type
	- `newtype CustomerId = MkCID String`
	- `CustomerID` has the same representation of as `String`, but it is considered a distinct type
	- `MkCID` is a _data_ constructor
		- We can treat it as a function from `String` to `CustomerID`
		- We can use it as a pattern to get the `String` from the `CustomerID`

### Example: Non-negative Integers
- Example: we want to store the ages of things
- We could use `Integer`, but we want to restrict some operations
	- We don't want negative ages
	- Some operations are nonsensical; e..g, adding or multiplying two ages
- Solution: create a new type and only provide the helpful features
	- `newtype Age = MkAge Integer`
	- For encapsulation, put the definition in a separate module and don't export the constructor (only create/manipulate Age using functions we provide)

### Example: Age Interface
```hs
module Age (Age, toAge, fromAge, ageDiff) where

newtype Age = MkAge Integer

toAge :: Integer -> Maybe Age
toAge n | n < 0		= Nothing
		| otherwise = Just (MkAge n)

fromAge :: Age -> Integer
fromAge (MkAge n) = n

ageDiff :: Age -> Age -> Integer
ageDiff (MkAge m) (MkAge n) = m - n
```

- Note module declaration and explicit export list
	- By default, everything is exported
	- Without a declaration, module is assumed to be `Main`
- Because `MkAge` is not exported, it is impossible for other code to create an invalid age
- After type checking, `Age` is treated as a synonym for `Integer` and `MkAge` is ignored

## Enumerated Types
- We can use data to create types with multiple data constructors
	- `data Color = Red | Green | Blue`
	- Note that data constructors always begin with a capital letter
	- Note the vertical bars between constructors
- The data constructors of an enumerated type can be used as constants and as patterns
- The constructors completely define the type (e.g., they are the only allowed values of the type)
- See also: `data Bool = False | True`

## Structure Types
- We can use `data` to create types with fields
	- `data Point = MkPoint Double Double`
	- The syntax can be a little confusing: this says that `MkPoint` has two fields, each of type `Double` (similar to how `newtype` works)
	- e.g., `MkPoint 0.0 1.5 :: Point`
	- `dist (MkPoint x y) = sqrt(x^2 + y^2)`
- This is how `Rational` and `Complex` are defined (both contain two numbers)

## Records
- If a structure has a lot of fields, it can be easier to refer them by name
- Record syntax lets us name the fields of a data constructor
	- `data Point = MkPoint { x :: Double, y :: Double }`
- When creating a record, we can give field names in any order or omit entirely
```hs
origin = MkPoint { x = 0, y = 0 }
origin = MkPoint 0 0
```

- We can include field names when pattern matching, or give fields in order
	- `dist (MkPoint { x = u, y = v }) = sqrt (u^2 + v^2)`
	- `dist (MkPoint u v) = sqrt (u^2 + v^2)`
- The field names can be used as functions that extract the field
	- `dist p = sqrt (x p ^ 2 + y p ^ 2)`
- Because field names can be used as functions, they cannot be shared by different types

## Algebraic Data Types
- In fact, we can use `data` to define types with multiple constructors that may have fields
- We can define recursive types
- We can use type variables to create parameterized types

```hs
data Student
	= RutgersStudent NetID RUID
	| ExternalStudent EMailAddr
	
data IntList
	= Nil
	| Cons Int IntList
	
data Maybe a
	= Nothing
	| Just a
```

### Example: Binary Trees
- A binary tree is either empty, or has a value at the root and two sub-trees
```hs
data IntTree = Tip | Bin IntTree Integer IntTree
data Tree a = Tip | Bin (Tree a) a (Tree a)
data Tree a = Tip | Bin { left :: Tree a, root :: a, right :: Tree a }

-- Example of binary tree
bst :: Integer -> Integer -> Tree Integer
bst lo hi | lo > hi = Tip
bst lo hi = Bin (bst lo (mid - 1)) mid (bst (mid+1) hi)
	where mid = div (lo + hi) 2
```

![](https://i.gyazo.com/3f219ab0f32fc0d506cc1be73ac4d16b.png)

## Data Constructors $\neq$ Types
- Note that data constructors for a type collectively determine its values
	- They are not like subclasses or subtypes
- Data constructors only occur in value expressions or patterns, not in types
- `Tip` and `Bin` both create values of `Tree a`, they are not their own types