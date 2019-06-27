import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {createCompObj} from "../../helpers";

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphBasicContactsFieldColl {
            edges {
              node {               
                parent_id
                field_basic_field_coll_title_txt
                field_basic_contacts_text {
                  value
                }
              }
            }
          }                           
        }
      `
  )

  //const component vars
  let component = {};
  let props = {
    desc: 'field_basic_contacts_text.value',
    title: 'field_basic_field_coll_title_txt',
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

                <div className="b-info">
                  {item.title &&
                    <h3>{item.title}</h3>
                  }
                  {item.desc}
                </div>
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