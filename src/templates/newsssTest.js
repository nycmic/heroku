import React from "react"
import {Link, graphql} from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NewsssTest = ({data, pageContext}) => {

  const { group, index, pageCount } = pageContext
  const previousUrl = index - 1 === 1 ? '/' : (index - 1).toString()
  const nextUrl = (index + 1).toString()

  return (
    <Layout>
      <SEO title="news"/>
      <h1>news</h1>


      <h4>{pageCount} Pages</h4>

      {group.map(({ node }, i) => (
        <div key={i} className="blogListing">
          {/*<div className="date">{node.frontmatter.date}</div>*/}
          <Link className="blogUrl" to={node.fields.slug}>
            {node.fields.slug}
          </Link>
          {/*<div>{node.excerpt}</div>*/}
        </div>
      ))}
      <div className="previousLink">
        <a href={previousUrl}>Go to Previous Page</a>
        {/*<NavLink test={first} url={previousUrl} text="Go to Previous Page" />*/}
      </div>
      <div className="nextLink">
        <a href={nextUrl}>Go to Previous Page</a>
        {/*<NavLink test={last} url={nextUrl} text="Go to Next Page" />*/}
      </div>

      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <ul>
        {data.allNodeNews.edges.map(({node}) => (
          <li key={node.fields.slug}>
            <Link to={node.fields.slug}>{node.title}</Link>
          </li>
        ))}
      </ul>

    </Layout>

  )
}

export default NewsssTest

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