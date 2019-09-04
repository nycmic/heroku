import React, {useEffect, useState, useRef} from "react"
import {createCompObj, createDrupalApiObj, getPropSafe, htmlIn} from "../../helpers";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';
import Moment from 'react-moment';
import {debounce} from 'lodash';

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
                    <Moment format="MMMM DD, YYYY" date={new Date(item.date)} />
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
      handleInputSearch(initSearchTerm);
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

  const handleInputSearch = debounce((term) => {

    if (!term) {
      setInputVal('');
      return
    }

    if (!pageItems) {

      window.history.pushState(null, null, '/news/?search=' + term);
      window.location.reload();
    }

    let filterBody = `` +
      `&filter[body_value][condition][path]=body.value` +
      `&filter[body_value][condition][operator]=CONTAINS` +
      `&filter[body_value][condition][value]=${term}` +
      `&filter[body_value][condition][memberOf]=filter-cond`;

    let filterTitle = `` +
      `&filter[title][condition][path]=title` +
      `&filter[title][condition][operator]=CONTAINS` +
      `&filter[title][condition][value]=${term}` +
      `&filter[title][condition][memberOf]=filter-cond` ;

    let pager = `&page[offset]=0&page[limit]=${perPage}`;
    let sort = `&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`

    fetch(`https://decoupled.devstages.com/api/node/news?filter[filter-cond][group][conjunction]=OR&${filterBody}${filterTitle}${pager}${sort}`, {
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
          pageCount: 10,
          componentData: componentFetch.dataArr,
          years: ''
        });

        urlPathname.current.page = '';
        urlPathname.current.year = '';

        let url = urlPathname.current.slug + urlPathname.current.year + urlPathname.current.page

        window.history.pushState(null, null, url + '?search=' + term);
      })

      .catch(error => console.log(error));

    setInputVal(term)

    }
    , 500); //debounce end

  return (
    <div className='b-news'>
      <aside className="sidebar">
        <div className="form form-search">
          {/*<SearchInput placeholder={'Search News'} className="search-input" onChange={searchUpdated} value={inputVal}/>*/}

          <div className='search-input'>
            <label>

              <input
                placeholder='Search News'
                type="search"
                // value={inputVal}
                onChange={e => handleInputSearch(e.target.value)}
              />
            </label>
          </div>
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