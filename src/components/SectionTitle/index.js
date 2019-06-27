import React from "react"

export default ({title, breadcrumbs}) => {
  return (
    <section className="section section-title">

      <div className="container">

        {breadcrumbs &&
           <div className="breadcrumb">
            {breadcrumbs.map(({path: {alias},name}, index) => (
            <React.Fragment key={index}>
                <span className="inline" >
                    <a href={alias.replace('/breadcrumbs', '')}>{name} </a>
                </span>
                <span className="delimiter">
                </span>
            </React.Fragment>
            ))}
          </div>
        }

        <h1>{title}</h1>

      </div>

    </section>
  )
}