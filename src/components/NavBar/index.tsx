import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { GetMarkdownFilesQuery } from "./../../../graphql-types"
import TreeView from "react-treeview"
import { DirTree, isFile, TreeNode } from "./DirTree"

import "./../../styles/treeview.scss"
import "./../../styles/index.scss"
interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const allFiles = useStaticQuery<GetMarkdownFilesQuery>(query)
    .allMarkdownRemark.edges.map(item => item.node.frontmatter)
    .filter(item => item.slug && item.title)

  const dirTree = new DirTree()
  allFiles.map(file =>
    dirTree.addFile({
      slug: file.slug!,
      title: file.title!,
    })
  )

  const buildTree = (node: TreeNode): any => {
    if (isFile(node.value)) {
      let { slug, title } = node.value
      let path =
        process.env.NODE_ENV === "production"
          ? `/notes.reaganmcf/${slug}`
          : slug
      return (
        <div>
          <a key={slug} href={path}>
            {title}
          </a>
        </div>
      )
    } else {
      return (
        <TreeView
          treeViewClassName=""
          itemClassName="font-bold text-lg"
          key={node.getName()}
          children={node.children.map(innerChild => buildTree(innerChild))}
          nodeLabel={node.getName()}
        />
      )
    }
  }

  return (
    <div className="bg-gray-light h-screen border-r-2 border-r-gray-dark">
      <div className="bg-white w-full pl-4 pt-10 pb-4 items-center shadow">
        <p className="font-bold text-4xl">📝 Notes</p>

        <div className="text-gray-dark text-sm mt-4">
          <p>@reaganmcf_</p>
        </div>
      </div>

      <div className="px-4 py-6">{buildTree(dirTree.root)}</div>
    </div>
  )
}

export default NavBar

const query = graphql`
  query GetMarkdownFiles {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            slug
            title
            date
          }
        }
      }
    }
  }
`
