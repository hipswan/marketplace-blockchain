import React, { Component } from "react";

class RegisterForm extends Component {
  render() {
    return (
        <div id="content">
            <h1>Register</h1>
      <form onSubmit={(event) => {
        event.preventDefault()
        const name = this.name.value
        const userType = this.selectUserType.value
        this.props.registerUser(name, userType)
      }}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="name"
            className="form-control"
            id="name"
            ref={(input) => {
              this.name = input;
            }}
            aria-describedby="nameHelp"
            placeholder="Enter name"
          />
          {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
        </div>

        <div className="form-group">
          <label>Select User Type</label>

          <select
            className="form-control"
            id="selectUserType"
            ref={(input) => {
              this.selectUserType = input;
            }}
          >
            <option>buyer</option>
            <option>seller</option>
            <option>delivery</option>

          </select>
        </div>
        <div className="form-group">
          <label >Account accountDetails</label>

          <input
            className="form-control"
            id="accountDetails"
            ref={(input) => {
              this.accountDetails = input;
            }}
            type="text"
            // placeholder="Readonly input here..."
            value={this.props.accountDetails}
            readOnly
          ></input>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
    );
  }
}

export default RegisterForm;
