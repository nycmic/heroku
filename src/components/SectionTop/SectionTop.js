import React from "react"
import styled from "styled-components"
import settings from "../../settings";
// import Img from "gatsby-image"

const SectionTop = ({children, imgTop}) => {

	const StyledContainer = styled.section.attrs(props => ({
		className: 'section section-top',
	}))`
  height: 240px;
  line-height: 1.2;
  text-align: center;
  z-index: 1;  
  
   @media(min-width: ${settings.bp.sm.view}) {
    height: 322px;
  }
`;

	const StyledBgWrap = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    overflow: hidden;
`;

	const StyledBg = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    background-size: cover;
    background-position: 50% 50%;  
`;

	return (
		<StyledContainer>

			{imgTop &&
			<StyledBgWrap>
				<StyledBg style={{backgroundImage: `url(${imgTop.src})`}}>
				</StyledBg>
			</StyledBgWrap>
			}
			{children}
		</StyledContainer>
	)
}

export default SectionTop;