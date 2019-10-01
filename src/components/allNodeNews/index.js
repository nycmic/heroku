import React, {useEffect, useState, useRef} from "react"
import {createCompObj, createDrupalApiObj, getPropSafe, htmlIn, checkSearchLocation} from "../../helpers";
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

	let comp = {
		yearsCounts: {},
		locSearch: {},
		yearsList: data.yearsList.group,
		initNumPages,
		initPagPage,
		yearVar,
		perPage,
		slug,
		props: {
			title: 'title',
			desc: 'excerpt.body.value',
			date: 'field_news_date',
			path: 'path.alias',
			years: 'years'
		}
	};

	comp.yearsList.forEach((item) => {
		let [, curYear] = item.fieldValue.split('=');
		comp.yearsCounts[curYear] = item.totalCount;
	});

	createCompObj(comp, initPagItems.edges, 'all', comp.props);
	checkSearchLocation(comp, location);

	return (
		<BNews comp={comp}/>
	)
};

const BNews = ({comp}) => {

	//States
	const [pagination, setPagination] = useState(
		{
			error: null,
			isLoaded: false,
			forcePage: comp.initPagPage - 1,
			pageCount: comp.initNumPages,
			compData: comp.dataArr,
			years: comp.yearVar
		}
	);

	const myRef = useRef(null);
	const searchInput = useRef(null);
	const firstUpdate = useRef(true);
	const urlPathname = useRef({
		yearData: comp.yearVar !== 'all' ? comp.yearVar : '',
		slug: comp.slug ? comp.slug : '',
		year: comp.yearVar ? `/year-${comp.yearVar}` : '',
		page: comp.initPagPage && comp.initPagPage !== 1 ? `/page=${comp.initPagPage}` : '',
		createUrl: () => urlPathname.current.slug + urlPathname.current.year + urlPathname.current.page
	});
	//endStates

	const scrollToRef = (ref) => {
		window.scrollTo(0, ref.current.getBoundingClientRect().top + window.pageYOffset - 180);
	};

	useEffect(() => {

		if (comp.locSearch.search) {
			handleInputSearch(comp.locSearch.search);
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
		let offset = Math.ceil(selected * comp.perPage);

		let yearsQL = urlPathname.current.yearData ? `filter[date_in_pager]=${urlPathname.current.yearData}&` : '';

		setPagination({
			isLoaded: true,
			forcePage: pagination.forcePage,
			pageCount: pagination.pageCount,
			compData: pagination.compData,
			years: pagination.years
		});

		fetch(`https://decoupled.devstages.com/api/node/news?${yearsQL}page[offset]=${offset}&page[limit]=${comp.perPage}&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`, {
			headers: {
				Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
			}
		})
			.then(response => response.json())
			.then(res => {
					let compFetch = {};

					createDrupalApiObj(compFetch, res.data, 'all', comp.props);

					setPagination({
						isLoaded: false,
						forcePage: undefined,
						pageCount: Math.ceil(comp.yearsCounts[pagination.years] / comp.perPage),
						compData: compFetch.dataArr,
						years: pagination.years
					});

					urlPathname.current.page = selected ? `/page=${selected + 1}` : '';

					window.history.pushState(null, null, urlPathname.current.createUrl());
				},
				(error) => {
					console.log(error, 'react error')

					setPagination({
						isLoaded: false,
						error
					})
				}
			)
			.catch(error => console.log(error, 'catch error'));
	};
	const handleYearsClick = e => {

		e.preventDefault();

		let years = e.currentTarget.dataset.years;
		let offset = 0;

		let yearsQL = years ? `filter[date_in_pager]=${years}&` : '';

		searchInput.current.value = '';

		setPagination({
			isLoaded: true,
			forcePage: pagination.forcePage,
			pageCount: pagination.pageCount,
			compData: pagination.compData,
			years: pagination.years
		});

		fetch(`https://decoupled.devstages.com/api/node/news?${yearsQL}&page[offset]=${offset}&page[limit]=${comp.perPage}&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`, {
			method: 'get',
			headers: {
				Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
			}
		})
			.then(response => response.json())
			.then(res => {
				let compFetch = {};

				createDrupalApiObj(compFetch, res.data, 'all', comp.props);

				setPagination({
					isLoaded: false,
					forcePage: 0,
					pageCount: Math.ceil(comp.yearsCounts[years] / comp.perPage),
					compData: compFetch.dataArr,
					years: years
				});

				urlPathname.current.yearData = years;
				urlPathname.current.page = '';
				urlPathname.current.year = `/year-${years}`;

				window.history.pushState(null, null, urlPathname.current.createUrl());
			},
				(error) => {
					console.log(error, 'react error')

					setPagination({
						isLoaded: false,
						error
					})
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

		let pager = `&page[offset]=0&page[limit]=${comp.perPage}`;
		let sort = `&sort[sort-created][path]=field_news_date&sort[sort-created][direction]=DESC`

		let count = 0;

		fetch(`https://decoupled.devstages.com/api/search?_format=json&text=${term}`, {
			headers: {
				Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
			}
		})
			.then(response => response.json())
			.then(res => {

				if (res.entries_count) {
					count = +res.entries_count;
				}

					fetch(`https://decoupled.devstages.com/api/node/news?filter[filter-cond][group][conjunction]=OR&${filterBody}${filterTitle}${pager}${sort}`, {
						method: 'get',
						headers: {
							Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k"
						}
					})
						.then(response => response.json())
						.then(res => {
								let compFetch = {};

								compFetch = createDrupalApiObj(compFetch, res.data, 'all', comp.props);

								setPagination({
									forcePage: 0,
									pageCount: count,
									compData: compFetch.dataArr,
									years: ''
								});

								urlPathname.current.page = '';
								urlPathname.current.year = '';

								let url = urlPathname.current.slug + urlPathname.current.year + urlPathname.current.page

								window.history.pushState(null, null, url + '?search=' + term);
							},
							(error) => {
								console.log(error, 'react error')

								setPagination({
									isLoaded: false,
									error
								})
							})

						.catch(error => console.log(error));
			},
				(error) => {
					console.log(error, 'react error')

					setPagination({
						isLoaded: false,
						error
					})
				})

			.catch(error => console.log(error));


	}

	return (
		<div className={'b-news' + (pagination.isLoaded ? ' b-news_loader-active': '')}>
			<aside className="sidebar">

				<NewsInputSearch
					handleSearch={handleInputSearch}
					currentSearch={comp.locSearch.search}
					searchInput={searchInput}
				/>

				<YearsTags handleYearsClick={handleYearsClick} curYear={pagination.years}/>

			</aside>

			<div className="items-wrap" ref={myRef}>
				<NewsItems comp={pagination.compData}/>

				{pagination.error &&
					<div>
						{pagination.error}
					</div>
				}

				{!pagination.pageCount &&
					<div>
						<h5 style={{textAlign: 'center', margin: '70px 0'}}>YOUR SEARCH YIELDED NO RESULTS</h5>
					</div>
				}

				<div className={`pager-wrapper page-counts-${pagination.pageCount}`}>
					<div className="item-list">
						<ReactPaginate
							forcePage={pagination.forcePage}
							initialPage={comp.initPagPage - 1}
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

const NewsItems = ({comp}) => {
	return (
		<>

			<div className="items">

				{comp.map(({isProp, id, props: item}, i) => (

					<div key={i} className="item">

						{isProp &&

						<>

							{/*comp html start*/}

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


							{/*comp html end*/}

						</>

						}

					</div>
				))}

			</div>
		</>
	)
};


export default NodeNews;