import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {createCompObj} from "../../helpers";
import Image from "../Image";

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphSimpleLogoFieldColl {
            edges {
              node {
                parent_id
                drupal_internal__id               
                
                relationships {
                  field_logo_field_coll_image {
                    localFile {
                      childImageSharp {
                        fluid {
                          src
                        }
                      }
                    }            
                  }
                }
                field_logo_field_coll_link {
                  uri
                }                         
              }
            }
          }                           
        }
      `
  );

  //const component vars
  let component = {};
  let props = {
    img: 'relationships.field_logo_field_coll_image',
    url: 'field_logo_field_coll_link.uri',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  return (
    <>
      {component.isdData && component.isAllArrayHasValidProp &&
        <div className='logos-wrap'>

          {component.dataArr.map(({isProp, id, props: item}, i) => (

            <React.Fragment key={i}>

              { isProp &&

                <>

                  {/*component html start*/}

                  <div className="logo-item">

                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                      <Image imgSrc={item.img}/>
                    </a>

                  </div>

                  {/*component html end*/}

                </>

              }

            </React.Fragment>
          ))}

        </div>
      }

      {children}
    </>
  )
}