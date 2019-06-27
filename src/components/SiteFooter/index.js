import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {getProp } from '../../helpers'
import Image from "../Image";

export default () => {
  const data = useStaticQuery(
    graphql`
        query {
          footer: blockContentFooter {
            footer_text {
                processed
              }
            footer_link {
              uri
              title
            }
            relationships {
              footer_logo {
                localFile {
                  childImageSharp {
                    fluid {
                      src
                    }
                  }
                }
              }
            }
          }                 
        }
      `
  )
  return (
    <div className="site-footer">
      <div className="container">
        <div className="top">
          <div className="logo">
            <a href="/">
              <Image imgSrc={data.footer.relationships.footer_logo} altText="footer-logo"/>
            </a>
          </div>
          
          <div className="btn-wrap">
            <a href={data.footer.footer_link.uri.replace('internal:', '')} rel="noopener noreferrer" target="_blank" className="btn style-a">{data.footer.footer_link.title}</a>
          </div>

        </div>

        <div className="copy">
          {getProp(data, 'footer.footer_text.processed')}
        </div>
      </div>
    </div>
  )
}