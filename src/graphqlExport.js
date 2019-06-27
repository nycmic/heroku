import { graphql } from "gatsby"

export const localFile = graphql`
  fragment ImgLocalFile on file__file {
   localFile {
      childImageSharp {
        fluid(maxWidth: 3000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`