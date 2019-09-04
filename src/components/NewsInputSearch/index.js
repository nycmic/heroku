import React from "react"
import {debounce} from "lodash";

const NewsInputSearch = ({handleSearch,currentSearch,searchInput }) => {

  const handleInputSearch = debounce((term) => {

      if (!term) return;

      handleSearch(term);

    }
    , 500); //debounce end

  return (
    <div className="form form-search">
      <div className='search-input'>
        <label>

          <input
            defaultValue={currentSearch}
            ref={searchInput}
            placeholder='Search News'
            type="search"
            onChange={e => handleInputSearch(e.target.value)}
          />
        </label>
      </div>
    </div>
  )
}

export default NewsInputSearch;