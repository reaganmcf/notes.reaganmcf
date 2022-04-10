# Midterm 2 Notes

## Derivation Practice

`x - 2 * y`

#### Rightmost derivation

- Goal => Expr
- => Expr - Term
- => Expr - Term * Factor
- => Expr - Term * id
- => Expr - Factor * id
- => Expr - number * id
- => Term - number * id
- => Factor - number * id
- => id - number * id

## Grammars

### LL(1)

S -> a S b | 𝛆

FIRST(aSb) = { a }
FIRST(𝛆) = { 𝛆 }

### Parsing `aaabbb` using table driven parser

- ([eof, S], aaabbb, aSb)
- ([eof, b, S, a], aaabbb, next input + pop)
- ([eof, b, S], aabbb, aSb)
- ([eof, b, b, S, a], aabbb, next input + pop)
- ([eof, b, b, S], abbb, aSb)
- ([eof, b, b, b, S, a], abbb, next input + pop)
- ([eof, b, b, b, S], bbb, 𝛆)
- ([eof, b, b, b], bbb, next input + pop)
- ([eof, b, b], bb, next input + pop)
- ([eof, b], b, next input + pop)
- ([eof], eof, accept)

### LR(1)

S' -> S
S -> a S b
   | c


