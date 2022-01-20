---
slug: "/prinprog/haskell/evaluation"
date: "2021-01-17"
title: "Haskell - Evaluation"
---

## Evaluation
### Evaluating Function Application
- If we have `square x = x * x`
	- How do we interpret `square 10`?
- Evaluation by substitution:
	- Replace application with function body, with argument substituted for parameter
	- `square 10` => `10 * 10` => `100`
	- `square 2 + 4` => `(square 2) + 4` => `(2 * 2) + 4` => `8`

### Lazy Evaluation
- What if our argument is more complicated?
	- `square (1 + 2)` or `square (square 10)`
- Haskell uses _lazy_ evaluation, so we evaluate the application before the argument
	- This means we never have to evaluate an argument if the function discards its parameter (we will see examples of this later)
- But `square (1 + 2)` => `(1 + 2) * (1 + 2)` is inefficient
	- Instead, Haskell waits until the first time the argument value is needed and then only evaluates it once
	- Instead of an expression tree, we have a graph

### Comparing Evaluation Orders
- Recall:
	- *Applicative order* evaluates the argument before the application
	- *Normal order* evaluates the application first
	- *Lazy evaluation* is an optimized form of normal order evaluation that avoids re-evaluating
- In the absence of side-effects, these never produce different results
	- ...but normal order terminates for more expressions


### Normal Order Termination
```hs
loop x = loop x

zero x = 0
```
- If we try to evaluate `loop x`, we get `loop x` again
	- There are always more applications to evaluate
	- Evaluation never reaches a *normal form*
	- We say that `loop x` diverges (never returns)
- Now consider `zero (loop x)`
	- In applicative order, we have to evaluate `loop x` first
	- But in normal order, we evaluate `zero` first and get a normal form (`0`) without ever needing to evaluate `loop x`

### Normal vs Applicative
- In the absence of side-effects:
	- Normal order and applicative order never give different results
	- Normal order terminates in more cases than applicative order
	- Lazy evaluation always has the sames result as normal order evaluation
- Therefore, we don't need to worry too much about how evaluation happens
	- If you evaluate an expression by hand, you will get the same result as your program

