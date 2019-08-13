import React from "react"
import {useStaticQuery, graphql} from "gatsby"
import {createCompObj, getPropSafe, htmlIn} from "../../helpers";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';

const NodeNews = ({children, nodeId, perPage}) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allNodeNews(sort: {order: DESC, fields: field_news_date}) {
            edges {
              node {
                title
                body {
                    value
                }
                field_news_date(formatString: "MMMM DD, YYYY")
                path {
                    alias
                }                          
              }
            }
          }                           
        }
      `
  );

  //const component vars
  let component = {};
  let props = {
    title: 'title',
    desc: 'excerpt.body.value',
    date: 'field_news_date',
    path: 'path.alias',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  const NewsItems = ({children, component, start, end}) => {
    return (
      <>
        {component.isdData && component.isAllArrayHasValidProp &&
        <div className="items">

          {component.dataArr.slice(start, end).map(({isProp, id, props: item}, i) => (

            <div key={i} className="item">

              {isProp &&

              <>

                {/*component html start*/}

                <div className="title">
                  <div className="date">
                    {item.date}
                  </div>
                  <h4>
                    <a href={item.path}>{item.title}</a>
                  </h4>
                </div>

                <div className="teaser">

                  {htmlIn(excerptHtml(getPropSafe(item, 'desc'), {
                    moreRegExp:  /\s*<!--\s*more\s*-->/i,  // Search for the slug
                    stripTags:   true, // Set to false to get html code
                    pruneLength: 149, // Amount of characters that the excerpt should contain
                    pruneString: ' ', // Character that will be added to the pruned string
                    pruneSeparator: ' ', // Separator to be used to separate words
                  }))}
                </div>

                <div className="btn-wrap">
                  <a href={item.path} className="read-more">
                    read full story
                  </a>
                </div>


                {/*component html end*/}

              </>

              }

            </div>
          ))}

        </div>
        }

        {children}
      </>
    )
  };

  return (
    <>
      <NewsItems component={component} start={0} end={3} />
      {/*<ReactPaginate*/}
      {/*  initialPage={this.state.currentPage}*/}
      {/*  previousLabel={'previous'}*/}
      {/*  nextLabel={'next'}*/}
      {/*  breakLabel={'...'}*/}
      {/*  breakClassName={'break-me'}*/}
      {/*  pageCount={this.state.pageCount}*/}
      {/*  marginPagesDisplayed={2}*/}
      {/*  pageRangeDisplayed={5}*/}
      {/*  onPageChange={this.handlePageClick}*/}
      {/*  containerClassName={'pagination'}*/}
      {/*  subContainerClassName={'pages pagination'}*/}
      {/*  activeClassName={'active'}*/}
      {/*/>*/}
    </>
  )
};

export default NodeNews;