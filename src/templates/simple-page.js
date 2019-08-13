import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import { getProp } from '../helpers'
import SectionTop from "../components/SectionTop";
import SectionTitle from "../components/SectionTitle";
import ParagraphTwoImagesInColumns from "../components/ParagraphTwoImagesInColumns";
import ParagraphSimplePageInfo from "../components/ParagraphSimplePageInfo";
import ParagraphImageAndText from "../components/ParagraphImageAndText";
import ParagraphBasicContactsFieldColl from "../components/ParagraphBasicContactsFieldColl";
import ParagraphSimpleLogoFieldColl from "../components/ParagraphSimpleLogoFieldColl";
import ParagraphColumnsWithLinksList from "../components/ParagraphColumnsWithLinksList";
import InnerWrapper from "../components/InnerWrapper";
import BlockContentInfoBlock from "../components/BlockContentInfoBlock";
import BlockContentTeam from "../components/BlockContentTeam";
import NodeNews from "../components/allNodeNews";

export default ({data: {nodeSimplePage: page, nodeSimplePage: {fields: {drupalInternalNid: pageId}}}}) => {

  let {relationships: relPage} = page;
  let imgTop = relPage.field_basic_top_image;
  let breadcrumbs = relPage.field_basic_breadcrumbs_term;

  let bodyValue = getProp(page, 'body.value');

  return (
    <Layout nodeId={pageId}>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid} />
      <SectionTitle title={page.title} breadcrumbs={breadcrumbs} />

        <InnerWrapper>

          <div className="content-inner">

            <div className="inner-wrap">

              <ParagraphSimpleLogoFieldColl nodeId={pageId}/>
              <ParagraphColumnsWithLinksList nodeId={pageId}/>
              <ParagraphTwoImagesInColumns nodeId={pageId}/>

              {bodyValue &&
                <>
                  {bodyValue}
                  <hr/>
                </>
              }

              <ParagraphSimplePageInfo nodeId={pageId}/>
              <ParagraphImageAndText nodeId={pageId}/>
              <BlockContentTeam nodeId={pageId}/>

              {page.fields.slug === '/news' &&
                <div className='b-news'>
                  <div className="sidebar">

                  </div>
                  <div className="items-wrap">

                      <NodeNews nodeId='all' perPage={10} />

                  </div>

                </div>
              }

            </div>

            <ParagraphBasicContactsFieldColl nodeId={pageId}/>

          </div>

        </InnerWrapper>

      {page.fields.slug !== '/news' &&
        <BlockContentInfoBlock nodeId={pageId}/>
      }

    </Layout>
  )
}

export const query = graphql`  
  query($slug: String!) {
    nodeSimplePage(fields: { slug: { eq: $slug } }) {
      title
      body {
        value
      }
      fields {
        drupalInternalNid
        slug
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