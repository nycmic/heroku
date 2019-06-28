import React from "react"
import {useStaticQuery, graphql} from "gatsby"
import { getProp} from "../../helpers";
import NodeTeamMember from "../AllNodeTeamMember";

const BlockContentTeam = ({children, nodeId}) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: blockContentTeam {            
            drupal_internal__id
            relationships {
              reference_page {
                drupal_internal__nid
              }                          
            }   
          }                           
        }
      `
  );

  //const component vars
  let pageId = getProp(data.comp, 'relationships.reference_page.drupal_internal__nid');
  let isPageHasBlock = String(pageId) === nodeId;

  return (
    <>
      {isPageHasBlock &&
        <NodeTeamMember nodeId='all' />
      }

      {children}
    </>
  )
}

export default BlockContentTeam;