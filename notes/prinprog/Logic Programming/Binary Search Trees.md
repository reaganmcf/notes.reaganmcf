# BST in Prolog

## Recall: Height of a Tree
```prolog
height(tip, 0).
height(bin(L, _, R), H) :-
	H #> 0,
	H #= 1 + max(LH, RH),
	height(L, LH),
	height(R, RH).
```
- `height/2` is a relation between a binary tree and its height
	- The "/2" means it takes two arguments
- We can use height/2 in several different ways
	- Test whether a tree has a specific height
	- Find the height of a tree
	- Find trees with a particular height

---
## Rudimentary `bst/1`
```prolog
bst(tip).
bst(bin(L, X, R)) :-
	all_under(X, L),
	all_over(X, R),
	bst(L),
	bst(R).
	
all_under(B, tip).
all_under(B, bin(L, X, R)) :-
	X #< B,
	all_under(B, L),
	all_under(B, R).
	
all_over(B, tip).
all_over(B, bin(L, X, R)) :-
	X #> B,
	all_over(B, L),
	all_over(B, R).
```

- A _binary search tree_ is a binary tree where the value at each node is greater than all values in its left subtree and less than all values in its right subtree
	- For simplicity, we will talk about BSTs containing integers
- How can we design `bst/1`
- Direct translation of requirements
	- Effective, but inefficient

## `bst/3`
```prolog
bst(Lo, tip, Hi) :-
	Lo #< Hi.
bst(Lo, bin(L, X, R), Hi) :-
	bst(Lo, L, X),
	bst(X, R, Hi).
```

- Can we express our requirements differently?
- Consider this tree: `bin(_, X, bin(L, Y, _))`
	- We need to require that every element in L is less than X and greater than Y
- For interior nodes, we can use a helper predicate that combines the BST with a range restriction
- If we further require the upper bound > the lower bound, we can further reduce the number of comparisons
	- Assuming the tree is finite, we will eventually compare very node to its predecessor and successor (if any)

## Using `bst/3` for `bst/1`
```prolog
bst(T) :- bst(_, T, _).

bst(Lo, tip, Hi) :- 
	Lo #< Hi.
bst(Lo, bin(L, X, R), Hi) :-
	bst(Lo, L, X),
	bst(X, R, Hi).
```

- How do we use `bst/3` to define `bst/1`
- We could make a few helper relations for the cases where are bounded on one side
- But remember: **Prolog variables start out uninstantiated**
- 
	```prolog
	bst(Lo, bin(Bin(tip, 1, tip), 2, bin(tip, 4, tip)), Hi).
	Lo in inf..0, Hi in 5..sup.
	```