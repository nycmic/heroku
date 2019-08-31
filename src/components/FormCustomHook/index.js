import React, {useState, useRef} from "react"
import {useStaticQuery, graphql} from "gatsby"
// import { navigateTo } from "gatsby-link";
import Recaptcha from "react-google-recaptcha";
import yaml from 'js-yaml';
import _ from 'lodash';


// const RECAPTCHA_KEY = process.env.SITE_RECAPTCHA_KEY;
function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default ({children}) => {
  const data = useStaticQuery(
    graphql`
      query {
        form: webformWebform {
          elements
          title
        }
      }
    `,
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

    if (name !== 'actions') {
      [form.elms[name], form.setState[name]] = useState("");
    }

    formElms[name].name = name;
    formArrElms.push(formElms[name]);
  });

  const handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    form.setState[name](value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    const formData = form.elms;
    fetch("contact", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: encode({
        "no-cache": "1",
        "form-name": "contact",
        "g-recaptcha-response": captchaVal.current,
        ...formData,
      })
    })
      .then(() => alert('Your message submit successfully'))
      .catch(error => alert(error));
  };

  const captchaVal = useRef(null);

  const handleRecaptcha = (value) => {

    captchaVal.current = value;
    console.log(captchaVal.current);
  }
  return (
    <>

      <h5>{data.form.title}</h5>

      <form name="contact" method="post" data-netlify="true" data-netlify-recaptcha="true" onSubmit={handleSubmit}>
        <div data-netlify-recaptcha="true"></div>
        <input type="hidden" name="form-name" value="contact"/>
        <Recaptcha
          sitekey="6LceP60UAAAAAAJraGxoXitOcUeJxQN0enAWiCXJ"
          onChange={handleRecaptcha}
        />

        {formArrElms.map((item, i) => (
          <React.Fragment key={i}>

            {item.type === 'textfield' &&
            <div className='form-item'>
              <label>

                <input
                  {...{'required': item.required}}
                  type="text"
                  name={item.name}
                  placeholder={item.title}
                  value={form.elms[item.name]}
                  onChange={handleInputChange}
                  size="60"
                  maxLength="128"
                  className={'form-text' + (item.required ? " required" : "")}
                />
              </label>
            </div>
            }

            {item.type === 'tel' &&
            <div className='form-item'>
              <label>
                <input
                  {...{'required': item.required}}
                  type="tel"
                  pattern="[0-9]"
                  name={item.name}
                  placeholder={item.title}
                  value={form.elms[item.name]}
                  onChange={handleInputChange}
                  size="60"
                  className={'form-text' + (item.required ? " required" : "")}
                />
              </label>
            </div>
            }

            {item.type === 'email' &&
            <div className='form-item'>
              <label>

                <input
                  {...{'required': item.required}}
                  type="email"
                  name={item.name}
                  placeholder={item.title}
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
                {...{'required': item.required}}
                name={item.name}
                placeholder={item.title}
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
