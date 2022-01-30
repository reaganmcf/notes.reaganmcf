import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { GetMarkdownFilesQuery } from "./../../../graphql-types"
import TreeView from "react-treeview"
import { DirTree, isFile, TreeNode } from "./DirTree"
import TwitterLogo from "./../../assets/twitter.svg"

import "./../../styles/treeview.scss"
import "./../../styles/index.scss"
interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const allFiles = useStaticQuery<GetMarkdownFilesQuery>(query)
    .allMarkdownRemark.edges.map(item => item.node.frontmatter)
    .filter(item => item.slug && item.title)
    .filter(item => item.slug != "/")

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
      return (
        <div className="ml-4">
          <a key={slug} href={slug}>
            {title}
          </a>
        </div>
      )
    } else {
      let prettyName = node.getName().replace(/\-/g, " ")
      return (
        <TreeView
          treeViewClassName=""
          itemClassName="font-bold text-lg"
          key={node.getName()}
          children={node.children.map(innerChild => buildTree(innerChild))}
          nodeLabel={prettyName}
        />
      )
    }
  }

  return (
    <div className="bg-gray-light h-screen border-r-2 border-r-gray-dark">
      <div className="bg-white w-full pl-4 pt-10 pb-4 items-center shadow">
        <a href={"/"}>
          <p className="font-bold text-4xl">📝 Notes</p>
        </a>

        <div className="text-[#888888] text-sm mt-4 flex items-center">
          <img className="flex-none" src={TwitterLogo} />
          <p className="flex-grow ml-4">@reaganmcf_</p>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="ml-4"></div>

        {dirTree.root.children.map(child => buildTree(child))}
      </div>
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
