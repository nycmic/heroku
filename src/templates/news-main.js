import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import SectionTop from "../components/SectionTop";
import SectionTitle from "../components/SectionTitle";
import InnerWrapper from "../components/InnerWrapper";
import NodeNews from "../components/allNodeNews";
import {consoleLog} from "../helpers"
import YearsTags from "../components/YearList";

export default (props) => {
  consoleLog(props , 'props');

  let {pageContext} = props;
  let {drupalInternalNid: pageId, currentPage, limit, numPages, slug, yearVar} = pageContext;
  let {location, data: {nodeNewsMain: page, yearsData}} = props;

  let year = yearVar.split('=')[1] && yearVar.split('=')[1] !== 'all' ? yearVar.split('=')[1] : "";

  let {relationships: relPage} = page;
  let imgTop = relPage.field_basic_top_image;
  let breadcrumbs = relPage.field_basic_breadcrumbs_term;

  return (
    <Layout nodeId={pageId}>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid}/>
      <SectionTitle title={page.title} breadcrumbs={breadcrumbs}/>

      <InnerWrapper>

        <div className="content-inner">
            <NodeNews
              nodeId='all'
              currentComponent={yearsData}
              numPages={numPages}
              currentPage={currentPage}
              perPage={limit}
              location={location}
              pageItems={true}
              slug={slug}
              yearVar={year}
            />
        </div>


        <div className="b-news">

          <div className="sidebar">
            <YearsTags />
          </div>

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
