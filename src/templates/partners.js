import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SectionTop from "../components/SectionTop/SectionTop";
import SectionTitle from "../components/SectionTitle";
import InnerWrapper from "../components/InnerWrapper";
import ParagraphBasicContactsFieldColl from "../components/ParagraphBasicContactsFieldColl";
import ParagraphPartnersProductsLinkFc from "../components/ParagraphPartnersProductsLinkFc";

export default ({data: {thisPage: page, thisPage: {fields: {drupalInternalNid: pageId}}}}) => {
  let imgTop = page.relationships.field_basic_top_image;
  let breadcrumbs = page.relationships.field_basic_breadcrumbs_term;

  return (
    <Layout>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid}/>
      <SectionTitle title={page.title} breadcrumbs={breadcrumbs}/>

      <InnerWrapper>
        <div className="content-inner">
          <div className="inner-wrap">
            <ParagraphPartnersProductsLinkFc nodeId={pageId}/>
            <ParagraphBasicContactsFieldColl nodeId={pageId}/>
          </div>
        </div>
      </InnerWrapper>
    </Layout>
  )
}

export const query = graphql`  
  query($slug: String!) {
    thisPage: nodePartners(fields: { slug: { eq: $slug } }) {
      title    
      fields {
        drupalInternalNid
      }       
      relationships {
        field_basic_top_image {
          localFile {           
            childImageSharp {
              fluid(maxWidth: 3000) {
                ...GatsbyImageSharpFluid
               }
             }
          }
        }
        field_basic_breadcrumbs_term {
          path {
            alias
          }
          name
        }
      } 
    }
  }
`