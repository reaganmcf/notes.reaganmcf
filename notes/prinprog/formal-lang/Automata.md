---
slug: "/prinprog/formallang/automata"
date: "2021-01-17"
title: "Formal Lang - Automata"
---

# Automata
- A simple system for recognizing strings in a language
	- Define a set of _states_, with one designated as the start state
	- For each state, give a set of _transitions_; one per symbol
	- Designate one or more states as _accept_ states
- Recognition process:
	- Begin at start state
	- FOr each symbol in a string, follow the transition from the current state to the next state
	- At the end of the string, check whether the final state is an accept state

## An Automation
![](https://i.gyazo.com/1ecba8ee6f2ca336a6a0dc3c67fbe37f.png)

- Two symbols {A, B}
- Four states
	- Arrow drawn to start state (1)
	- Double circle for accept states (2,3)
- Transitions labeled by symbols
	- Each state has exactly one transition for each symbol
- What strings are in this language?

---

- Exercise: What regular expression describes the same language as that automata?
- An automation recognizes a string in linear time
- This particular automation requires constant space (fixed-size integer to hold state number)
- We _only_ check whether the state is an accept state after consuming the final symbol in the string
	- Reaching an accept state in the middle of the string means nothing
- Contrast this with every method we have discussed for matching regular expressions

## Finite Automata
- All automata have a finite number of states
- Finite automata have no additional storage: the state number completely indicates the state of the automation
- There are more powerful classes of automata
	- _Push-down automata_ (e.g., LR parser) augment the state with a stack; transitions may push or pop data
	- _Turing machines_ are automata with an infinitely large "tape" used for storage

## Deterministic Finite Automata
![[DFA]]

## DFA vs Regex
- We can write a DFA and a regex for every regular language
- DFAs are great for recognizing strings
	- Linear time, constant space
- DFAs are not particularly easy to reason about
	- Characterizing strings in the language of a DFA can be challenging
- DFAs do not compose well
	- No obvious operations on DFAs correspond to concatenation or star

## DFA Operations
- A few operations are much easier to define for DFAs
- To find the _complement_ of a DFA, switch the accept status of every state
	- Make an implicit failure state an explicit accept state
	- The new DFA accepts every string the old DFA rejected
- For comparison, try finding regexes for the compliments of our earlier examples

## DFA Union
- Given two DFAs, make a DFA for the union of their languages
	- Every string accepted by one DFA is accepted by the union
- Solution: each state in the new DFA is a pair containing a state of both original DFAs
	- Each transition goes to the state indicated by the corresponding transitions in the originals
	- Each new state accepts if either component state accepts
	- Even if one machine reaches the failure state, the other still might succeed

## DFA Intersection
- Given two DFAs, we can make a DFA for the intersection of their languages
	- Start out the same way as with the union
	- A state in the new DFA accepts if both states in the original DFAs accepted
	- Now it's no longer to accept as soon as we reach a failure state in one DFA, so we can collapse all states involving a failure state into a single failure state

## Power and Minimal Definitions
- We will show that regexes and DFAs are equivalent in power
	- For any regex, we can construct a DFA for the same language, and vice versa
- We can construct DFAs that recognize the complement or intersection of languages recognized by other DFAs
- Since we can convert any DFA to a regular expression (made of choice, concatenation, and repetition)
	- We can convert these complement and intersection DFAs as well
	- They're just regular DFAs
- Thus, we don't "need" intersection or complement in regexes
