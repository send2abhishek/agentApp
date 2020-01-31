import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Button } from "reactstrap";
import Cookies from "js-cookie";
const dotenv = require("../../src/env");

const config = {
  headers: { Pragma: "no-cache" }
};

export class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      email: "",
      password: "",
      error: "",
      defaultPassword: "",
      newPassword: "",
      confirmPassword: "",
      errorTextMail: null,
      errorpassword1: null,
      errorpassword2: null,
      errorpassword3: null,
      validateforNewPassword: false,
      validateforConfirmPassword: false,
      open: false
    };
  }

  handleClose = () => {
    this.setState({ open: false });
    const path = "/";
    browserHistory.push(path);
  };

  handleClick() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        error: "New Password and Confirm Password does not match"
      });
    } else {
      axios
        .post(
          dotenv.API_ROOT + "/agents/changePassword",
          {
            userId: window.localStorage.getItem("userId"),
            default: this.state.defaultPassword,
            newPassword: this.state.newPassword
          },
          config
        )
        .then(response => {
          if (response.data.response.responsecode == 700) {
            this.setState({ open: true });
          } else if (
            response.data.response.message === "error in changing the password"
          ) {
            this.setState({ error: "Default Password  is invalid" });
          } else {
            this.setState({ error: response.data.response.message });
          }
        })
        .catch(error => {
          if (error.response) {
            this.setState({ error: error.response.data.error.message });
          } else {
            this.setState({ error: "Unable to reach Server" });
          }
        });
    }
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
        return;

      case "password1":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorpassword1: "This field is required" });
        } else {
          this.setState({ errorpassword1: "" });
        }
        return;
      case "password2":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorpassword2: "This field is required" });
        } else if (!state.target.validity.valid) {
          this.setState({
            errorpassword2:
              "Must contain atleast 1 small-case letter, 1 upper-case letter, 1 digit, 1 special character and the length should be between 6-8 characters"
          });
        } else {
          this.setState({ errorpassword2: "" });
        }

        return;

      case "password3":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorpassword3: "This field is required" });
          break;
        } else if (!state.target.validity.valid) {
          this.setState({
            errorpassword3:
              "Must contain atleast 1 small-case letter, 1 upper-case letter, 1 digit, 1 special character and the length should be between 6-8 characters"
          });
        } else {
          this.setState({ errorpassword3: "" });
        }
        return;
    }
  }

  passwordValidate(event) {
    switch (event.target.name) {
      case "password2":
        if (!event.target.validity.valid) {
          this.setState({
            errorpassword2:
              "Must contain atleast 1 small-case letter, 1 upper-case letter, 1 digit, 1 special character and the length should be between 6-8 characters"
          });
          this.setState({ validateforNewPassword: true });
        } else {
          this.setState({
            errorpassword2: ""
          });
          this.setState({ validateforNewPassword: false });
        }
        break;

      case "password3":
        if (!event.target.validity.valid) {
          this.setState({
            errorpassword3:
              "Must contain atleast 1 small-case letter, 1 upper-case letter, 1 digit, 1 special character and the length should be between 6-8 characters"
          });
          this.setState({ validateforConfirmPassword: true });
        } else {
          this.setState({
            errorpassword3: ""
          });
          this.setState({ validateforConfirmPassword: false });
        }
        break;
    }
  }

  handleChage(e) {}

  render() {
    const { email, password, error } = this.state;

    const { fullScreen } = this.props;
    const enabled =
      this.state.defaultPassword.length > 0 &&
      this.state.newPassword.length > 0 &&
      this.state.confirmPassword.length > 0;

    return (
      <div className="row">
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Note"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Password changed Successfully</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
          <div className="bckgImage">
            <img
              className="img-fluid logo"
              src={require("../assets/Logo.svg")}
            />
            <div className="logo-svg">agent</div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
          <form>
            <MuiThemeProvider>
              <div className="resetPassMargin">
                <div className="resetPassWordText">RESET PASSWORD</div>
                <div className="row">
                  <div className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline">
                    <img
                      className="userIconInResetPass"
                      src={require("../assets/user_id.png")}
                    />
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-5 col-5 displayInline">
                    <TextField
                      style={{ marginLeft: "10px", width: "240px" }}
                      hintText="Enter your User Id"
                      floatingLabelText="User Id *"
                      name="userId"
                      value={window.localStorage.getItem("userId")}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline">
                    <img
                      className="passIconInResetPass"
                      src={require("../assets/password1.jfif")}
                    />
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-5 col-5 displayInline">
                    <TextField
                      style={{ marginLeft: "10px", width: "240px" }}
                      hintText="Enter your Password"
                      type="password"
                      autoComplete="off"
                      floatingLabelText="Default Password *"
                      required={true}
                      name="password1"
                      onBlur={event => this.requiredValidation(event)}
                      errorText={this.state.errorpassword1}
                      onChange={(event, newValue) =>
                        this.setState({ defaultPassword: newValue })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline">
                    <img
                      className="passIconInResetPass"
                      src={require("../assets/password1.jfif")}
                    />
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-5 col-5 displayInline">
                    <TextField
                      style={{ marginLeft: "10px", width: "240px" }}
                      hintText="Enter your Password"
                      type="password"
                      floatingLabelText="New Password *"
                      required={true}
                      autoComplete="off"
                      name="password2"
                      pattern="(?=^.{6,8}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$"
                      onInput={event => this.passwordValidate(event)}
                      onBlur={event => this.requiredValidation(event)}
                      errorText={this.state.errorpassword2}
                      onChange={(event, newValue) =>
                        this.setState({ newPassword: newValue })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline">
                    <img
                      className="passIconInResetPass"
                      src={require("../assets/password1.jfif")}
                    />
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-5 col-5 displayInline">
                    <TextField
                      style={{ marginLeft: "10px", width: "240px" }}
                      hintText="Enter your Password"
                      type="password"
                      floatingLabelText="Confirm Password *"
                      required={true}
                      autoComplete="off"
                      pattern="(?=^.{6,8}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$"
                      name="password3"
                      onInput={event => this.passwordValidate(event)}
                      onBlur={event => this.requiredValidation(event)}
                      onChange={(event, newValue) =>
                        this.setState({ confirmPassword: newValue })
                      }
                      errorText={this.state.errorpassword3}
                    />
                  </div>
                </div>
                <div className="row">
                  <Button
                    color="danger"
                    className="resetPassSubmitBtn"
                    disabled={
                      !enabled ||
                      this.state.validateforNewPassword ||
                      this.state.validateforConfirmPassword
                    }
                    onClick={this.handleClick}
                  >
                    Submit
                  </Button>
                </div>

                {error && <div className="resetPassErrorStyle">{error}</div>}
              </div>
            </MuiThemeProvider>
          </form>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
