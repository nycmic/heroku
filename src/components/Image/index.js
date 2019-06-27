import React from "react"
import {getProp} from "../../helpers";

const Image = ({imgSrc, altText}) => {
  return (
    <img src={getProp(imgSrc, 'localFile.childImageSharp.fluid.src')} alt={altText}/>
  )
}

export default Image;