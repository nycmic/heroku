// import React, { useState } from "react"
// import { useStaticQuery, graphql } from "gatsby"
// import { navigateTo } from "gatsby-link";
// import Recaptcha from "react-google-recaptcha";
// import yaml from 'js-yaml';
// import _ from 'lodash';
//
//
// const RECAPTCHA_KEY = process.env.SITE_RECAPTCHA_KEY;
// function encode(data) {
//     return Object.keys(data)
//         .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
//         .join("&");
// }
//
//
//
// export default ({ children }) => {
//   const data = useStaticQuery(
//     graphql`
//         query {
//           form: webformWebform {
//             elements
//             title
//           }
//         }
//       `
//   )
//
//   const formElms = yaml.safeLoad(data.form.elements);
//
//   const form = {
//     setState: {},
//     elms: {}
//   };
//   const formArrElms = [];
//
//   _.forOwn(formElms, function (value, name) {
//
//     _.forOwn(formElms[name], function (value, name, obj) {
//       let nameWithoutHash = name.replace('#', '');
//       obj[nameWithoutHash] = obj[name];
//       delete obj[name];
//     });
//
//     if(name !== 'actions') {
//       [form.elms[name], form.setState[name]] = useState("");
//     }
//
//     formElms[name].name = name;
//     formArrElms.push(formElms[name]);
//   } );
//
//   const handleInputChange = event => {
//     const target = event.target;
//     const value = target.value;
//     const name = target.name;
//
//     form.setState[name](value);
//   };
//
//   const handleRecaptcha = value => {
//       console.log(value);
//         const formData = form.elms;
//         console.log(formData);
//       formData({ "g-recaptcha-response": value });
//       console.log(value);
//     };
//
//     const handleSubmit = e => {
//         e.preventDefault();
//         // var $form = $(this);
//         // $.post($form.attr("action"), $form.serialize()).then(function() {
//         //     alert("Thank you!");
//         // });
//         const formData = form.elms;
//         console.log(formData);
//         fetch("/", {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: encode({
//                 "form-name": "contact",
//                 ...form.setState
//             })
//         })
//             .then(() => alert('Your message submit successfully'))
//             .catch(error => alert(error));
//     };
//
//   // const handleSubmit = event => {
//   //
//   //
//   //   event.preventDefault();
//   //
//   //   const formData = form.elms;
//   //   formData.webform_id = "contact";
//   //
//   //   formData.grant_type = "password";
//   //   formData.client_id = "2e2d73d0-520d-43b7-9363-a22ffc37e2f8";
//   //   formData.client_secret = "gatsby";
//   //   formData.username = "funnel";
//   //   formData.password = "admin";
//   //
//   //   console.log(formData);
//   //
//   //   // fetch('https://decoupled.devstages.com/oauth/token', {
//   //   //     method: 'POST',
//   //   //     headers: {
//   //   //         'Accept': 'application/json',
//   //   //         'Content-Type': 'multipart/form-data'
//   //   //     },
//   //   //     body: JSON.stringify(formData)
//   //   // })
//   //   //
//   //   // fetch('https://decoupled.devstages.com/webform_rest/submit?_format=json', {
//   //   //   method: 'POST',
//   //   //   headers: {
//   //   //     "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjA4OGU2OGFlZjFhN2E3MTBkMmQ2ZTIxYjQxN2U0MWIwOTBhNDQ1ZjEyMjhkYzk2MTljYWZlZmYwNDZiMzVjMmU1YmJiODRhNDczNjAwNDNmIn0.eyJhdWQiOiIyZTJkNzNkMC01MjBkLTQzYjctOTM2My1hMjJmZmMzN2UyZjgiLCJqdGkiOiIwODhlNjhhZWYxYTdhNzEwZDJkNmUyMWI0MTdlNDFiMDkwYTQ0NWYxMjI4ZGM5NjE5Y2FmZWZmMDQ2YjM1YzJlNWJiYjg0YTQ3MzYwMDQzZiIsImlhdCI6MTU2MjgzOTg3MywibmJmIjoxNTYyODM5ODczLCJleHAiOjE1NjI4ODQ1MTMsInN1YiI6IjEiLCJzY29wZXMiOlsiYXV0aGVudGljYXRlZCJdfQ.PCrbBc5J0Ks-S5Rl_sfSkNgLZT1INOdsqzcXoXpO6hsmrX51P1hP9JcORziwU3SVcQS2T-GGYShWb-9nzrfLntjJhnGysQxHcTITf87CxNQEAbqZDRGyqs7c3QklnkFctuLbdWRW5rkgD30AGwJE7ZfA0CSGPCTnXOjOk38accMFgPwCtdKI-NoYFA0tZ7Nwd_B4CpHWYpwclr6MDmPHd6epoiSmNodlelyF1LyDLTzMIVQsjUGdhK3mKGqcvjHZNUEbS_NHFMwjprtlCe_Oto_HGwaHGmOvtpJiHtkJgin8iS1SGXgx00SJ1omFuYy177-r2AVETT2V860r_hz5nZ6WrUm5KptG0jZRkSvnSLY17HYhiB8Z3cbzOfkso46i4gNkRh0J47byimayfdRO9GbGP7tloeBzcfJMIG7E9kpn7OqYPN7bzIO4lQW633IhbfAn4KU8HaImuqPLdNWez1oLsOfcZ0VNkgkzPHSj33aJv13T-m9y0IKyYNK-iuEJnRvljtbBXJHDlzAQHLeY6vQx4uIJHcyuL8e4NPHK36vtVDjVYwNLEknG2NL9Xyvi08otRFS-XOHTndoOhnQ9yztd8QMd50j5dNikNwiV2Z5grYBPekAOvgN7O7ufhGhZQp5YHZX6Zxax2arKTTis-f7t11dlwaxWoCb1LaWJmPM",
//   //   //     'Accept': 'application/json',
//   //   //     'Content-Type': 'application/json'
//   //   //   },
//   //   //   body: JSON.stringify(formData)
//   //   // })
//   // };
//
//
//
//
//   return (
//     <>
//
//       <h5>{data.form.title}</h5>
//
//       <form name="contact" method="post" data-netlify-recaptcha="true" data-netlify="true" onSubmit={handleSubmit}>
//           <input type="hidden" name="form-name" value="contact" />
//           <Recaptcha
//               sitekey="6LceP60UAAAAAAJraGxoXitOcUeJxQN0enAWiCXJ"
//               onChange={handleRecaptcha}
//           />
//         {formArrElms.map((item, i) => (
//         <React.Fragment key={i}>
//
//           {item.type === 'textfield' &&
//           <div className='form-item'>
//             <label>
//
//               <input
//                 {... {'required': item.required}}
//                 type="text"
//                 name={item.name}
//                 placeholder = {item.title}
//                 value={form.elms[item.name]}
//                 onChange={handleInputChange}
//                 size="60"
//                 maxLength="128"
//                 className={'form-text' + (item.required ? " required" : "")}
//               />
//             </label>
//           </div>
//           }
//
//           {item.type === 'tel' &&
//           <div className='form-item'>
//             <label>
//               <input
//                 {... {'required': item.required}}
//                 type="phone"
//                 name={item.name}
//                 placeholder = {item.title}
//                 value={form.elms[item.name]}
//                 onChange={handleInputChange}
//                 size="60"
//                 className={'form-text' + (item.required ? " required" : "")}
//               />
//             </label>
//           </div>
//           }
//
//           {item.type === 'email' &&
//           <div className='form-item'>
//             <label>
//
//               <input
//                 {... {'required': item.required}}
//                 type="mail"
//                 name={item.name}
//                 placeholder = {item.title}
//                 value={form.elms[item.name]}
//                 onChange={handleInputChange}
//                 size="60"
//                 className={'form-text' + (item.required ? " required" : "")}
//               />
//             </label>
//           </div>
//           }
//
//           {item.type === 'textarea' &&
//           <div className='form-item'>
//             <label>
//
//               <textarea
//                 {... {'required': item.required}}
//                 name={item.name}
//                 placeholder = {item.title}
//                 value={form.elms[item.name]}
//                 onChange={handleInputChange}
//                 cols="60"
//                 rows="5"
//                 className={'form-textarea' + (item.required ? " required" : "")}
//               />
//             </label>
//           </div>
//           }
//           {item.type === 'webform_actions' &&
//           <div className='form-actions'>
//
//             <div className="form-submit-wrap">
//               <input
//                 className="form-submit"
//                 type="submit"
//                 name={item.title}
//                 value={item.submit__label}/>
//             </div>
//
//           </div>
//           }
//
//         </React.Fragment>
//         ))
//         }
//       </form>
//
//     </>
//
//   )
// }

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Recaptcha from "react-google-recaptcha";

export default class FormCustom extends React.Component {
    state = {
        firstName: "",
        lastName: "",
    };

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name);
        this.setState({
            [name]: value,
        })
    };

    handleRecaptcha = value => {
        this.setState({ ["g-recaptcha-response"]: value });
    };

    handleSubmit = event => {
        event.preventDefault();
        fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify({
                "form-name": "contact",
                "name": "test",
                "email": "test@est.test",
                "subject": "test",
                "message": "test"
            })
        })
    };

    render() {

        return (

            <StaticQuery
                query={graphql`
            query {
              form: webformWebform {
                elements
                title
              }
            }
          `}
                render={data => (
                    <>
                        {/*{*/}
                        {/*console.log( getForm(data.form.elements))*/}
                        {/*}*/}

                        <form name="contact" method="post" data-netlify-recaptcha="true" data-netlify="true" onSubmit={this.handleSubmit}>
                            <input type="hidden" name="form-name" value="contact" />
                            <Recaptcha
                                sitekey="6LceP60UAAAAAAJraGxoXitOcUeJxQN0enAWiCXJ"
                                onChange={this.handleRecaptcha}
                            />
                            <label>
                                First name
                                <input
                                    type="text"
                                    name="firstName"
                                    value={this.state.firstName}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <label>
                                Last name
                                <input
                                    type="text"
                                    name="lastName"
                                    value={this.state.lastName}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <button type="submit" className="form-submit">Submit</button>
                        </form>

                    </>
                )}
            />

        )
    }
}
