# Formal Languages
- By _formal_, we mean a system where we manipulate symbols according to specified rules
- Formal language theory gives us a way to precisely decide whether strings are "valid", according to some specified criteria
- Formal language gives us several _formalisms_ for specifying language, and lets us characterize them by what sorts of languages they can describe
- Several of these formalisms are used for designing programs (e.g., language specifications, parts of compilers)
- But before we can do any of that, we need to define some concepts

## What Are We Talking About
- An _alphabet_ is a set of symbols
	- These can be anything: all that we require is that we can distinguish them somehow
	- For example: letters, characters, tokens, etc.
- A _string_ is a finite sequence of symbols
	- We can call a string containing symbols from an alphabet $\sum$ a $\sum$-string
	- Usually, we will leave the alphabet implicit
- A _language_ is a (possibly infinite) set of $\sum$-strings, for some alphabet $\sum$

## Languages
![](https://i.gyazo.com/b12fc585c6e4979859bfe80959e13040.png)

## What Can We Use This For?
- The fundamental question we want to answer is whether or not a particular string $S$ is part of a language $L$
- This is called _recognition_
- We can conceive of many possible languages
	- Syntactically correct programs, e-mail addresses, JPEG files, arithmetic expressions, equations, correct equations, correct equations with quantified variables, English sentences, copies of _Moby Dick_ with one character wrong
- The difficulty of recognizing strings in these languages varies

## Recognition Difficulty
- Some languages are trivial to recognize
	- The empty language contains no strings
	- The universal language contains all strings	
- Some languages are easy to recognize: Strings containing only 'a', repeated any number of times
- Some are hard: strings containing decimal notation of prime numbers
- Some are very hard: strings containing provable statements in first-order logic
- Some are undecidable: strings containing a computer program and an input, such that the program will terminate

## Specifying Languages
- A formally specified language unambiguously indicates which strings belong to the language
- Given such a description, we should be able to create a _recognizer_
	- A (computer) program that reads a string and says whether or not the string is part of the language
- How can we formally specify a language
	- Provide an exhaustive list of strings
	- Write a program
	- Use some _formalism_: [[Context-Free Grammars]], [[Regular Expressions]], finite [[Automata]], etc.

## Why Use a Formalism?
- We don't have time to exhaustively list an infinite set
- General programs can be difficult to analyze
- Using a formalism enables further analysis of the language itself
	- We can ask general questions of the language (e.g., does any string in the language contain 'x'?)
	- We can generate strings in the language (faster than enumerating and testing every string)
	- We can potentially describe how to extract information from a string
