const path = require(`path`);
const createPaginatedPages = require('gatsby-paginate');
const _ = require("lodash");

// Create a slug for each recipe and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  let nodePage = [`node__news`,`node__careers`,`node__simple_page`,`node__partners`,`node__contacts`];

  nodePage.forEach(function (item) {

    if (node.internal.type === item) {
      createSlug();
      createDrupalId();
    }

    if (node.internal.type === `node__news`) {

      let dateYearTemp = node.field_news_date ? node.field_news_date.slice(0,4): " ";
      let dateYear = "year=" + dateYearTemp;

      console.log(dateYear);

      createNodeField({
        node,
        name: "dateYear",
        value: dateYear,
      })
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
                dateYear
              }
            }
          }
        }
        yearGroup: allNodeNews {
          group(field: fields___dateYear) {
            fieldValue
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
      pageLength: 4,
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
          dateYear: node.fields.dateYear,
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
          limit: 0,
          skip: 0,
          yearVar: ' '
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

    const posts = result.data.allNodeNews.edges
    const postsPerPage = 4
    const numPages = Math.ceil(posts.length / postsPerPage)

    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/news` : `/news/page=${i + 1}`,
        component: path.resolve("./src/templates/simple-page.js"),
        context: {
          slug: '/news',
          limit: postsPerPage,
          skip: i * postsPerPage, numPages,
          currentPage: i + 1,
          drupalInternalNid: '66',
          yearVar: ' '
        },
      })
    })

    const years = result.data.yearGroup.group;

    years.forEach(year => {
      createPage({
        path: `/years/${_.kebabCase(year.fieldValue)}/`,
        component: path.resolve("./src/templates/simple-page.js"),
        context: {
          slug: '/news',
          yearVar: year.fieldValue,
          drupalInternalNid: '66',
          limit: 0,
          skip: 0,
        },
      })
    })

  })
}