import React from "react"
import {getProp} from "../../helpers";

export default ({imgSrc}) => {
  const img = getProp(imgSrc, 'localFile.childImageSharp.fluid.src');
  return (
    <span className="img"
      style={{backgroundImage: `url(${img})`}}>
    </span>
  )
}