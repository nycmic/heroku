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
import NodeNews from "../components/allNodeNews";

export default (props) => {
  let {location, data: {nodeSimplePage: page, nodeSimplePage: {fields: {drupalInternalNid: pageId}}}} = props;
 console.log(props)
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

          {page.fields.slug !== '/news' &&

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
          }

          {page.fields.slug === '/news' &&
          <>
            <NodeNews nodeId='all' perPage={4} location={location} pageItems={true}/>
          </>
          }

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
    query($slug: String!, $skip: Int!, $limit: Int!) {
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
        allNodeNews(
            sort: {order: DESC, fields: field_news_date},
            limit: $limit
            skip: $skip
        ) {
            edges {
                node {
                    title
                    body {
                        value
                    }
                    field_news_date(formatString: "MMMM DD, YYYY")
                    years: field_news_date(formatString: "YYYY")
                    path {
                        alias
                    }
                }
            }
        }
    }
`
