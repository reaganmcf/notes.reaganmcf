# Mode Annotations
- Ideally, every argument to a relation could be instantiated or uninstantiated
	- As we have seen, this does not always lead to good results
- Often, we need to state requirements for what sorts of arguments we can give - these are called _modes_ of the relation
- Modes are not part of Prolog itself; they are given in documentation as guidelines
- Common mode indicators:
	- `+` for arguments that must be instantiated (inputs)
	- `?` for arguments that can be partially instantiated (input/output)
	- `-` for arguments that can be partially instantiated (output)
- Thus, `tree(+Tree)`, because the argument to `tree/1` must be instantiated
- `height(+Tree, ?Height)`, because the height can be specified or unspecified, but the tree must be specified
	- `height/2` has a second mode, `height(?Tree, +Height)`, since it terminates universally if the height is specified
- `square(?X, ?Y)` because our definition of square terminates even when neither argument is instantiated

## Additional Modes
- Some relations, like tree/1, height/2, and length/2, only require an instantiated structure
	- `length([X, Y, Z], N)` terminates with N=3
- We sometimes use `++` for arguments that must be fully instantiated
	- E.g., `sum(++List, ?Total)`
## `?` vs `-`
- Both ? and - mark arguments that can be partially instantiated
	- This includes fully instantiated and uninstantiated arguments
- The difference between ? and - is intention, but it is subtle
- We can use -- to mark arguments that must be uninstantiated