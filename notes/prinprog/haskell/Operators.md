- Operators are just functions with special syntax
	- Operator names are made of symbol characters: `~!@#$%^&*-=+\|:<>/?`
	- Names starting with `:` are reserved for data constructors
	- Operators are applied to two arguments and appear between them
	- Operators have precedence and associativity
- When we write `x + y * z`, we are applying `+` to `x` and `(y * z)`

## Using Operators
- We can apply an operator by writing its name between its arguments
	- `x + y`
- Operator *sections* allow us to partially apply an operator
	- `(x +)` is the same as `\y -> x + y`
	- `(+ y)` is the same as `\x -> x + y`
	- `(+)` is the same as `\x y -> x + y`
- Handy for use with higher-order functions: `map (+1) xs`
- It is common to write an operator in parentheses when we discuss it as a function

## Making Operators from Functions
- We can make any function with 2+ arguments into an operator by putting \` around its name
	- Instead of `div x y`, we can write ``` x `div` y```
- Note: this works for function names, not expressions in general
- We can even do sections! ```map (`div` 2) ints```

## Some Common Operators
![](https://i.gyazo.com/71b2bd71f9c11a6091c92da99528d56f.png)

## Defining New Operators
- Operator definitions look like function definitions, except the operator name occurs *after* the first pattern
- You must use a section when giving a type signature
- You may optionally declare a precedence level and whether the operator is left or right associative
```hs
(><) :: (Fractional a) => a -> a -> a
x >< y = (x + y) / 2

infixr 5 ><

(&&) :: Bool -> Bool -> Bool
True && True = True
_	 && _	 = False

infixr 3 &&