import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {getProp} from "../../helpers";
import ParagraphHomeTopLinksFieldColl from "../ParagraphHomeTopLinksFieldColl";

export default ({ children, nodeId }) => {
  const data = useStaticQuery(
    graphql`
        query {
           comp: blockContentInfoBlock {
             info
          }                  
        }
      `
  )
  let title = getProp(data, 'comp.info');
  return (
    <div className="section section-bottom">

      <div className="container">
        {title && <h3>{title}</h3>}

        <ParagraphHomeTopLinksFieldColl nodeId={nodeId}/>
        {children}
      </div>

    </div>
  )
}