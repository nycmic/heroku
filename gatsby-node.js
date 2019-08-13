const path = require(`path`);
const createPaginatedPages = require('gatsby-paginate');

// Create a slug for each recipe and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  let nodePage = [`node__news`,`node__careers`,`node__simple_page`,`node__partners`,`node__contacts`];

  nodePage.forEach(function (item) {

    if (node.internal.type === item) {
      createSlug();
      createDrupalId();
    }
  });

  if (node.internal.type === "menu_link_content__menu_link_content") {

    createNodeField({
      node,
      name: "parent_menu_id",
      value: node.parent && node.parent.replace('menu_link_content:', ''),
    })
  }

  function createSlug() {
    const slug = `${node.path.alias}`;
    createNodeField({node, name: `slug`, value: slug,})
  }

  function createDrupalId() {
    const drupalInternalNid = `${node.drupal_internal__nid}`;
    createNodeField({node, name: `drupalInternalNid`, value: drupalInternalNid,})
  }
};

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const nodeCareersTemplate = path.resolve(`src/templates/careers.js`)
  const nodeNewsTemplate = path.resolve(`src/templates/news-post.js`)
  const nodeSimplePageTemplate = path.resolve(`src/templates/simple-page.js`)
  const nodePartnersTemplate = path.resolve(`src/templates/partners.js`)
  const nodeContactsTemplate = path.resolve(`src/templates/contacts.js`)

  return graphql(
    `
      {
        allNodeNews {
          edges {
            node {              
              fields {
                slug
                 drupalInternalNid
              }
            }
          }
        }
         allNodeCareers {
          edges {
            node {              
              fields {
                slug
                 drupalInternalNid
              }
            }
          }
        }
        allNodeSimplePage {
          edges {
            node {              
              fields {
                slug
                drupalInternalNid
              }
            }
          }
        }
        allNodePartners {
          edges {
            node {              
              fields {
                slug
                drupalInternalNid
              }
            }
          }
        }
        allNodeContacts {
          edges {
            node {              
              fields {
                slug
                drupalInternalNid
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    createPaginatedPages({
      edges: result.data.allNodeNews.edges,
      createPage: createPage,
      pageTemplate: 'src/templates/newsssTest.js',
      pageLength: 5,
      pathPrefix: 'newsssTest',
      buildPath: (index, pathPrefix) =>
        index > 1 ? `${pathPrefix}/${index}` : `/${pathPrefix}`, // This is optional and this is the default
    })

    // Create pages.
    result.data.allNodeCareers.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: nodeCareersTemplate,
        context: {
          slug: node.fields.slug,
          drupalInternalNid: node.fields.drupalInternalNid,
        },
      })
    })
    result.data.allNodeNews.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: nodeNewsTemplate,
        context: {
          slug: node.fields.slug,
          drupalInternalNid: node.fields.drupalInternalNid,
        },
      })
    })
    result.data.allNodeSimplePage.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: nodeSimplePageTemplate,
        context: {
          slug: node.fields.slug,
          drupalInternalNid: node.fields.drupalInternalNid,
        },
      })
    })
    result.data.allNodePartners.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: nodePartnersTemplate,
        context: {
          slug: node.fields.slug,
          drupalInternalNid: node.fields.drupalInternalNid,
        },
      })
    })
    result.data.allNodeContacts.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: nodeContactsTemplate,
        context: {
          slug: node.fields.slug,
          drupalInternalNid: node.fields.drupalInternalNid,
        },
      })
    })
  })
}