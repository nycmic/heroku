import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import {getProp} from "../helpers";
import Image from "../components/Image";
import YearsTags from "../components/NewsYearTag";
import NewsInputSearch from "../components/NewsInputSearch";

export default ({data: {nodeNews: page}}) => {
  let imgContentData = page.relationships.field_news_content_image;
  let bodyValue = getProp(page, 'body.value');

  return (
    <Layout>
      <div className="inner-wrapper">

        <div className="content-wrapper container">

          <div className="content-inner">

            <div className="b-news">

              <div className="sidebar">
                <NewsInputSearch
                  handleSearch={(term) => {
                    window.history.pushState(null, null, '/news/?search=' + term);
                    window.location.reload();
                  }}
                />
               <YearsTags />
              </div>

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
                          <Image imgSrc={imgContentData} />
                        </div>
                      </div>
                    }

                    {bodyValue}
                  </div>

                  <a href="/news" className="read-more">Back to News</a>

                </div>

              </div>
            </div>


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
          ...ImgLocalFile
        }
      }
    }
  }
`