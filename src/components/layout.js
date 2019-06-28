/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import drupalOauth from '../components/drupal-oauth/drupalOauth';
import withDrupalOauthProvider from '../components/drupal-oauth/withDrupalOauthProvider';
// import Header from "./header"
// import "./layout.css"
import withRoot from "../withRoot";
import { withStyles } from '@material-ui/core/styles';
// import MainMenu from "../pages";
import "../styles.scss"
import SiteHeader from "./SiteHeader"
import SiteFooter from "./SiteFooter"
import CustomMenu from "./CustomMenu"

// const drupalOauthClient = new drupalOauth({
//     drupal_root: 'http://apache2.decoupled.localhost',
//     client_id: 'acaf70b5-9e20-41bb-8fa5-f762e9df8e7f',
//     client_secret: 'gatsby1',
// });

const drupalOauthClient = new drupalOauth({
    drupal_root: 'https://decoupled.devstages.com',
    client_id: 'd2beb1a1-d27e-44cc-835e-6c4d94c57403',
    client_secret: 'admin',
});

const styles = theme => ({
    root: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});

const Layout = ({ children, nodeId }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        {/*<Header siteTitle={data.site.siteMetadata.title} />*/}
        <CustomMenu />
        <div className="outer-wrapper">
          <SiteHeader />
          {children}
          {/*<footer>*/}
            {/*© {new Date().getFullYear()}, Built with*/}
            {/*{` `}*/}
            {/*<a href="https://www.gatsbyjs.org">Gatsby</a>*/}
          {/*</footer>*/}

          {nodeId}
          <SiteFooter />
        </div>

      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

const LayoutWithStyles = withRoot(withStyles(styles)(Layout));
export default withDrupalOauthProvider(drupalOauthClient, LayoutWithStyles);

