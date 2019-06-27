import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import {getProp} from "../helpers";
import SectionTop from "../components/SectionTop";
import SectionTitle from "../components/SectionTitle";
import InnerWrapper from "../components/InnerWrapper";
import ParagraphTwoImagesInColumns from "../components/ParagraphTwoImagesInColumns";

export default ({data: {nodeCareers: page, nodeCareers: {fields: {drupalInternalNid: pageId}}}}) => {

  let {relationships: relPage} = page;
  let bodyValue = getProp(page, 'body.value');
  let imgTop = relPage.field_basic_top_image;
  let contactsText = getProp(page, 'field_basic_contacts_text.value');
  let contactsLinkUrl = getProp(page, 'field_home_contact_button_link.options.uri');
  let contactsLinkText = getProp(page, 'field_home_contact_button_link.options.title');

  return (
    <Layout nodeId={pageId}>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid} />
      <SectionTitle title={page.title}/>

      <InnerWrapper>

        <div className="content-inner">

          <div className="inner-wrap">

            <ParagraphTwoImagesInColumns nodeId={pageId}/>

            {bodyValue}

          </div>

          <div className="b-info">
            {contactsText}

            <div className="btn-wrap">
              <a href={contactsLinkUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className='btn'>
                {contactsLinkText}
              </a>
            </div>
          </div>

          <div className="inner-wrap">


          </div>

          <div className="b-info">
            {contactsText}

            <div className="btn-wrap">
              <a href={contactsLinkUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className='btn'>
                {contactsLinkText}
              </a>
            </div>
          </div>

        </div>
      </InnerWrapper>

    </Layout>
  )
}

export const query = graphql`  
  query($slug: String!) {
    nodeCareers(fields: { slug: { eq: $slug } }) {
     field_basic_contacts_text {
        value
      }     
      field_home_contact_button_link {
        options {
          uri
          title
        }
      }
      fields {
        drupalInternalNid
      }
      relationships {
        field_basic_top_image {
          localFile {
            childImageSharp {
              fluid {
                src
              }
            }
          }
        }       
      }
      body {
        value
      }
      title
    }
  }
`