import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import {getProp} from "../helpers";
import NodeNews from "../components/allNodeNews";

export default ({location, data: {nodeNews: page, yearsList}}) => {
  let imgContentData = page.relationships.field_news_content_image;
  let bodyValue = getProp(page, 'body.value');

  return (
    <Layout>
      <div className="inner-wrapper">

        <div className="content-wrapper container">

          <div className="content-inner">

            <NodeNews
              location={location}
              perPage={4}
              pageItems={false}
              yearsList={yearsList.group}
            >

              <div className="items">

                <div className="item">

                  <div className="title">

                    <div className="date">
                      {page.field_news_date}
                    </div>

                    <h4> {page.title}</h4>

                  </div>

                  <div className="text">
                    {imgContentData &&
                    <div className='img-wrap'>
                      <div className="img">
                        <img src={imgContentData.localFile.publicURL} alt=""/>
                      </div>
                    </div>
                    }
                    {bodyValue}

                  </div>

                  <a href="/news" className="read-more">Back to News</a>

                </div>

              </div>
            </NodeNews>

          </div>

        </div>

      </div>



    </Layout>
  )
}

export const query = graphql`  
  query($slug: String!) {
    nodeNews(fields: { slug: { eq: $slug } }) {
      field_news_date(formatString: "MMMM DD, YYYY")
      title  
      body {
        value      
      }         
      relationships {
        field_news_content_image {                   
          localFile {
            publicURL
          }
        }
      }
    }
    yearsList: allNodeNews {
      group(field: fields___dateYear) {
        fieldValue
        totalCount
      }
    }
  }
`