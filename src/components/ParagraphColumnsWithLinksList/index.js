import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {createCompObj} from "../../helpers";
import ParagraphParagrphColumnFieldColl from "../ParagraphParagrphColumnFieldColl"

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphColumnsWithLinksList {
            edges {
              node {                
                parent_id
                drupal_internal__id  
                
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

              <ParagraphParagrphColumnFieldColl nodeId={id}/>

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