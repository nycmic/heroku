import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {createCompObj} from "../../helpers";
import BgImage from "../BgImage"

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphHomeTopLinksFieldColl {
            edges {
              node {
                parent_id
                drupal_internal__id
              
                field_top_links_fc_link {
                  options {
                    alias_path
                    title
                  }
                }                
                relationships {
                  field_top_links_fc_image {
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
          }                          
        }
      `
  )

  let component = {};
  let props = {
    linkUrl: 'field_top_links_fc_link.options.alias_path',
    linkTitle: 'field_top_links_fc_link.options.title',
    img: 'relationships.field_top_links_fc_image',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  return (
    <>
      {component.isdData && component.isAllArrayHasValidProp &&

      <div className="b-nav-links">

        {component.dataArr.map(({isProp, id, props: item}, i) => (

            <React.Fragment key={i}>

                { isProp &&

                  <>
                    <a href={item.linkUrl} className="item" key={i}>
                       <BgImage imgSrc={item.img}/>
                       <span className="title" >
                        {item.linkTitle}
                      </span>
                    </a>
                  </>
                }

            </React.Fragment>
            ))

          }

        </div>
      }

      {children}
    </>
  )
}