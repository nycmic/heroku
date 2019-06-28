import React from "react"
import { StaticQuery, graphql } from "gatsby"

export default class FormCustom extends React.Component {
  state = {
    firstName: "",
    lastName: "",
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    })
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch('https://decoupled.devstages.com/webform_rest/submit?_format=json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "webform_id": "contact",
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

              <form onSubmit={this.handleSubmit}>
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