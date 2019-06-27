import React from "react"

export default ({items, classMod=''}) => {
  return (
    <>
     {items &&

        <div className={'b-nav-links ' + classMod}>

          {
            items.map((item, i) => (
              <a href={item.field_top_links_fc_link.options.alias_path} className="item" key={i}>
                <span className="img"
                      style={{backgroundImage: `url(${item.relationships.field_top_links_fc_image.localFile.childImageSharp.fluid.src})`}}>
                </span>
                <span className="title" >
                   {item.field_top_links_fc_link.title}
                </span>
              </a>
            ))
          }

        </div>
      }
    </>
  )
}