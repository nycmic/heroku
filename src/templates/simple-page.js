import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import {getProp} from '../helpers'
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

const SimplePage = (props) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(props)
  }
  let {pageContext: {drupalInternalNid: pageId}} = props;
  let {data: {nodeSimplePage: page}} = props;
  let {relationships: relPage} = page;
  let imgTop = relPage.field_basic_top_image;
  let breadcrumbs = relPage.field_basic_breadcrumbs_term;


  let bodyValue = getProp(page, 'body.value');

  return (
    <Layout nodeId={pageId}>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid}/>
      <SectionTitle title={page.title} breadcrumbs={breadcrumbs}/>

      <InnerWrapper>

        <div className="content-inner">

          <div className='inner-wrap'>

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

          </div>

          <ParagraphBasicContactsFieldColl nodeId={pageId}/>

        </div>

      </InnerWrapper>

      <BlockContentInfoBlock nodeId={pageId}/>

    </Layout>
  )
}

export default SimplePage;

export const query = graphql`
   query($slug: String!) {
     nodeSimplePage(fields: { slug: { eq: $slug } }) {
       title
       body {
         value
       }
       relationships {
         field_basic_top_image {
           ...ImgLocalFile
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
