import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Button } from "reactstrap";
import http from "../components/services/httpService";
import Cookies from "js-cookie";
import jwtdecode from "jwt-decode";
import jwt from "jsonwebtoken";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});
const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};
function convertSignToken(jwtToken) {
  return jwtdecode(jwtToken, { complete: true });
}
class Login extends Component {
  login = async () => {
    window.location = dotenv.oauth_url;
  };
  constructor(props) {
    super(props);

    this.state = {
      email: "",

      password: "",

      error: "",
      routetoHomePage: false,

      errorTextMail: "",

      errorpassword: ""
    };
  }

  requiredValidation(state) {
    switch (state.target.name) {
      case "userId":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorTextMail: "This field is required" });

          break;
        } else {
          this.setState({ errorTextMail: "" });
        }

      case "password":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorpassword: "This field is required" });

          break;
        } else {
          this.setState({ errorpassword: "" });
        }
    }
  }
  handleClick() {}

  render() {
    const { email, password, error } = this.state;

    const enabled =
      this.state.email.length > 0 && this.state.password.length > 0;
    return (
      <div className="row" style={{ overflow: "hidden" }}>
        <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
          <div className="bckgImage">
            <img
              className=" img-fluid logo "
              src={require("../assets/Logo.svg")}
            />

            <div className="logo-svg">agent</div>
          </div>
        </div>
        <div className=" col-lg-6 col-md-6 col-sm-12 col-12 ">
          <MuiThemeProvider>
            <div style={{ marginLeft: "36%", marginTop: "45%" }}>
              <div />
              <br />

              <br />
              <div className="outlooklogo">
                <img
                  className=" img-fluid logo  "
                  src={require("../assets/office-365.png")}
                />
              </div>

              <Button
                onClick={this.login}
                className="outlookbuttonlogo"
                color="orange"
              >
                <h4>Sign In </h4>
              </Button>
              {this.state.token}

              <div className="col-lg-12 col-md-12 col-sm-12 col-6">
                {window.localStorage.getItem("errorMessage") && (
                  <div className="loginErrorStyle">
                    {window.localStorage.getItem("errorMessage")}
                  </div>
                )}
              </div>
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default Login;
