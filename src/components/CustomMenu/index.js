// import React from "react"
// import { useStaticQuery, graphql } from "gatsby"
// import SignIn from '../SignIn/SignIn';
// import LogoutLink from '../LogoutLink/LogoutLink';
//
// export default ({ children }) => {
//   const data = useStaticQuery(
//     graphql`
//         query {
//            allMenuLinkContentMenuLinkContent(filter: {menu_name: {eq: "main"}}) {
//             edges {
//               node {
//                 title
//                 menu_name
//               }
//             }
//           }
//         }
//       `
//   )
//   return (
//     <div>
//       <ul>
//         {data.allMenuLinkContentMenuLinkContent.edges.map(({ node }) => (
//           <li key={node.title}>
//             {node.title}
//           </li>
//         ))}
//       </ul>
//         {props.userAuthenticated ?
//             <>
//                 <LogoutLink/>
//             </>
//             :
//             <SignIn />
//         }
//       {children}
//     </div>
//   )
// }

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import withDrupalOauthConsumer from '../drupal-oauth/withDrupalOauthConsumer';
import SignIn from '../SignIn/SignIn';
import LogoutLink from '../LogoutLink/LogoutLink';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menu: {
        display: 'flex',
    },
    menuButton: {
        marginRight: '20px',
    }
};

function Navigation(props) {
    const { classes } = props;

    return (
        <div className={classes.root} style={{display: "none"}}>
            <AppBar position="relative" color="default">
                <Toolbar>
                    <Typography variant="h2" className={classes.grow}>{props.siteTitle}</Typography>
                    <div className={classes.menu}>
                        {props.userAuthenticated ?
                            <>
                                <LogoutLink/>
                            </>
                            :
                            <SignIn />
                        }
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withDrupalOauthConsumer(Navigation));