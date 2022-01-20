export type File = {
  slug: string
  title: string
}

export type Folder = {
  name: string
}

export const isFile = (value: File | Folder): value is File => {
  return "slug" in value
}

export const isFolder = (value: File | Folder): value is Folder => {
  return !("slug" in value)
}

export class TreeNode {
  value: File | Folder
  public readonly children: Array<TreeNode>

  constructor(value: File | Folder) {
    this.value = value
    this.children = []
  }

  getName(): string {
    let v = this.value
    if (isFile(v)) {
      return v.title
    } else {
      return v.name
    }
  }

  insert(node: TreeNode) {
    this.children.push(node)
  }

  getChildFolder(folderName: string): TreeNode | null {
    for (let child of this.children) {
      let value = child.value
      if (isFolder(value)) {
        if (value.name === folderName) {
          return child
        } else {
          // check recursively calling child
          let recursiveAttempt = child.getChildFolder(folderName)
          if (recursiveAttempt) return recursiveAttempt
        }
      }
    }

    return null
  }

  print() {
    let v = this.value
    if (isFile(v)) {
      console.log(`[FILE] ${v.title} - (${v.slug})`)
    } else {
      console.log(`[FOLDER] ${v.name}`)
    }
    console.group()
    this.children.forEach(child => child.print())
    console.groupEnd()
  }
}

export class DirTree {
  public readonly root: TreeNode

  constructor() {
    this.root = new TreeNode({ name: "root" })
  }

  addFile(file: File) {
    // break slug into components
    const [rootPart, ...restParts] = file.slug.split("/").slice(1)

    // [prinprog, haskell, evaluation]

    // get or insert prinprog
    // insert haskell on that node, setting that node to haskell
    // insert file evaluation on that node

    let curr: TreeNode = this.root.getChildFolder(rootPart)
    if (!curr) {
      curr = new TreeNode({ name: rootPart })
      this.root.insert(curr)
    }

    // Build out folders for the file. We ignore the last part because that is always a file
    restParts.slice(0, -1).map(subFolder => {
      // get child folder node
      let temp = curr.getChildFolder(subFolder)
      if (!temp) {
        temp = new TreeNode({ name: subFolder })
        curr.insert(temp)
      }

      curr = temp
    })

    // Finally, add the file to the last subfolder
    curr.insert(new TreeNode(file))
  }

  print() {
    this.root.print()
  }
}
