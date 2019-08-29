const path = require(`path`);
const _ = require("lodash");

// Create a slug for each recipe and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  let nodePage = [`node__news_main`,`node__news`,`node__careers`,`node__simple_page`,`node__partners`,`node__contacts`];

  nodePage.forEach(function (item) {

    if (node.internal.type === item) {
      createSlug();
      createDrupalId();
    }

    if (node.internal.type === `node__news`) {

      let dateYearTemp = node.field_news_date ? node.field_news_date.slice(0,4): " ";
      let dateYear = "year=" + dateYearTemp;

      createNodeField({
        node,
        name: "dateYear",
        value: [dateYear, "year=all"],
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

  return graphql(
    `
      {
       nodeNewsMain {                     
          fields {
            slug
            drupalInternalNid
          }
        }
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
            totalCount
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

    let dataArr = [
      {
        node: 'allNodeCareers',
        component: path.resolve(`src/templates/careers.js`)
      },
      {
        node: 'allNodeNews',
        component: path.resolve(`src/templates/news-post.js`)
      },
      {
        node: 'allNodeSimplePage',
        component: path.resolve(`src/templates/simple-page.js`)
      },
      {
        node: 'allNodePartners',
        component: path.resolve(`src/templates/partners.js`)
      },
      {
        node: 'allNodeContacts',
        component: path.resolve(`src/templates/contacts.js`)
      },
    ]

    dataArr.forEach((item) => {

      result.data[item.node].edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: item.component,
          context: {
            slug: node.fields.slug,
            drupalInternalNid: node.fields.drupalInternalNid,
          },
        })
      })
    })

    //created news page with pagination and year tags
    const years = result.data.yearGroup.group;
    const newsSlag = result.data.nodeNewsMain.fields.slug;
    const newsId = result.data.nodeNewsMain.fields.drupalInternalNid;

    years.forEach(year => {

      const postsPerPage = 4;
      const numPages = Math.ceil(year.totalCount / postsPerPage);

      Array.from({ length: numPages }).forEach((test, i) => {
        let urlYear = `${_.kebabCase(year.fieldValue)}` === 'year-all' ? '': `/${_.kebabCase(year.fieldValue)}`;

        createPage({
          path: i === 0 ? `${newsSlag}${urlYear}` : `${newsSlag}${urlYear}/page=${i + 1}`,
          component: path.resolve(`src/templates/news-main.js`),
          context: {
            slug: `${newsSlag}`,
            limit: postsPerPage,
            skip: i * postsPerPage, numPages,
            currentPage: i + 1,
            drupalInternalNid: newsId,
            yearVar: year.fieldValue
          },
        })
      })
    })

    //END: created news page with pagination and year tags

  })
}