# DFA
> DFA: Deterministic Finite [[Automata]]
- A deterministic finite automation decides whether or not to accept a string
	- It begins in a specified state
	- For each symbol in the string, in order, it makes a transition to a new state
	- After reading each symbol, it checks whether it is in an accept state
- Each transition reads a symbol
- Each symbol in the input is read once

## Encoding a DFA
```haskell
data DFA state symbol = DFA
	{ alphabet :: [symbol]				   -- what symbols may ocur in a string
	, states   :: [state]				   -- list of possible states
	, start    :: state					   -- must be a member of the list of states
	, trans	   :: state -> symbol -> state -- return next state
	, accept   :: state -> Bool			   -- whether the state is an accept state
	}

recognize :: DFA state symbol -> [symbol] -> Bool
recognize dfa = accept dfa . foldl (trans dfa) (start dfa)
```

### Alternatives
- There are many ways to represent a DFA in Haskell
- We could permit early failure by using a different function type
	- 
		```haskell
		state -> symbol -> Maybe state
		```
- We could use `Data.Map.Map` instead of a function
	- 
		```haskell
		Map (state, symbol) state
		```
	- 
		```haskell
		Map state (Bool, Map symbol state)
		```
- More elaborate solutions are possible
	- 
		```haskell
		data State symbol = Node Bool (Map symbol (State symbol))
		```
	
## Adding Nondeterminism
- A DFA is deterministic because the input string _determines_ the final state
	- Given a state and a symbol, there is one possible transition
	- Each symbol in the input causes exactly one transition
- A nondeterministic finite automation ([[NFA]]) relaxes these conditions
	- Given a state and a symbol, there may be zero or more possible transitions
	- Certain transitions can be taken, or not, without consuming any symbols
	- Thus, the final state is _not_ uniquely determined by the input string
