import React from 'react';
import NavBar from './../components/NavBar';
import { graphql } from 'gatsby';

export default function NoteTemplate({
  data
}) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  return (
    <div className="relative min-h-screen flex">
      <NavBar />

      <div className="flex-1 pl-20 pt-5">
        <p className="text-xl">{frontmatter.title}</p>
        <p className="text-xl">{frontmatter.date}</p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
  `;
