# NFA
> NFA: Non-Deterministic Finite [[Automata]]
- To define an NFA, we need to specify
	- An alphabet
	- A set of states
	- A starting state
	- For each state, zero or more states that can be reached without reading any input
	- For each state, zero or more states that can be reached without reading any input
		- These may be called _null_ or _epsilon_ transitions
	- For each combination of state and symbol, zero or more possible target states
		- That is, transition is a _relation_, not a function

## NFA Recognition
- Begin with the start state
- Repeat until a chosen action cannot be performed
	- Choose whether to read a symbol
	- If so, read a symbol, choose a transition, and update the current state
	- If not, choose a null transition and update the current state
- Check whether the current state is an accept state
- The NFA recognizes the string if _any_ sequence of choices ends in an accept state

## Nondeterministic Choice
![](https://i.gyazo.com/5d4dbea5c4d23280709151737351d1fc.png)

## Nondeterminism
- Nondeterminism is very important from a theoretical perspective
	- For example, it is the _N_ in NP
- Many aspects of software are nondeterministic (e.g., concurrency)
	- Instead of a program having a single behavior (for some input)
	- ... it may have a _set_ of possible behaviors
- For software correctness, we ask whether any behavior in the set is incorrect
- For formal languages, we ask whether any possible behavior leads to recognition

## Nondeterminism?
- Unfortunately, we cannot write nondeterministic programs that always make good choices (i.e., ones that don't lead to failure)
- Instead, we must use a deterministic program to model nondeterminism
	- Backtracking: always choose the first choice; if this leads to failure, return to the most recent choice with un-chosen alternatives and choose differently
		- A depth-first exploration of all possible behaviors
	- Maintain a set of possible current states, and obtain a new set by taking all possible transitions
		- A breadth-first exploration

## NFA = DFA
- We can model the behavior of an NFA by maintaining a _set_ of possible sates
- Initially, this is the start state and its _epsilon closure_
	- That is, every state that can be reached by taking null transitions
- For each symbol in the input, we take the union of the epsilon closures of every state we can reach by following a transition from a state in our current set
	- That is, we find every state we could reach after reading that symbol, starting form any of our starting points
- After reading the last input, we check whether our set contains any accept state

## Sets of States
![](https://i.gyazo.com/3d794576ec8a088c381f1f157fd3c64d.png)
 
![](https://i.gyazo.com/e8ff86f2583fdd1647a541778355e741.png)

## Why NFAs?
- A DFA is just an NFA that has no null transitions nad exactly one transition per state per symbol
- Given an NFA, we can construct a DFA that recognizes the same language
- It is easier to use a DFA for string recognition
	- No need to model nondeterminism
- It is easier to combine NFAs to make new NFAs
	- We can easily represent concatenation, choice, and repetition

## Regex to NFA
- We will show how to construct an NFA corresponding to a regular expression
	- Once we can do that, we will be able to construct a DFA from a regular expression - linear time recognition!
- To simplify the proof, we will work with NFAs that have the following restrictions
	- No transitions return to the start state
	- There is a single accept state with no outgoing transitions (even to itself)
- Note that this does not limit the languages we can describe: we can always add new start and end states and link to the old ones with null transitions

### Adding Start and End States

![](https://i.gyazo.com/ab0d6430dbc8f40a9bb7996f695f1628.png)

--- 

![](https://i.gyazo.com/0aeb1d6bc4ea75ec455c60f06df2999a.png)
- Every regex is atomic, or made of smaller regexes
- The atomic regexes become 2-state NFAs
	- The transition is for the symbol, or a null transition, or absent

### Combining NFAs
![](https://i.gyazo.com/5795a1b16631ee46a136b822f308866e.png)
- For each regex _R_, we find a corresponding NFA
- For _R|S_, we add new start and end states with null transitions to/from the start/end states of _R_ and _S_
- For _RS_, we identify the end state for _R_ with the start state for _S_
	- Note that the restrictions make it impossible to return to _R_ from _S_

#### Example: `ab|cd`
![](https://i.gyazo.com/6f059e288098845e186ae1db1c415360.png)

![](https://i.gyazo.com/32d3a5d0f27853c736d7471b41727b53.png)

![](https://i.gyazo.com/16dd04ba05d28dc68b5f7d210515e518.png)

## Kleene Star
![](https://i.gyazo.com/ca36df178ecf6fb70c56e9c11a9493bd.png)
- For _R*_, take the NFA for _R_, and null transitions between its start and end states, and add new start and end states
- For _R+_, to the same, without the null transition from the old start to the hold end

### Example: `(a+b)*`
![](https://i.gyazo.com/58bc67ac1c99f4367a77af0a4d94df3d.png)

![](https://i.gyazo.com/7e9087fdb897baa6c5606dc143b31a86.png)

![](https://i.gyazo.com/8f24f2de3405983e7c696f5e3e6cd315.png)

![](https://i.gyazo.com/633fb46c5e30ff11662a10419c8d902d.png)

![](https://i.gyazo.com/bd12b785c2539a9bc45658ea08b06e9d.png)