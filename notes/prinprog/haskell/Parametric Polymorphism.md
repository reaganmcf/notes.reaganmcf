- Idea: Types can include *type* variables
	- Type variables always begin with a lower-case letter
	- Type variables are universally quantified and scope over a single signature
	- When we use a value/apply a function, the compiler chooses types for variables based on context
	- `[]` can be an empty list of any type: `1 : []` and `'a' : []`
- Values/functions with polymorphic types must behave uniformly no matter what types are chosen
	- Example: `id :: a -> a` cannot behave differently for `Int` and `Char`
## Substitution of Type Variables
- When we use polymorphic types, the compiler determines what types for each variable
	- Each type variable will be replaced with a specific type
	- Substitution is consistent within a signature
- Example: `foo :: a -> a -> a`
	- We can write `foo 'a' 'b'` (implicitly `a -> Char`)
	- Or, `foo 1 2` (implicitly `a -> Integer`)
	- Or, `\x -> foo x x` (`x` will have some type `b`, and then `a -> b`)
	- But not `foo 'a' False` (we can't have `a -> Char` and `a -> Bool` because `Char != Bool`)
- Each use of polymorphic values gets a separate substitution
	- Type variables with the same name in separate signatures are unrelated
	- Two uses of polymorphic value can have different substitutions
- Example `foo :: a -> a -> a, bar :: a -> a`
	- `(foo 1 2, bar 'a')` - We have `a -> Int` for `foo` and `a -> Char` for `bar`
	- `(bar 1, bar 'a')` - We have `a -> Int` and `a -> Char` for the first and second use of bar
	- `bar bar 'a'` - We have `a -> Char` for the second bar and `a -> Char -> Char` for the first

## Types are Clues
- A polymorphic type can say a lot about what the function can/cannot do
- Example: `id :: a -> a`
	- `id` gets a value of some type an returns a value of the same type
	- But it has no information about what the type is
	- All it can do is return the value it was given (or diverge)
- Example: `error :: String -> a`
	- `error` has to return a value of any requested type, without knowing what that type is
	- No such value exists, so all it can do is diverge

## Writing Polymorphic Functions
- When writing a polymorphic function, treat each type variable as unique type that has no operations
- All you can do with values of this type is discard then, pass them to polymorphic functions, or return them
	- We cannot tell whether two values of a parameter type are the same
	- We cannot tell whether two type parameters are the same
	- We *can* apply a value to a function, if we are given both and the types match up
