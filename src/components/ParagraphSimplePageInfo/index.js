import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {createCompObj} from "../../helpers";
import ParagraphSimpleParLinkFieldColl from "../ParagraphSimpleParLinkFieldColl"

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allParagraphSimplePageInfo {
            edges {
              node {
                parent_id
                drupal_internal__id               
                
                field_careers_body_title_text {
                  value
                }
                field_print_border_line_checkbox
                field_simple_page_info_title_txt                           
              }
            }
          }                           
        }
      `
  );

  let component = {};
  let props = {
    title: 'field_simple_page_info_title_txt',
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

                {/*component html start*/}

                {item.title && <h2> {item.title} </h2>}

                {item.desc}

                <ParagraphSimpleParLinkFieldColl nodeId={id}/>

                {item.border && !!item.border.length && <><hr/><br/></>}

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