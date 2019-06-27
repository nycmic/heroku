import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
        query {
           topMenuLink: allMenuLinkContentMenuLinkContent(filter: {menu_name: {eq: "menu-top-menu"}}) {
            edges {
              node {
                  title
                link {
                   options {
                    alias_path
                  }
                }
                menu_name 
              }
            }
          }                  
        }
      `
  )
  return (
    <div className="top-nav">

          <ul className="menu">
            {data.topMenuLink && data.topMenuLink.edges.map(({ node }, i) => (

              <li key={i}>
                <a href={node.link.options.alias_path}>
                   {node.title}
                </a>
              </li>

            ))}
          </ul>

      {children}
    </div>
  )
}