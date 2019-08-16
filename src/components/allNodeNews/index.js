import React, { useState,useEffect} from "react"
import {useStaticQuery, graphql} from "gatsby"
import {createCompObj, getPropSafe, htmlIn} from "../../helpers";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';
import _ from 'lodash';

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

  const YearsTags = ({component}) => {
    return (
      <div className='archive'>
        <h5>SORT BY YEAR</h5>
        <div className="fblog-archive">
          <ul className="fblog-archive-list">
            {component.dataArrTagsYears.map((item, i) => (
              <li key={i}>
                <a href={'?year=' + item} data-years={item} className='link-dropdown' onClick={handleYearsClick}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    )
  }

  function sortByYear() {
    console.log('sortByYear');
    component.dataObjYears = {};
    component.dataArrTagsYears = [];

    component.dataArr.forEach((item, i)=> {

      if (item.props.years) {

        if (!component.dataObjYears[item.props.years]) {
          component.dataObjYears[item.props.years] = [];
        }

        component.dataArrTagsYears.push(item.props.years);
        component.dataObjYears[item.props.years].push(item);
      }
    });

    component.dataArrTagsYears = _.sortedUniq( component.dataArrTagsYears);
  }

  sortByYear();

  //checkSearchLocation
  let currentPage = undefined;
  let currentComponentData = component.dataArr;

  if (location.search)  {

    let search = location.search.replace('?', '');
    let searchObj = {};

    let searchArr = search.split('&');

    searchArr.forEach((item) => {
      let itemArr = item.split('=');
      searchObj[itemArr[0]] = itemArr[1];
    });

    currentPage = searchObj.page ? +searchObj.page - 1 : undefined;
    console.log(currentPage, 'currentPage');
    currentComponentData = searchObj.year ? component.dataObjYears[+searchObj.year] : component.dataArr;
  }

  //End checkSearchLocation

  //states
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [curData, setCurData] = useState(currentComponentData);
  const [componentData, setComponentData] = useState([]);
  const [forcePage, setForcePage] = useState(currentPage);
  const [firstRender, setFirstRender] = useState(true);
  //endStates

  useEffect(() => {
    updateNewsItems();
  }, [offset]);

  useEffect(() => {

    console.log(firstRender);

    if (firstRender) {
      setFirstRender(false);
    } else {
      updateNewsItems(true);
      setForcePage(0);
      setOffset(0);
    }

  }, [curData]);

  function updateNewsItems(tag) {
    let curOffset = tag ? 0 : offset;
    let start = curOffset;
    let end =  curOffset + perPage;

    console.log(start, end, tag, forcePage, 'start, end, tag, forcePage');

    setComponentData(curData.slice(start, end));
    setPageCount(Math.ceil(curData.length / perPage));

    console.log(Math.ceil(curData.length / perPage), 'ages');
  }

  const handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    let urlArr = window.location.search ? window.location.search.split('page=') : null;
    let urlSearch;

    if (urlArr) {

      if (urlArr[0] === '?') {
        urlSearch = '?page=' + (+(selected) + 1);
      } else {
        urlSearch = urlArr[0].replace('&', '') + '&page=' + (+(selected) + 1);
      }

    } else {
      urlSearch = '?page=' + (+(selected) + 1);
    }

    window.history.pushState(null, null, urlSearch);

    setForcePage(undefined);
    setOffset(offset);
  }

  const handleYearsClick = e => {
    e.preventDefault();

    let years = e.currentTarget.dataset.years;

    window.history.pushState(null, null, '?year=' + +years);

    setCurData(component.dataObjYears[+years]);
  }

  return (
    <div className='b-news'>
      <div className="sidebar">
        <YearsTags component={component}/>
      </div>

      <div className="items-wrap">
        <NewsItems component={componentData}/>

        <div className={`pager-wrapper page-counts-${pageCount}`}>
          <div className="item-list">
            <ReactPaginate
              forcePage={forcePage}
              initialPage={currentPage}
              //disableInitialCallback={true}
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
      </div>

    </div>
  )
};

export default NodeNews;