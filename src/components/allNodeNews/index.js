import React, { useState,useEffect} from "react"
import {useStaticQuery, graphql} from "gatsby"
import {createCompObj, getPropSafe, htmlIn} from "../../helpers";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';

const NodeNews = ({children, nodeId, perPage, location}) => {
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
                years: field_news_date(formatString: "YYYY")
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
    years: 'years'
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  const NewsItems = ({children, component}) => {
    return (
      <>
        {/*{component.isdData && component.isAllArrayHasValidProp &&*/}
        <div className="items">

          {component.map(({isProp, id, props: item}, i) => (

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
        {/*}*/}

        {children}
      </>
    )
  };

  //states
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [componentData, setComponentData] = useState([]);

  let currentPage = undefined;

  if (location.search && ~location.search.indexOf('?page=')) {
    currentPage = +location.search.replace('?page=', '') - 1;
  }
  //endStates

  useEffect(() => {
    updateNewsItems();
  }, [offset]);

  function updateNewsItems() {
    let start = offset;
    let end =  offset + perPage;

    console.log(component.dataArr.slice(start, end));

    setComponentData(component.dataArr.slice(start, end));
    setPageCount(Math.ceil(component.dataArr.length / perPage));
  }

   const handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);
    window.history.pushState(null, null, '?page=' + (+(selected) + 1));

    setOffset(offset);
  }

  return (
    <>
      <NewsItems component={componentData}/>

      <div className="pager-wrapper">
        <div className="item-list">
          <ReactPaginate
            initialPage={currentPage}
            previousLabel={'‹ previous'}
            nextLabel={'next ›'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pager'}
            subContainerClassName={'pages pagination'}
            activeClassName={'pager-current'}
            hrefBuilder={()=> {
              return '#';
            }}
          />
        </div>
      </div>

    </>
  )
};

export default NodeNews;