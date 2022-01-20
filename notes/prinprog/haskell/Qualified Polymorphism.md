- We want a middle ground between monomorphic and polymorphic types
	- We don't want to write separate functions to add up the values of a list
	- But `sum :: [a] -> a` wouldn't be able to add values
- We can get away with passing the functions we need
	- `sumBy :: (a -> a -> a) -> a -> [a] -> a`
	- Passing an explicit add function and zero value gets tedious
- Idea: add *constraints* that type variables must satisfy
	- `sum :: (Num a) => [a] -> a`
	- `Num` is a *class* that provides several arithmetic functions
	- The type says that `a` must be an `instance` of `Num`
- This is essentially the same as passing all the required functions as arguments
	- But now the compiler is responsible for providing them, not us

## Classes Are Not Types
- A class is a constraint that a type must satisfy
	- We often say `type class`, to avoid confusing OO programmers
- The instances of a class are types, not values
	- I cannot make a list of `Num`, it must be a list of some specific type
- Two instances of a class are still distinct types
- E.g., `Int` and `Float` are both instances of `Num`, but I cannot mix `Int` and `Float` values in a list

## Defining Classes and Instances
```hs
class Eq a where
	(==) :: a -> a -> Bool
	(/=) :: a -> a -> Bool
	
	-- default definitions
	a == b = not (a /= b)
	a /= b = not (a == b)
```

Class with superclass constraint
```hs
class (Eq a) => Ord a where 
	(>) :: a -> a -> Bool
	(<) :: a -> a -> Bool
	-- etc...
```

Instance definition
```hs
instance Eq Color where
	Red   == Red   = True
	Blue  == Blue  = True
	Green == Green = True
	_	  == _	   = False
	
	-- use default for (/=)
```

Qualified instance
```hs
instance (Eq a) => Eq (Tree a) where
	Bin l1 x1 r1 == Bin l2 x2 r2 =
		x1 == x2 && l1 == l2 && r1 == r2
	Tip			 == Tip			 = False
	_			 ==	_			 = False
```

## Instances are Defined Separately
- Classes and instances are defined independently of types
	- You can add new instances to existing classes
	- You can create new classes and add existing types to them
- For certain classes, you can have the compiler write the instance for you
- `data Point = MkPoint Double Double deriving (Eq, Show)`

## Instances
- In Haskell, you can define instances, but you can't say they don't exist
	- If no instance is defined for some class and type, you are free to write one
- This can lead to some newcomer-unfriendly error messages
	- If I write `1 : 2`, I get a message saying that `[a]` is not an instance of `Num`
	- This is because `2 :: Num a => a`, the second argument to `:` must be a list, and list is not (yet) an instance of `Num`	
- The error messages from GHC can be long and occasionally off-base, but they often tell you exactly where the problem is - read them!

## Important Classes
- The standard library defines several important classes
	- `Eq`: `==`, `/=`
	- `Ord`: `<`, `>`, `<=`, `>=`, `compare`
	- `Show`: `show`
	- `Enum`: `succ`, `pred`, `enumFromTo`, (used for `[x..y]`)
	- `Bounded`: `maxBound`, `minBound`
	- `Num` (more on this later)
	- `Functor`, `Monad`, `Foldable`, etc. (more on these much later)
- None of these are built-in, but a few are assumed to exist

## Subclasses
- Classes can specify one or more superclasses
	- E.g., `Eq` is a superclass of `Ord`
	- If we have an instance of `Ord`, we can use `==` on its values
	- We say the `Ord` constraint implies the `Eq` constraint
	- If we define an instance of `Ord`, we must also define an instance of `Eq`
	
## Numbers and Casting
- There is no automatic type casting/promotion in Haskell
	- Instead, numeric literals are polymorphic
	- Integer literals are polymorphic over `Num`
	- Rational literals (with a decimal point) are polymorphic over `Fractional`
- `Fractional` is a subclass of `Num`
	- `[1, 2.5] :: (Fractional a) => [a]`

## Numeric Classes
- `Num`: `+`, `-`, `*`, `abs`, `fromInteger`
- `Integral`: `div`, `mod`, `toInteger`
- `Fractional`: `/`, `fromRational`
- `Real`: `toRational`
- `RealFrac`: `truncate`, `round`, `ceiling`, `floor`
- `Floating`: `pi`, `exp`, `sin`, `cos`
- `RealFloat`: `isNan`, `isInfinite`, `...`

### Haskell Numeric Types
![](https://i.gyazo.com/66aa1df3d82d3a79b22fca7041d72a58.png)

## Explicit Numeric Casting
- If you do need to convert number types
	- `fromInteger :: (Num a) => Integer -> a`
	- `fromRational :: (Fractional a) => Rational -> a`
	- `toInteger`, `toRational`, `fromIntegral`, etc.