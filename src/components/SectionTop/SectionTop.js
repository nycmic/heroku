import React from "react"
import styled, { css }  from "styled-components";
import settings from "../../settings";
import bgImage from './img/bg-img-2.png'
// import Img from "gatsby-image"

const SectionTop = ({children, imgTop}) => {
	return (
		<StyledContainer>
			{imgTop &&
				<StyledBgWrap>
					<StyledBg imgTop={imgTop} />
				</StyledBgWrap>
			}
			{children}
		</StyledContainer>
	)
};

export default SectionTop;

const StyledContainer = styled.section.attrs(() => ({
	className: 'section section-top',
}))`
  height: 240px;
  line-height: 1.2;
  text-align: center;
  z-index: 1;  
  
   @media(min-width: ${settings.bp.sm.view}) {
    height: 322px;
  }
  
  &:after {    
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 91px;
    background: url(${bgImage}) no-repeat;
    background-size: 100% 100%;
    display: none;

    @media (min-width: ${settings.bp.sm.view}) {
      display: block;
    }
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

const StyledBg = styled(StyledBgWrap)`
    background-size: cover;
    background-position: 50% 50%;
    
    ${props => props.imgTop && css`
			background-image: url(${props.imgTop.src});
		`}
`;

