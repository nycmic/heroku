import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { htmlIn, getPropSafe } from '../../helpers'
import excerptHtml from "excerpt-html"

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
        query {
           recentNews: allNodeNews(sort: {fields: field_news_date, order: DESC}, limit: 2) {
            edges {
              node {
                field_news_date(formatString: "MMMM DD, YYYY")
                fields {
                  slug
                }
                body {
                  value
                }
                title
              }
            }
          }                  
        }
      `
  )

  return (
    <div className="b-news style-a">

         <h3>RECENT NEWS</h3>
            {data.recentNews && data.recentNews.edges.map(({ node }, i) => (

              <div key={i} className="item">
                <div className="title">
                  <div className="date">
                    {node.field_news_date}
                  </div>
                  <h4>
                    <a href={node.fields.slug}>{node.title}</a>
                  </h4>
                </div>

                <div className="teaser">

                  {console.log(node.body.value)}

                  {htmlIn(excerptHtml(getPropSafe(node, 'body.value'), {
                    moreRegExp:  /\s*<!--\s*more\s*-->/i,  // Search for the slug
                    stripTags:   true, // Set to false to get html code
                    pruneLength: 149, // Amount of characters that the excerpt should contain
                    pruneString: ' ', // Character that will be added to the pruned string
                    pruneSeparator: ' ', // Separator to be used to separate words
                  }))}
                </div>

                <div className="btn-wrap">
                  <a href={node.fields.slug} className="read-more">
                    read full story
                  </a>
                </div>

              </div>

            ))}

      {children}
    </div>
  )
}