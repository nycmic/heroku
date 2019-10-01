import React from "react"
import styled from "styled-components"
// import Img from "gatsby-image"

const SectionTop = styled.section.attrs(props => ({
  className: 'section section-top',
}))`
  height: 240px;
  line-height: 1.2;
  text-align: center;
  z-index: 1; 
`;

export default ({children,imgTop}) => {
  return (
    <SectionTop>

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