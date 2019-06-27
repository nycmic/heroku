import React from "react"
import { useStaticQuery, graphql } from "gatsby"
// import styles from './MainMenu.module.scss';
// import "../../styles.scss"

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
        query {
           allLink: allMenuLinkContentMenuLinkContent(filter: {menu_name: {eq: "main"}, fields: {parent_menu_id: {ne: null}}}) {
            edges {
              node {
                expanded
                title
                link {
                  options {
                    alias_path
                  }
                }
                menu_name
                fields {
                  parent_menu_id
                }
                drupal_id
              }
            }
          }
          firstLevel: allMenuLinkContentMenuLinkContent(filter: {menu_name: {eq: "main"}, fields: {parent_menu_id: {eq: null}}}) {
            edges {
              node {
                expanded
                title
                menu_name
                fields {
                  parent_menu_id
                }
                drupal_id
                link {
                  options {
                    alias_path
                  }
                }
              }
            }
          }          
        }
      `
  )
  return (
    <nav className="nav">
      <div className="menu-block-wrapper">
        <div className="main-menu-wrap">
          <ul>
            {data.firstLevel && data.firstLevel.edges.map(({ node, node:{drupal_id} }, i) => (

                <li key={i}>
                  <a href={node.link.options.alias_path}>
                     <span>
                        {node.title}
                     </span>
                  </a>
                  {node.expanded &&
                    <ul>
                      {data.allLink && data.allLink.edges.filter(({ node }) =>
                        {return drupal_id === node.fields.parent_menu_id} ).map(({ node }, i ) => (

                        <li key={i}>
                          <a href={node.link.options.alias_path}>
                           <span>
                              {node.title}
                           </span>
                          </a>
                        </li>

                      ))}
                    </ul>
                  }
                </li>

            ))}
          </ul>
        </div>
      </div>
      {children}
    </nav>
  )
}