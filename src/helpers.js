import parse from "html-react-parser";
// import DOMPurify from "dompurify";
import _ from 'lodash';

export function createCompObj (component, array, nodeId, props) {

  if (nodeId === 'all') {
    component.filteredData = array;
  } else {
    component.filteredData = filterParentData(array, nodeId);
  }

  component.isdData = !!component.filteredData.length;
  component.dataArr = [];

  component.filteredData.forEach(({node}, i) => {

    let newProps = {};

    for (let k in props) {

      if (props.hasOwnProperty(k)) {
        newProps[k] = getData(props[k])
      }
    }

    function getData(value){
      return getProp(node, value);
    }

    component.dataArr[i] = {
      id: getData('drupal_internal__id'),
      props: newProps
    };

    component.dataArr[i].isProp = !checkObjForEmpty(component.dataArr[i].props);

  });

  component.isAllArrayHasValidProp = !!component.dataArr.filter(({isProp}) => {return isProp === true}).length;

  return component;
}

export function filterParentData (array, nodeId) {

  return array.filter(({ node }) =>{return String(nodeId) === node.parent_id});
}

export function checkObjForEmpty (obg) {

  let arrProp = Object.keys(obg).map(function (key) {

    return obg[key];
  });

  return arrProp.every((item) => {return (item === null || item === undefined)});
}

export function htmlIn (el) {

  // return parse(DOMPurify.sanitize(el));
  return parse(el);
}

export function getProp (obg, el) {

  let dataProp = _.get(obg, el);

  if (typeof dataProp === 'string') {
    dataProp = htmlIn(dataProp);
  }

  return dataProp;
}

export function getPropSafe (obg, el) {
  return _.get(obg, el);
}