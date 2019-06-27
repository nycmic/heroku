import React from "react"
import {Link, graphql} from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Newsss = ({data}) => (
  <Layout>
    <SEO title="news"/>
    <h1>news</h1>
    <ul>
      {data.allNodeNews.edges.map(({node}) => (
        <li key={node.fields.slug}>
          <Link to={node.fields.slug}>{node.title}</Link>
        </li>
      ))}
    </ul>

  </Layout>
)

export default Newsss

export const query = graphql`
  query {
    allNodeNews(limit: 1000) {
      edges {
        node {
          title
          fields {
            slug
          }
        }
      }
    }
  }
`