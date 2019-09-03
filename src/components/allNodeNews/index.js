import React, {useEffect, useState, useRef} from "react"
import {useStaticQuery, graphql} from "gatsby"
import {createCompObj, createDrupalApiObj, getPropSafe, htmlIn} from "../../helpers";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';
import SearchInput, {createFilter} from 'react-search-input'
import Moment from 'react-moment';

const NodeNews = ({
                    children,
                    currentComponent,
                    numPages,
                    currentPage,
                    perPage,
                    nodeId,
                    location,
                    pageItems,
                    slug,
                    yearVar,
                    yearsList
                  }) => {
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
  let currentComponentData = {};

  let props = {
    title: 'title',
    desc: 'excerpt.body.value',
    date: 'field_news_date',
    path: 'path.alias',
    years: 'years'
  };

  let yearsCounts = {};
  component.dataArrTagsYears = [];

  yearsList.forEach((item) => {
    let itemArr = item.fieldValue.split('=');
    yearsCounts[itemArr[1]] = item.totalCount;

    if (itemArr[1] && itemArr[1] !== 'all') {
      component.dataArrTagsYears.unshift(itemArr[1]);
    }
  });

  component = createCompObj(component, data.comp.edges, nodeId, props);

  if (pageItems) {
    currentComponentData = createCompObj(currentComponentData, currentComponent.edges, nodeId, props);
  }

  let currentSearch = '';

  function checkSearchLocation() {
    if (location.search) {

      let search = location.search.replace('?', '');
      let searchObj = {};

      let searchArr = search.split('&');

      searchArr.forEach((item) => {
        let itemArr = item.split('=');
        searchObj[itemArr[0]] = itemArr[1];
      });

      currentSearch = searchObj.search ? searchObj.search : currentSearch;
    }
  }
  checkSearchLocation();

  return (
    <BNews component={component}
           perPage={perPage}
           currentPage={currentPage}
           currentComponentData={currentComponentData}
           currentSearch={currentSearch}
           numPages={numPages}
           location={location}
           children={children}
           pageItems={pageItems}
           slug={slug}
           yearVar={yearVar}
           yearsCounts={yearsCounts}
    />
  )
};

const BNews = ({children, yearsCounts, component, numPages, perPage, currentPage, currentComponentData, currentSearch, pageItems, location ,slug, yearVar}) => {

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
                    {console.log(typeof item.date)}
                    {/*{item.date}*/}

                    <Moment format="MMMM DD, YYYY" date={item.date} />

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
                <a href={'/news/year-' + item} data-years={item}
                   className={'link-dropdown' + (item === pagination.years ? ' active' : '')} onClick={handleYearsClick}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    )
  };

  let initSearchTerm = currentSearch;

  //States
  const [pagination, setPagination] = useState(
    {
      forcePage: currentPage - 1,
      pageCount: numPages,
      curData: component.dataArr,
      componentData: currentComponentData.dataArr,
      years: yearVar ? yearVar : 'all'
    }
  );

  // eslint-disable-next-line
  const [inputVal, setInputVal] = useState(initSearchTerm);
  const myRef = useRef(null);
  const firstUpdate = useRef(true);
  const urlPathname = useRef({
    yearData: yearVar,
    slug: slug ? slug : '',
    year: yearVar ? `/year-${yearVar}` : '',
    page: currentPage && currentPage !== 1 ? `/page=${currentPage}` : '',
    createUrl: () => urlPathname.current.slug + urlPathname.current.year + urlPathname.current.page
  });
  //endStates

  const scrollToRef = (ref) => {
    window.scrollTo(0, ref.current.getBoundingClientRect().top + window.pageYOffset - 180);
  };

  useEffect(() => {

    if (initSearchTerm) {
      searchUpdated(initSearchTerm);
    }

  }, []);

  useEffect(() => {

    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (pageItems) {
      scrollToRef(myRef);
    }

  });

  const KEYS_TO_FILTERS = ['props.title', 'props.desc'];
  let arrForSearch = component.dataArr;

  const searchUpdated = term => {

    if (!term) return;

    if (!pageItems) {

      window.history.pushState(null, null, '/news/?search=' + term);
      window.location.reload();
    }

    let searchArr = arrForSearch.filter(createFilter(term, KEYS_TO_FILTERS));

    let offset = 0;
    let curDataTemp = searchArr;

    setInputVal(term);
    setPagination({
      forcePage: 0,
      componentData: curDataTemp.slice(offset, offset + perPage),
      pageCount: Math.ceil(curDataTemp.length / perPage),
      curData: curDataTemp,
      years: ''
    });

    urlPathname.current.page = '';
    urlPathname.current.year = '';

    let url = urlPathname.current.slug + urlPathname.current.year + urlPathname.current.page

    window.history.pushState(null, null, url + '?search=' + term);
  };

  const handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);
    let curDataTemp = pagination.curData;

    let yearsQL = urlPathname.current.yearData ? `filter[date_in_pager]=${urlPathname.current.yearData}&` : '';

    fetch(`https://decoupled.devstages.com/api/node/news?${yearsQL}page[offset]=${offset}&page[limit]=${perPage}&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`, {
      method:'get',
      headers : {
        Authorization : "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
      }
    })
      .then(response => response.json())
      .then(res => {
        let componentFetch = {};

        let props = {
          title: 'title',
          desc: 'excerpt.body.value',
          date: 'field_news_date',
          path: 'path.alias',
        };

        componentFetch = createDrupalApiObj(componentFetch, res.data, 'all', props);

        setPagination({
          forcePage: undefined,
          pageCount: Math.ceil(yearsCounts[pagination.years]/perPage),
          componentData: componentFetch.dataArr,
          curData: curDataTemp,
          years: pagination.years
        });

        urlPathname.current.page = selected ? `/page=${selected + 1}` : '';

        window.history.pushState(null, null, urlPathname.current.createUrl());
      })

      .catch(error => console.log(error));
  };

  const handleYearsClick = e => {
    if (!pageItems) return;

    e.preventDefault();

    let years = e.currentTarget.dataset.years;
    let offset = 0;

    let yearsQL = years ? `filter[date_in_pager]=${years}&` : '';

    setInputVal('');

    fetch(`https://decoupled.devstages.com/api/node/news?${yearsQL}&page[offset]=${offset}&page[limit]=${perPage}&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`, {
      method:'get',
      headers : {
        Authorization : "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
      }
    })
      .then(response => response.json())
      .then(res => {
        let componentFetch = {};

        let props = {
          title: 'title',
          desc: 'excerpt.body.value',
          date: 'field_news_date',
          path: 'path.alias',
        };

        componentFetch = createDrupalApiObj(componentFetch, res.data, 'all', props);

        setPagination({
          forcePage: 0,
          pageCount: Math.ceil(yearsCounts[years]/perPage),
          componentData: componentFetch.dataArr,
          years: years
        });

        urlPathname.current.yearData = years;
        urlPathname.current.page = '';
        urlPathname.current.year = `/year-${years}`;

        window.history.pushState(null, null, urlPathname.current.createUrl());
      })

      .catch(error => console.log(error));
  };

  return (
    <div className='b-news'>
      <aside className="sidebar">
        <div className="form form-search">
          <SearchInput placeholder={'Search News'} className="search-input" onChange={searchUpdated} value={inputVal}/>
        </div>
        <YearsTags component={component}/>
      </aside>

      {children}

      {pageItems &&
      <div className="items-wrap" ref={myRef}>
        <NewsItems component={pagination.componentData}/>

        {!pagination.pageCount &&
        <div>
          <h5 style={{textAlign: 'center', margin: '70px 0'}}>YOUR SEARCH YIELDED NO RESULTS</h5>
        </div>
        }

        <div className={`pager-wrapper page-counts-${pagination.pageCount}`}>
          <div className="item-list">
            <ReactPaginate
              forcePage={pagination.forcePage}
              initialPage={currentPage - 1}
              disableInitialCallback={true}
              previousLabel={'‹ previous'}
              nextLabel={'next ›'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pagination.pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pager'}
              subContainerClassName={'pages pagination'}
              activeClassName={'pager-current'}
              hrefBuilder={(i) => {
                let page = i - 1 ? `/page=${i}` : ''
                let url = urlPathname.current.slug + urlPathname.current.year + page
                return `${url}`;
              }}
            />
          </div>
        </div>
      </div>
      }


    </div>
  )
}


export default NodeNews;