import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import MainMenu from "../MainMenu";
import TopNav from "../TopNav";
import Image from "../Image";

export default () => {
  const data = useStaticQuery(
    graphql`
        query {
           logoSrc: blockContentSiteinfo {    
            relationships {
              logo {        
                localFile {
                  childImageSharp {
                    fluid {
                     ...GatsbyImageSharpFluid
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
    <div className="site-header">
      <div className="container">
        <div className="inner-wrap">
          <div className="logo">
            <a href="/">
              <Image imgSrc={data.logoSrc.relationships.logo} altText="logo"/>
            </a>
          </div>
          <TopNav />
          <MainMenu />
        </div>
      </div>
    </div>
  )
}