import React, { useRef } from "react"
import NavBar from "./../components/NavBar"
import HeaderBar from "./../components/HeaderBar"
import { graphql } from "gatsby"

export default function NoteTemplate({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen flex">
      <NavBar />

      <div className="flex-1 h-screen overflow-y-scroll" ref={containerRef}>
        <HeaderBar {...frontmatter} />
        <article
          className="prose prose-lg mx-auto mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`
