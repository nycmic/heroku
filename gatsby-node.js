const path = require(`path`);
const _ = require("lodash");

// Create a slug for each recipe and set it as a field on the node.
exports.onCreateNode = ({node, getNode, actions}) => {
  const {createNodeField} = actions

  let nodePage = [`node__news_main`, `node__news`, `node__careers`, `node__simple_page`, `node__partners`, `node__contacts`];

  nodePage.forEach(function (item) {

    if (node.internal.type === item) {
      createSlug();
      createDrupalId();
    }

    if (node.internal.type === `node__news`) {

      let dateYearTemp = node.field_news_date ? node.field_news_date.slice(0, 4) : " ";
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
exports.createPages = ({actions, graphql}) => {
  const {createPage} = actions

  const newsNode =
    `
      nodeNewsMain {                     
        fields {
          slug
          drupalInternalNid          
        }
      }     
      yearGroup: allNodeNews {
        group(field: fields___dateYear) {
          fieldValue
          totalCount
        }
      }
    `

  let nodeCommonTypeObj = [
    {
      nodeName: 'allNodeCareers',
      templateName: `careers`
    },
    {
      nodeName: 'allNodeNews',
      templateName: `news-post`
    },
    {
      nodeName: 'allNodeSimplePage',
      templateName: `simple-page`
    },
    {
      nodeName: 'allNodePartners',
      templateName: `partners`
    },
    {
      nodeName: 'allNodeContacts',
      templateName: `contacts`
    },
  ];

  let nodeCommonTypeQuery = '';

  nodeCommonTypeObj.forEach(({nodeName}) => {

      nodeCommonTypeQuery = nodeCommonTypeQuery
        + `${nodeName} {
            edges { 
              node { 
                fields {
                  slug
                  drupalInternalNid
                }
              }
            }
         }
       `
    }
  )

  return graphql(
    `
      {
        ${newsNode}
        ${nodeCommonTypeQuery}       
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    //created all common pages with
    nodeCommonTypeObj.forEach(({nodeName,templateName}) => {

      result.data[nodeName].edges.forEach(({node}) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`src/templates/${templateName}.js`),
          context: {
            slug: node.fields.slug,
            drupalInternalNid: node.fields.drupalInternalNid,
          },
        })
      })
    })
    //END: created all common pages with

    //created news page with pagination and year tags
    const years = result.data.yearGroup.group;
    const newsSlag = result.data.nodeNewsMain.fields.slug;
    const newsId = result.data.nodeNewsMain.fields.drupalInternalNid;

    years.forEach(year => {

      const postsPerPage = 4;
      const numPages = Math.ceil(year.totalCount / postsPerPage);

      Array.from({length: numPages}).forEach((test, i) => {
        let urlYear = `${_.kebabCase(year.fieldValue)}` === 'year-all' ? '' : `/${_.kebabCase(year.fieldValue)}`;

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