import React, {useEffect, useState, useRef} from "react"
import {createCompObj, createDrupalApiObj, getPropSafe, htmlIn} from "../../helpers";
import {graphql, useStaticQuery} from "gatsby";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';
import Moment from 'react-moment';
import YearsTags from "../NewsYearTag";
import NewsInputSearch from "../NewsInputSearch";

const NodeNews =
({
   initPagItems,
   initNumPages,
   initPagPage,
   perPage,
   location,
   slug,
   yearVar,
 }) => {

  const data = useStaticQuery(
    graphql`
      query {
        yearsList: allNodeNews {
          group(field: fields___dateYear) {
            fieldValue
            totalCount
          }
        }
      }
    `
  );

  let component = {
    yearsCounts: {},
    yearsList: data.yearsList.group,
    initNumPages: initNumPages,
    initPagPage: initPagPage,
    yearVar: yearVar,
    perPage: perPage,
    props: {
      title: 'title',
      desc: 'excerpt.body.value',
      date: 'field_news_date',
      path: 'path.alias',
      years: 'years'
    }
  };

  component.yearsList.forEach((item) => {
    let itemArr = item.fieldValue.split('=');
    component.yearsCounts[itemArr[1]] = item.totalCount;
  });

  component = createCompObj(component, initPagItems.edges, 'all', component.props);

  function checkSearchLocation() {
    if (location.search) {

      let search = location.search.replace('?', '');
      let searchObj = {};

      let searchArr = search.split('&');

      searchArr.forEach((item) => {
        let itemArr = item.split('=');
        searchObj[itemArr[0]] = itemArr[1];
      });

      component.currentSearch = searchObj.search ? searchObj.search : '';
    }
  }

  checkSearchLocation();

  return (
    <BNews component={component}
           slug={slug}
    />
  )
};

const BNews = ({component, slug}) => {

  const NewsItems = ({component}) => {
    return (
      <>

        <div className="items">

          {component.map(({isProp, id, props: item}, i) => (

            <div key={i} className="item">

              {isProp &&

              <>

                {/*component html start*/}

                <div className="title">
                  <div className="date">
                    <Moment format="MMMM DD, YYYY" date={new Date(item.date)}/>
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
      </>
    )
  };

  //States
  const [pagination, setPagination] = useState(
    {
      forcePage: component.initPagPage - 1,
      pageCount: component.initNumPages,
      componentData: component.dataArr,
      years: component.yearVar ? component.yearVar : 'all'
    }
  );

  const myRef = useRef(null);
  const searchInput = useRef(null);
  const firstUpdate = useRef(true);
  const urlPathname = useRef({
    yearData: component.yearVar,
    slug: slug ? slug : '',
    year: component.yearVar ? `/year-${component.yearVar}` : '',
    page: component.initialPaginationPage && component.initialPaginationPage !== 1 ? `/page=${component.initialPaginationPage}` : '',
    createUrl: () => urlPathname.current.slug + urlPathname.current.year + urlPathname.current.page
  });
  //endStates

  const scrollToRef = (ref) => {
    window.scrollTo(0, ref.current.getBoundingClientRect().top + window.pageYOffset - 180);
  };

  useEffect(() => {

    if (component.currentSearch) {
      handleInputSearch(component.currentSearch);
    }

  }, []);

  useEffect(() => {

    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    scrollToRef(myRef);
  });

  const handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * component.perPage);

    let yearsQL = urlPathname.current.yearData ? `filter[date_in_pager]=${urlPathname.current.yearData}&` : '';

    fetch(`https://decoupled.devstages.com/api/node/news?${yearsQL}page[offset]=${offset}&page[limit]=${component.perPage}&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`, {
      method: 'get',
      headers: {
        Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
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
          pageCount: Math.ceil(component.yearsCounts[pagination.years] / component.perPage),
          componentData: componentFetch.dataArr,
          years: pagination.years
        });

        urlPathname.current.page = selected ? `/page=${selected + 1}` : '';

        window.history.pushState(null, null, urlPathname.current.createUrl());
      })

      .catch(error => console.log(error));
  };
  const handleYearsClick = e => {

    e.preventDefault();

    let years = e.currentTarget.dataset.years;
    let offset = 0;

    let yearsQL = years ? `filter[date_in_pager]=${years}&` : '';

    searchInput.current.value = '';

    fetch(`https://decoupled.devstages.com/api/node/news?${yearsQL}&page[offset]=${offset}&page[limit]=${component.perPage}&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`, {
      method: 'get',
      headers: {
        Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
      }
    })
      .then(response => response.json())
      .then(res => {
        let componentFetch = {};

        componentFetch = createDrupalApiObj(componentFetch, res.data, 'all', component.props);

        setPagination({
          forcePage: 0,
          pageCount: Math.ceil(component.yearsCounts[years] / component.perPage),
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
  const handleInputSearch = (term) => {

    if (!term) return;

    let filterBody = `` +
      `&filter[body_value][condition][path]=body.value` +
      `&filter[body_value][condition][operator]=CONTAINS` +
      `&filter[body_value][condition][value]=${term}` +
      `&filter[body_value][condition][memberOf]=filter-cond`;

    let filterTitle = `` +
      `&filter[title][condition][path]=title` +
      `&filter[title][condition][operator]=CONTAINS` +
      `&filter[title][condition][value]=${term}` +
      `&filter[title][condition][memberOf]=filter-cond`;

    let pager = `&page[offset]=0&page[limit]=${component.perPage}`;
    let sort = `&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`

    fetch(`https://decoupled.devstages.com/api/node/news?filter[filter-cond][group][conjunction]=OR&${filterBody}${filterTitle}${pager}${sort}`, {
      method: 'get',
      headers: {
        Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
      }
    })
      .then(response => response.json())
      .then(res => {
        let componentFetch = {};

        componentFetch = createDrupalApiObj(componentFetch, res.data, 'all', component.props);

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

  }

  return (
    <div className='b-news'>
      <aside className="sidebar">

        <NewsInputSearch
          handleSearch={handleInputSearch}
          currentSearch={component.currentSearch}
          searchInput={searchInput}
        />

        <YearsTags handleYearsClick={handleYearsClick} curYear={pagination.years}/>

      </aside>

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
              initialPage={component.initPagPage - 1}
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
    </div>
  )
}


export default NodeNews;