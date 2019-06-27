import React from "react"
import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

import SliderCustom from "../components/SliderCustom"
import NavLinks from "../components/NavLinks"
import RecentNews from "../components/RecentNews"
import {graphql} from "gatsby";
import ParagraphHomeTopLinksFieldColl from "../components/ParagraphHomeTopLinksFieldColl";
import SectionTitle from "../components/SectionTitle";
import {getProp} from "../helpers";
import InnerWrapper from "../components/InnerWrapper";
import SectionTop from "../components/SectionTop";

const IndexPage = ({data: {nodeHomepage: page}}) => {

    let pageId = page.drupal_internal__nid;

      let bodyValue = getProp(page, 'body.value');
      let bodyTitle = getProp(page, 'field_home_body_title_text');
      let newsletterSubscText = getProp(page, 'field_home_newsletter_subsc_text.value');
      let homeContactText = getProp(page, 'field_basic_contacts_text.value');

      return(
        <Layout>
          <SEO bodyClass="front" title="Home" keywords={[`gatsby`, `application`, `react`]} />

          <SectionTop>
            <SliderCustom sliderItems={page.relationships.field_top_slider}/>
          </SectionTop>

          <SectionTitle title={page.title}/>

          <InnerWrapper>

            <ParagraphHomeTopLinksFieldColl nodeId={pageId}/>

            <div className="wrapper">
              <div className="content-wrap">

                <div className="content-inner">

                  <div className="inner-wrap">

                    <h2>{bodyTitle}</h2>
                    {bodyValue}
                  </div>
                </div>

                <RecentNews />

              </div>

            </div>

            <div className="b-info style-a">

              <div className="left-part">
                {newsletterSubscText}
              </div>

              <div className="btn-wrap">
                <a href={page.field_home_newsletter_subsc_link.uri} rel="noopener noreferrer" target="_blank" className="btn style-a">
                  {page.field_home_newsletter_subsc_link.title}
                </a>
              </div>

            </div>

            <NavLinks items={page.relationships.field_basic_bottom_links_fc} classMod='style-a'/>

            <div className="b-info">
              {homeContactText}
              <a href={page.field_home_contact_button_link.uri} rel="noopener noreferrer" target="_blank" className="btn">
                {page.field_home_contact_button_link.title}
              </a>
            </div>

          </InnerWrapper>

        </Layout>
      )
  }

export default IndexPage

export const query = graphql`
  query {   
    nodeHomepage {
        drupal_internal__nid
        body {
          value
        }
        title
        field_home_newsletter_subsc_text {
          value
        }
        field_home_newsletter_subsc_link {
          uri
          title
        }
        field_home_contact_button_link {
          uri
          title
        }
        field_home_body_title_text
        field_basic_contacts_text {
          value
        }
        relationships {          
           field_basic_bottom_links_fc {
            field_top_links_fc_link {
              title
              uri
              options {
                alias_path
              }
            }
            relationships {
              field_top_links_fc_image {
                localFile {
                  childImageSharp {
                    fluid {
                      src
                    }
                  }
                }
              }
            }
          }
          field_top_slider {
            field_top_slider_fc_link {
              uri
              title
              options {
                alias_path
              }
            }
            field_top_slider_fc_text {
              value
            }
          relationships {
            field_top_slider_fc_image {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 3000) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
     }
        
    }    
  }
`