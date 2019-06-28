import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import SectionTop from "../components/SectionTop";
import SectionTitle from "../components/SectionTitle";
import InnerWrapper from "../components/InnerWrapper";
import FormCustomHook from "../components/FormCustomHook";
import {getProp} from "../helpers";

export default ({data: {nodeContacts: page}}) => {
  let imgTop = page.relationships.field_basic_top_image;
  let bodyValue = getProp(page, 'body.value');

  return (
    <Layout>
      <SectionTop imgTop={imgTop.localFile.childImageSharp.fluid} />
      <SectionTitle title={page.title}/>

      <InnerWrapper>


        <div className="contact">

          <div className="cols">

            <div className="col">
              {bodyValue}

              <div className="form form-contact">

                <FormCustomHook/>
              </div>


            </div>

            <div className="col">

            </div>
          </div>

        </div>
      </InnerWrapper>

    </Layout>
  )
}

export const query = graphql`  
  query($slug: String!) {
    nodeContacts(fields: { slug: { eq: $slug } }) {
      title  
       body {
        value
      }         
      relationships {
        field_basic_top_image {
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
`