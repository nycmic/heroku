import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {createCompObj} from "../../helpers";

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphSimpleParLinkFieldColl {
            edges {
              node {
                parent_id
                drupal_internal__id               
                
                field_simple_file_link_title_txt          
                relationships {
                  field_simple_page_info_file {
                    localFile {
                      publicURL
                    }
                  }
                }                         
              }
            }
          }                           
        }
      `
  );

  let component = {};
  let props = {
    title: 'field_simple_file_link_title_txt',
    fileUrl: 'relationships.field_simple_page_info_file.localFile.publicURL',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  return (
    <>
      {component.isdData && component.isAllArrayHasValidProp &&

      component.dataArr.map(({isProp, id, props: item}, i) => (

          <React.Fragment key={i}>

            { isProp &&

              <>

                {/*component html start*/}

                <div className="btn-link-wrap">

                  <a href={item.fileUrl} target="_blank" className="btn-link" rel="noopener noreferrer">
                    {item.title}
                  </a>

                </div>

                {/*component html end*/}

              </>

            }

          </React.Fragment>
        ))

      }

      {children}
    </>
  )
}