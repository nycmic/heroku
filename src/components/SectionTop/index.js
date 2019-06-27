import React from "react"
// import Img from "gatsby-image"

export default ({children,imgTop}) => {
  return (
    <section className="section section-top">

      {imgTop &&
        <div className="bg-wrap">
          <div className="bg"
               style={{backgroundImage: `url(${imgTop.src})`}}>
          </div>
        </div>
      }
      {children}
    </section>
  )
}