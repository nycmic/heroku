import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "../Image";
import {createCompObj} from "../../helpers";

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphTwoImagesInColumns {
            edges {
              node {
                relationships {
                  field_columns_images {
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
    images: 'relationships.field_columns_images',
    border: 'field_print_border_line_checkbox',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  return (
    <>
      {component.isdData && component.isAllArrayHasValidProp &&

        component.dataArr.map(({isProp, id, props: item}, i) => (

        <React.Fragment key={i}>

          { isProp &&

            <>
              <div className="desc-text">
                {item.desc}
              </div>
              <div className="images-wrap">
                <div className="row">
                  {item.images && item.images.map((item, i) => (
                    <div className="col col-sm-6" key={i}>
                      <div className="img">
                        <Image imgSrc={item}/>
                      </div>
                    </div>
                   ))}
                </div>
              </div>

              {!!item.border.length &&
                <><hr/><br/></>
              }
            </>
          }

        </React.Fragment>
        ))

      }

      {children}
    </>
  )
}