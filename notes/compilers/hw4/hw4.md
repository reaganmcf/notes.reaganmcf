# Homework 4

Reagan McFarland
NETID - rpm141
March 28th, 2020

## Problem 1

### 1.1) Give parse trees for the sentences `(a,a)` and `((a,a),a)`

`(a,a)`:

![](https://i.gyazo.com/6b627e7f006b3f5f99909000340aaaac.png)

`((a,a),a)`:

![](https://i.gyazo.com/009caf610954416657e34e5e9c53f905.png)

### 1.2) Construct a leftmost and a rightmost derivation for the sentence `((a,a),a)`

Leftmost:

```
A -> (B) -> (B,A) -> ((B),A) -> ((B,A),A) -> ((A,A),A) -> ((a,A),A) -> ((a,a),A) -> ((a,a),a)
```

Rightmost:
```
A -> (B) -> (B,A) -> (B,a) -> -> ((B),a) -> ((B,A),a) -> ((B,a),a) -> ((A,a),a) -> ((a,a),a)
```
