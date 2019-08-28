import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import SectionTop from "../components/SectionTop";
import SectionTitle from "../components/SectionTitle";
import InnerWrapper from "../components/InnerWrapper";
import NodeNews from "../components/allNodeNews";

export default (props) => {
    console.log(props)
  let {location, data: {nodeNewsMain: page, nodeNewsMain: {fields: {drupalInternalNid: pageId}}}} = props;

  let {relationships: relPage} = page;
  let imgTop = relPage.field_basic_top_image;
  let breadcrumbs = relPage.field_basic_breadcrumbs_term;

  return (
    <Layout nodeId={pageId}>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid}/>
      <SectionTitle title={page.title} breadcrumbs={breadcrumbs}/>

      <InnerWrapper>

        <div className="content-inner">
            <NodeNews nodeId='all' perPage={4} location={location} pageItems={true}/>
        </div>

      </InnerWrapper>

    </Layout>
  )
}

export const query = graphql`
    query($slug: String!, $skip: Int!, $limit: Int!, $yearVar: String!) {
        nodeNewsMain(fields: { slug: { eq: $slug } }) {
            title         
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
                    fields {
                        dateYear
                    }
                    field_news_date(formatString: "MMMM DD, YYYY")
                    years: field_news_date(formatString: "YYYY")
                    path {
                        alias
                    }
                }
            }
        }
        yearsData: allNodeNews(
            sort: {order: DESC, fields: field_news_date},
            filter: {fields: {dateYear: {in: [$yearVar]}}}
        ) {
            totalCount
            edges {
                node {
                    title
                    body {
                        value
                    }
                    fields {
                        dateYear
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
