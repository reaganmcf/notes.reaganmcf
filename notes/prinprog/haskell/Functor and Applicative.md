## Generalizing Beyond IO
- The system we use to organize IO operations can be re-used more generally
- We can define our own types of "procedures" that provide their own effects
- We can write generic functions that work with any procedure type
- Typically, these procedure types will provide one or both of:
	- Different control flow (exceptions, nondeterminism, continuation capturing)
	- Implicit state (read and/or write)

### Examples
- For some procedure type `m`, an operation with input `a` and output `b` will have type `a -> m b`
	- For example., printing a question and reading the answer could have type `String -> IO String`
- We can use `Maybe` for procedures that might fail
	- Converting a string to an integer: `String -> Maybe Integer`
- We can use `State s` for operations that read and update an implicit state
	- `data State s a = State (s -> (a,s))`
	- Labeling a value and updating the next label: `a -> State Int (Int a)`
	
## Step 1: Functor
- A functor is a type constructor with a map-like function
- Many functors are container types, like lists and maps
- Procedure types are also functors
- `fmap :: (Functor m) => (a -> b) -> m a -> m b`
- `fmap f op` is an operation that will execute `op` and apply the function `f` to its result
	- If the result of `op` is `x`, then the result of `fmap f op` is `f x`

## Step 2: Applicative
- Applicative functors are functors that provide two additional operations
- Viewed as procedure types that are
	- A way to make a procedure that produces a specific value
	- A way to combine two procedures into a larger procedure
- `pure x` is a procedure that does nothing and produces `x`
- `liftA2 f op1 op2` is a procedure that performs `op1` followed by `op2`, and calls `f` with both results
	- If `op1`  produces `x` and `op2` produces `y`, `liftA2 f op1 op2` will produce `f x y`

### Example:
```hs
liftA2 :: (Applicative m) => (a -> b -> c) -> m a -> m b -> m c

-- Read two lines, returning a pair containing both
liftA2 (,) getLine getLine :: IO (String, String)

-- Read two lines, return their concatenation
liftA2 (++) getLine getLine :: IO String

-- Convert strings s1 and s2 to integers
-- return Just their sum if both conversions succeed,
-- or Nothing if they fail
liftA2 (+) (parseInt s1) (parseInt s2) :: Maybe Int
```

### Applicative
```hs
class (Functor m) => Applicative m where
	pure :: a -> m a
	(<*>) :: m (a -> b) -> m a -> m b
```
- `liftA2` is derived from a more primitive operation, `<*>`
- `a <*> b` performs `a`, then performs `b`, then applies the function produced by `a` to the value produced by `b`
	- `fmap f a = pure f <*> a`
	- `liftA2 f a b = fmap f a <*> b = pure f <*> a <*> b`
- When we write `a <*> b <*> c <*> d`, the operations will be sequenced left-to-right
	- What "sequenced" means may depend on the specific applicative functor

## Common Idioms
- We sometimes write `<$>` instead of fmap
	- `f <$> x = fmap f x`
- Then we can write `liftA2 f a b = f <$> a <*> b`
- Convenient when applying a function to the results of several operations
	- `Bin <$> makeL <*> makeX <*> makeR`
- No need to defined `liftA3`, `liftA4`, etc.

## Applicative-Generic Code
- We can write many interesting functions that are parameterized by an arbitrary applicative functor
- For example, _traversal_ functions apply function to every element of a structure, and them combine the resulting procedures to produce a new structure
	- Like `map` , but with effects
