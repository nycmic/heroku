import React from "react"
import styled from "styled-components"
// import Img from "gatsby-image"

const SectionTop = styled.section`
  height: 240px;
  line-height: 1.2;
  text-align: center;
  z-index: 1;    
  
  &:after {
  	
  }
`;

export default ({children,imgTop}) => {
  return (
    <SectionTop className="section section-top">

      {imgTop &&
        <div className="bg-wrap">
          <div className="bg"
               style={{backgroundImage: `url(${imgTop.src})`}}>
          </div>
        </div>
      }
      {children}
    </SectionTop>
  )
}