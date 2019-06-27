import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {createCompObj} from "../../helpers";

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphParagrphColumnFieldColl {
            edges {
              node {                
                parent_id
                drupal_internal__id  
                
                field_simple_page_info_link {
                  uri
                  title
                   options {
                    alias_path
                  }
                }                
                field_simple_page_info_title_txt
                relationships {
                  field_paragrph_column_fc_img {
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
    links: 'field_simple_page_info_link',
    title: 'field_simple_page_info_title_txt',
    img: 'relationships.field_paragrph_column_fc_img',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  return (
    <>
      {component.isdData && component.isAllArrayHasValidProp &&

      <div className="images-wrap">
        <div className="row">

        {component.dataArr.map(({isProp, id, props: item}, i) => (

            <React.Fragment key={i}>

                { isProp &&

                  <>
                    <div className="col col-sm-6">
                      <div className="links-wrap" style={{backgroundImage: `url(${item.img.localFile.childImageSharp.fluid.src})`}}>
                        {item.title && <h2>{item.title}</h2>}

                          <div className="links" >
                            <ul>

                            {item.links.map((item, i) => (

                              <li key={i}>
                                <a href={item.options.alias_path}>
                                  {item.title}
                                </a>
                              </li>
                             ))}

                            </ul>
                          </div>

                       </div>
                    </div>
                  </>
                }

            </React.Fragment>
            ))

          }

        </div>
      </div>
      }

      {children}
    </>
  )
}