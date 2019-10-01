 module.exports = {
  siteMetadata: {
    title: `commuter air technology`,
    description: `COMMUTER AIR TECHNOLOGY`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-lodash`,
    {
      resolve:  `gatsby-plugin-styled-components`,
      options: {
        displayName: true,
        fileName: true
      }
    },
    {
      resolve: `gatsby-source-drupal`,
      options: {
        baseUrl: `https://decoupled.devstages.com`,
        apiBase: `api`,
        headers: {
          Authorization: "Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k", // any valid request header here
        },
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaultQuality: 75,
        pngCompressionLevel: 9
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `COMMUTER AIR TECHNOLOGY`,
        short_name: `COMMUTER`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}

