## [[Parsing]] a Regex
![](https://i.gyazo.com/63035f854eeb4d16627a0ba6edf40c17.png)

## Our Regex AST
```haskell
data RE sym						-- sym is type of alphabet symbols
	= RSym sym					-- match single symbol
	| REps						-- match empty string
	| RZero						-- match nothing
	| RStar (RE sym)			-- 0+ repetition
	| RPlus (RE sym)			-- 1+ repetition
	| RSeq (RE sym) (RE sym)	-- concatenation
	| RAlt (RE sym) (RE sym)	-- choice
```

## Application: Matching
- We want to write a function that tests whether a string is part of the language described by a regular expression
	- If `sym` is our alphabet, then `[sym]` is a string
	- `RE sym` is a regular expression
- 
	```haskell
	match :: (Eq, sym) => RE sym -> [sym] -> Bool
	```
	- This will work for any symbol type, as long as we can test whether two symbols are equal
- How do we write match? Recursion!

### Base Cases
- We will have a default catch-all case that returns `False`, so we can focus on the cases that do match
- A single symbol matches if the string has length 1 and contains the same symbol
	- 
		```haskell
		match (RSym c) [s] = c == s
		```
- The empty string matches if the string is empty
	- 
		```haskell
		match REps [] = True
		```
-  `RZero` never matches, so we leaver it for the default case
-  A choice that matches if either alternative matches
	- 
		```haskell
		match (RAlt a b) str = match a str || match b str
		```
		
### Concatenation
- `RSeq a b` matches a string if I can split the string into two parts, where `a` matches the first part and `b` matches the second part
- How can we test this?
- Simple solution: find every way to split the string, and test whether any of the work
	- 
		```haskell
		match (RSeq a b) str =
			any (\(u,v) -> match a u && match b v) (splits str)
		```
- `splits` returns a list containing every way to split a string into two parts

#### Splitting Strings
- We need a function that returns every way to split a string into two parts
	- 
		```haskell
		splits :: [a] -> [([a],[a])]
		```
	- Return a list of pairs of strings
- The empty string can be split into two empty strings
	- 
		```haskell
		splits [] = [([],[])]
		```
- For non empty strings, we can get all the ways to split the tail and add the head to the first string, and then also return the case where the first string is empty
	- 
		```haskell
		splits (c:cs) = ([], c:cs) : map (\(u,v) -> (c:u,v)) (splits cs)
		```
---

- We're going to see several cases of the form `any _ (splits _)`, so let's define a helper function
	- 
		```haskell
		someSplit f g str =
			any (\(u,v) -> f u && g v) (splits str)
		```
- Thus:
	- 
		```haskell
		match (RSeq a b) str =
			someSplit (match a) (match b) str
		```
		
### Repetition
- `RStar a` matches a string if we can split the string into zero or more parts, and `a` matches each part
	- Equivalently, if we can split the string into two parts where `a` matches the first part and `RStar a` matches the second
- 
	```haskell
	match (RStar a) str = someSplit (match a) (match (RStar a)) str
	```
- But this definition has a problem
	- The first returned by splits will `([], str)`
	- If `a` matches `[]`g, then we will try to match `RSar a` with `str`
	- Our sub-question is the same as the original question -- infinite loop!
- How can we avoid this infinite loop?
- Require `a` to match at least one symbol when matching `RStar a`
	- This ensures that the recursive call gets smaller input
	- We could just drop the first result from `splits`
- Have a special case for matching an empty string
- Preventing `a` from matching empty substrings never prevents us from matching the larger string
- We'll put the logic for `RStar` in another function
	- 
		```haskell
		matchStar a [] = True
		matchStar a (c:cs) =
			someSplit (match a . (c:)) (matchStar a) cs
		```

## Putting it Together
```haskell
match :: (Eq sym) => RE sym -> [sym] -> Bool  
match (RSym s)   [c] = s == c  
match REps 		 [] 		= True  
match (RAlt a b) str = match a str || match b str  
match (RSeq a b) str = someSplit (match a) (match b) str  
match (RStar a)  str = matchStar a str  
match (RPlus a)  str = someSplit (match a) (matchStar a) str  
match _ 	     _   = False  

matchStar a []       = True  
matchStar a (c:cs)   = someSplit (match a . (c:)) (matchStar a) cs  

someSplit f g = any (\(u,v) -> f u && g v) . splits  

splits []     = [([],[])]  
splits (c:cs) = ([],c:cs) : map (\(u,v) -> (c:u,v)) (splits cs)
```

## Performance Problems
- This definition of `match` works, and is close enough to the formal definition that we can be confident it is correct
- But the performance isn't great
- If I try to match $a^*$ against a string containing 100 a's and then b, we will have to determine that all 101 ways to split the string won't work
	- Performance gets worse for $a^{**}$
- We will investigate alternative strategies

### Backtracking
- When matching `RSeq a b`, instead of trying every way to split the input, let `a` determine the possible splits and only test `b` in those cases
	- We need a function that returns a list of "leftover strings'"
	-  
		```haskell
		suffixes :: (Eq sym) => RE sym -> [sym] -> [[sym]]
		```
- Naturally, `suffixes` will be recursive
- To see whether `a` matches `str`, we will see if the list of leftovers from `suffixes a str` includes the empty string
	- `matchPrefix re = any null . suffixes re`

#### Repetition, again
- But we will run into a problem with `RStar a` again
- Briefly: if `a` matches the empty string, the one of the leftovers we get from prefix-matching `a`will be the original string
- We could add code to eliminate strings that are equal to the original string, but that imposes its own performance penalty
- Solution: also return a `Bool` indicating whether the prefix was empty
- 
	```haskell
	suffixes :: (Eq sym) => RE sym -> [sym] -> [(Bool, [sym])]
	```
- 	
	```haskell
	matchPRefix re = any (null . snd) . sufixes re
	```
---
- We will have a catch-all case that returns `[]` (no match)
- For `RSym s`, we match if the string is non-empty and the first symbol is equal to s, and the rest of the string is leftover
	-  
		```haskell
		suffixes (RSym s) (c:cs) | c == s = [(True, cs)]
		```
- We can always match an empty prefix
	- 
		```haskell
		suffixes REps str = [(False, str)]
		```
- For `RAlt a b`, we combine the possible solutions for a and b
	- 
		```haskell
		suffixes (RAlt a b) str = suffixes a str ++ suffixes b str
		```

### Concatenation
- For `RSeq a b`, we want to match b against the leftovers of a
- We have a few ways to write this, but list comprehensions are among the more readable
	- 
		 ```haskell
		 suffixes (RSeq a b) str = [ (p || q, v) |
		 	(p,u) <- suffixes a str,
			(q,v) <- suffixes b u]
		```
- `u` is part of `str` not matched by `a`; `v` is the part of `u` not matched by `b`
- `p` and `q` indicate whether `a` or `b` consumed any input

### Repetition
- `RStar a` matches `a` zero or more times
	- 
		```haskell
		suffixes (RStar a) str = (False, str) : [ (True, v) |
			(True, u) <- suffixes a str,
			(_, v) <- suffixes (RStar a) u]
		```
- The pattern `(True, u)` discards any suffixes resulting from an empty match against `a`, ensuring that the recursive call gets a smaller input
- We can write a case for `RPlus`, or just reuse the existing ones
	- 
		```haskell
		suffixes (RPlus a) str = suffixes (RSeq a (RStar a)) str
		```
		
### Performance
- Does `matchPrefix` perform better than match?
- It depends: `matchPrefix` is much faster than `match` for simple regular expressions like `abcd` or `(ab|cd)*`
	- The work needed to match $RS$ scales with the number of prefixes that match $R$, not the length of the string
- `matchPrefix` performs badly with more complicated expressions like $a^{**}$
	- The number of ways that $R$ can match a prefix of a string can be _exponential_ in the length of the string
		