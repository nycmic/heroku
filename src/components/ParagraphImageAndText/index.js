import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "../Image";
import {createCompObj} from "../../helpers";

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphImageAndText {
            edges {
              node {
                relationships {
                  field_simple_page_left_pargf_img {
                    localFile {
                      childImageSharp {
                        fluid {
                          ...GatsbyImageSharpFluid
                        }
                      }
                    }
                  }
                }
                parent_id
                field_careers_body_title_text {
                  value
                }
                field_print_border_line_checkbox
              }
            }
          }                           
        }
      `
  )

  let component = {};
  let props = {
    desc: 'field_careers_body_title_text.value',
    image: 'relationships.field_simple_page_left_pargf_img',
    border: 'field_print_border_line_checkbox',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  return (
    <>
      {component.isdData && component.isAllArrayHasValidProp &&
        <>
          {component.dataArr.map(({isProp, id, props: item}, i) => (

            <React.Fragment key={i}>

              { isProp &&
                <>
                  {/*component html start*/}
                      <div className="desc-img">
                        <div className="desc-text">
                          {item.desc}
                        </div>

                        <div className="img-wrap">
                          <Image imgSrc={item.image}/>
                        </div>
                      </div>

                      {item.border && !!item.border.length &&
                        <><hr/><br/></>
                      }
                    {/*component html end*/}
                </>
              }

            </React.Fragment>
          ))}

        </>
      }

      {children}
    </>
  )
}