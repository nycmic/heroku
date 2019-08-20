import React, {useState, useEffect} from "react"
import {useStaticQuery, graphql} from "gatsby"
import {createCompObj, getPropSafe, htmlIn} from "../../helpers";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import SearchInput, {createFilter} from 'react-search-input'

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

  let currentPage = undefined;
  let currentComponentData = component.dataArr;

  function createArrForYears() {
    component.dataObjYears = {};
    component.dataArrTagsYears = [];

    component.dataArr.forEach((item, i) => {

      if (item.props.years) {

        if (!component.dataObjYears[item.props.years]) {
          component.dataObjYears[item.props.years] = [];
        }

        component.dataArrTagsYears.push(item.props.years);
        component.dataObjYears[item.props.years].push(item);
      }
    });

    component.dataArrTagsYears = _.sortedUniq(component.dataArrTagsYears);
  }
  function checkSearchLocation() {
    if (location.search) {

      let search = location.search.replace('?', '');
      let searchObj = {};

      let searchArr = search.split('&');

      searchArr.forEach((item) => {
        let itemArr = item.split('=');
        searchObj[itemArr[0]] = itemArr[1];
      });

      currentPage = searchObj.page ? +searchObj.page - 1 : undefined;
      currentComponentData = searchObj.year ? component.dataObjYears[+searchObj.year] : component.dataArr;
    }
  }

  createArrForYears();
  checkSearchLocation();

  return (
    <BNews component={component} perPage={perPage} currentPage={currentPage} currentComponentData={currentComponentData}/>
  )
};

const BNews = ({component, perPage, currentPage, currentComponentData}) => {

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
                    moreRegExp: /\s*<!--\s*more\s*-->/i,  // Search for the slug
                    stripTags: true, // Set to false to get html code
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

  //states
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [curData, setCurData] = useState(currentComponentData);
  const [componentData, setComponentData] = useState([]);
  const [forcePage, setForcePage] = useState(currentPage);
  const [firstRender, setFirstRender] = useState(true);
  // eslint-disable-next-line
  const [searchTerm, setSearchTerm] = useState('');
  //endStates

  useEffect(() => {
    updateNewsItems();
  }, [offset]);

  useEffect(() => {

    if (firstRender) {
      setFirstRender(false);
    } else {
      updateNewsItems(true);
      setForcePage(0);
      setOffset(0);
    }

  }, [curData]);

  const KEYS_TO_FILTERS = ['props.title', 'props.desc'];
  let testArr = component.dataArr;

  const searchUpdated = term => {
    let testSearchArr = testArr.filter(createFilter(term, KEYS_TO_FILTERS));

    setSearchTerm(term);

    window.history.pushState(null, null, '?search=' + term);

    setCurData(testSearchArr);
  };

  function updateNewsItems(tag) {
    let curOffset = tag ? 0 : offset;
    let start = curOffset;
    let end = curOffset + perPage;

    setComponentData(curData.slice(start, end));
    setPageCount(Math.ceil(curData.length / perPage));
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

    console.log('afterSet');
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
        <div className="form form-search">
          <SearchInput className="search-input" onChange={searchUpdated}/>
        </div>
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
              hrefBuilder={() => {
                return '#';
              }}
            />
          </div>
        </div>
      </div>

    </div>
  )
}


export default NodeNews;