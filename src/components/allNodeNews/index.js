import React, {useEffect, useState, useRef} from "react"
import {useStaticQuery, graphql} from "gatsby"
import {createCompObj, getPropSafe, htmlIn} from "../../helpers";
import excerptHtml from "excerpt-html";
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import SearchInput, {createFilter} from 'react-search-input'

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

  console.log(yearsList);

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

  component = createCompObj(component, data.comp.edges, nodeId, props);

  console.log(component);

  // Array.from({length: 2000000}).forEach((test, i) => {
  //   component.dataArr.push({
  //     id: undefined,
  //     isProp: true,
  //     props: {
  //       date: null,
  //       desc: '<h4><strong>Gas Extractors</strong></h4><p>OKLAHOMA CITY, OK – Commuter Air Technology (CAT), a global provider of customized aircraft modifications for commercial and government applications, has extended its list of product offerings by receiving design change approval from the European Aviation Safety Agency (EASA).&nbsp; Under the certificate, CAT is now fully authorized to sell their proprietary Exhaust Gas Extractors (EGEs) to European operators of King Air B300 series or B200GT aircraft.&nbsp;</p><p>CAT’s EGEs that are designed to increase fuel efficiency, improve cruise and climb performance, reduce nacelle sooting and virtually eliminate exhaust stack cracking were previously EASA approved for most King Air 100 and 200 series models.&nbsp; With the addition of the B300 audience, CAT will be able to bring European owners a venturi-shaped trailing edge and aerodynamically efficient exhaust gas system that optimizes the performance and functionality of their King Air.</p><p>“We are pleased to expand the offering of our EGEs in Europe,” comments Darryl Wilkerson, CAT President.&nbsp; “CAT has been engineering industry-leading King Air enhancements for customers globally since 1988 and specifically our EGEs have been in service since 1994 with over 150 ship sets operational today,” Wilkerson added.&nbsp;</p><p>CAT continues engineering on several King Air enhancements that are to be announced in 2018.&nbsp;</p><p>&nbsp;</p><p><strong>About Commuter Air Technology</strong></p><p>Commuter Air Technology delivers certified aircraft and customized aircraft modifications for commercial and government applications around the globe. Modifications range from flight performance enhancements and high-density passenger systems to cargo conversions and corporate reconfigurations. With over 30 years of experience, Commuter Air Technology offers a full line of technical support services, such as crew provision, training, program management, aircraft maintenance, engineering as well as STC process management and Airworthiness certifications. Commuter Air Technology is an AGC Aerospace &amp; Defense company.&nbsp; Learn more at&nbsp;<a href="http://www.commuterair.com/">www.commuterair.com</a>.</p><p><strong>About AGC Aerospace &amp; Defense</strong></p><p>AGC Aerospace &amp; Defense, the unifying brand of private equity group Acorn Growth Companies, is a global supplier of technologies, systems and services supporting commercial and military programs. Capabilities within the AGC Aerospace &amp; Defense portfolio range from financing, engineering, and integration services to manufacturing, logistics, and aircraft modifications. AGC Aerospace &amp; Defense is organized into four operating groups: AeroComposites, Finance, Integrated Defense, and Services. &nbsp;Learn more at&nbsp;<a href="http://www.agcaerospace.com/" target="_blank">www.agcaerospace.com</a></p>' + Math.random(),
  //       path: "/commuter-air-technology-receives-easa-approval-exhaust-gas-extractors",
  //       title: "Commuter Air Technology receives EASA Approval for Exhaust Gas Extractors"  + Math.random(),
  //       years: "2017",
  //     }
  //   });
  // })

  if (pageItems) {
    currentComponentData = createCompObj(currentComponentData, currentComponent.edges, nodeId, props);
  } else {

  }

  let currentSearch = '';

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

      currentSearch = searchObj.search ? searchObj.search : currentSearch;
      component.year = searchObj.year ? searchObj.year : '';
    }
  }

  createArrForYears();
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
    />
  )
};

const BNews = ({children, component, numPages, perPage, currentPage, currentComponentData, currentSearch, pageItems, location ,slug, yearVar}) => {

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

                <a href={'/news/?year=' + item} data-years={item}
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

  let pagState = {
    forcePage: currentPage - 1,
    pageCount: numPages,
    curData: component.dataArr,
    componentData: currentComponentData.dataArr,
    years: component.year
  };

  const [pagination, setPagination] = useState(
    pagState
  );

  // eslint-disable-next-line
  const [inputVal, setInputVal] = useState(initSearchTerm);
  const myRef = useRef(null);
  const firstUpdate = useRef(true);
  const urlPathname = useRef({
    slug: slug ? slug : '',
    year: yearVar ? `/year-${yearVar}` : '',
    page: currentPage && currentPage !== 1 ? `/page=${currentPage}` : '',
    createUrl: () => urlPathname.current.slug + urlPathname.current.year + urlPathname.current.page
  });
  //endStates

  console.log(urlPathname.current);

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

    setPagination({
      forcePage: undefined,
      pageCount: Math.ceil(curDataTemp.length / perPage),
      componentData: curDataTemp.slice(offset, offset + perPage),
      curData: curDataTemp,
      years: pagination.years
    });

    urlPathname.current.page = selected ? `/page=${selected + 1}` : ''

    window.history.pushState(null, null, urlPathname.current.createUrl());
  };

  const handleYearsClick = e => {
    if (!pageItems) return;

    e.preventDefault();

    let years = e.currentTarget.dataset.years;
    let offset = 0;
    let curDataTemp = component.dataObjYears[+years];

    setInputVal('');

    setPagination({
      forcePage: 0,
      componentData: curDataTemp.slice(offset, offset + perPage),
      pageCount: Math.ceil(curDataTemp.length / perPage),
      curData: curDataTemp,
      years: years
    });

    urlPathname.current.page = '';
    urlPathname.current.year = `/year-${years}`;

    window.history.pushState(null, null, urlPathname.current.createUrl());
  };

  //const [statePage, setPage] = useState('')

  fetch("https://decoupled.devstages.com/api/node/news")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

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