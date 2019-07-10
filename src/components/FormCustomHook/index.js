import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import yaml from 'js-yaml';
import _ from 'lodash';

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
        query {
          form: webformWebform {
            elements
            title
          }
        }
      `
  )

  const formElms = yaml.safeLoad(data.form.elements);

  const form = {
    setState: {},
    elms: {}
  };
  const formArrElms = [];

  _.forOwn(formElms, function (value, name) {

    _.forOwn(formElms[name], function (value, name, obj) {
      let nameWithoutHash = name.replace('#', '');
      obj[nameWithoutHash] = obj[name];
      delete obj[name];
    });

    if(name !== 'actions') {
      [form.elms[name], form.setState[name]] = useState("");
    }

    formElms[name].name = name;
    formArrElms.push(formElms[name]);
  } );

  const handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    form.setState[name](value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const formData = form.elms;
    formData.webform_id = "contact";

    console.log(formData);

    fetch('https://decoupled.devstages.com/webform_rest/submit?_format=json', {
      method: 'POST',
      headers: {
        'Authorization' : 'Basic ZnJvbnRlbmQtYXBwOmZyb250ZW5k',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
  };

  return (
    <>

      <h5>{data.form.title}</h5>

      <form onSubmit={handleSubmit}>

        {formArrElms.map((item, i) => (
        <React.Fragment key={i}>

          {item.type === 'textfield' &&
          <div className='form-item'>
            <label>

              <input
                {... {'required': item.required}}
                type="text"
                name={item.name}
                placeholder = {item.title}
                value={form.elms[item.name]}
                onChange={handleInputChange}
                size="60"
                maxLength="128"
                className={'form-text' + (item.required ? " required" : "")}
              />
            </label>
          </div>
          }

          {item.type === 'email' &&
          <div className='form-item'>
            <label>

              <input
                {... {'required': item.required}}
                type="mail"
                name={item.name}
                placeholder = {item.title}
                value={form.elms[item.name]}
                onChange={handleInputChange}
                size="60"
                className={'form-text' + (item.required ? " required" : "")}
              />
            </label>
          </div>
          }

          {item.type === 'textarea' &&
          <div className='form-item'>
            <label>

              <textarea
                {... {'required': item.required}}
                name={item.name}
                placeholder = {item.title}
                value={form.elms[item.name]}
                onChange={handleInputChange}
                cols="60"
                rows="5"
                className={'form-textarea' + (item.required ? " required" : "")}
              />
            </label>
          </div>
          }

          {item.type === 'webform_actions' &&
          <div className='form-actions'>

            <div className="form-submit-wrap">
              <input
                className="form-submit"
                type="submit"
                name={item.title}
                value={item.submit__label}/>
            </div>

          </div>
          }

        </React.Fragment>
        ))
        }
      </form>

    </>

  )
}
