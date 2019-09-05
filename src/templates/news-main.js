import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import SectionTop from "../components/SectionTop";
import SectionTitle from "../components/SectionTitle";
import InnerWrapper from "../components/InnerWrapper";
import NodeNews from "../components/allNodeNews";
import {consoleLog} from "../helpers"
import SEO from "../components/seo";

export default (props) => {
  consoleLog(props, 'props');

  let {
    location,
  } = props;

  let {
    drupalInternalNid: pageId,
    currentPage: initPagPage,
    limit,
    numPages: initNumPages,
    slug,
    yearVar
  } = props.pageContext;

  let {
    nodeNewsMain: page,
    yearsData: initPagItems
  } = props.data;

  let {
    relationships: relPage
  } = page;

  let imgTop = relPage.field_basic_top_image;
  let breadcrumbs = relPage.field_basic_breadcrumbs_term;
  let year = yearVar.split('=')[1] && yearVar.split('=')[1] !== 'all' ? yearVar.split('=')[1] : "";

  return (
    <Layout nodeId={pageId}>
      <SEO bodyClass="page" title="Home"/>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid}/>
      <SectionTitle title={page.title} breadcrumbs={breadcrumbs}/>

      <InnerWrapper>

        <div className="content-inner">
          <NodeNews
            initPagItems={initPagItems}
            initNumPages={initNumPages}
            initPagPage={initPagPage}
            perPage={limit}
            location={location}
            slug={slug}
            yearVar={year}
          />

        </div>

      </InnerWrapper>

    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $skip: Int!, $limit: Int!, $yearVar: String!) {
    nodeNewsMain(fields: { slug: { eq: $slug } }) {
      title
      relationships {
        field_basic_top_image {
          ...ImgLocalFile
        }
      }
    }
    yearsData: allNodeNews(
      sort: {order: DESC, fields: field_news_date},
      filter: {fields: {dateYear: {in: [$yearVar]}}}
      limit: $limit
      skip: $skip
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
