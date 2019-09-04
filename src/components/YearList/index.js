import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const YearsTags = ({curYear, handleYearsClick }) => {
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

  let {yearsList} = data;

  let yearsCounts = {};
  let dataArrTagsYears = [];

  yearsList.group.forEach((item) => {
    let itemArr = item.fieldValue.split('=');
    yearsCounts[itemArr[1]] = item.totalCount;

    if (itemArr[1] && itemArr[1] !== 'all') {
      dataArrTagsYears.unshift(itemArr[1]);
    }
  });

  return (
    <div className='archive'>
      <h5>SORT BY YEAR</h5>
      <div className="fblog-archive">
        <ul className="fblog-archive-list">
          {dataArrTagsYears.map((item, i) => (
            <li key={i}>
              <a href={'/news/year-' + item} data-years={item}
                 className={'link-dropdown' + (item === curYear ? ' active' : '')} onClick={handleYearsClick}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default YearsTags;