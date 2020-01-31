import { css } from "@emotion/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { FadeLoader } from "react-spinners";
import { Button } from "reactstrap";
import Cookies from "js-cookie";
const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      email: "",
      errorTextMessage: "",
      loading: false,
      error: "",
      open: false
    };
  }
  result() {
    const path = "/";
    browserHistory.push(path);
  }
  handleClose = () => {
    this.setState({ open: false });
    const path = "/restPassword";
    browserHistory.push(path);
  };
  handleClick() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    this.setState({ error: "" });

    this.setState({ loading: true });
    axios
      .post(
        dotenv.API_ROOT + "/agents/forgotpassword",
        {
          userId: this.state.email
        },
        config
      )
      .then(response => {
        if (response.data.response.responsecode == 700) {
          window.localStorage.setItem("userId", this.state.email);
          this.setState({ loading: false });
          this.setState({ open: true });
        } else if (response.data.response.responseCode == 800) {
          this.setState({ loading: false });
          this.setState({ error: response.data.response.message });
        } else {
          this.setState({ error: response.data.response.message });
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        if (error.response) {
          this.setState({ error: error.response.data.error.message });
        } else {
          this.setState({ error: "Unable to reach Server" });
        }
      });
  }

  requiredValidation(state) {
    if (state.target.value == "" && state.target.value.length == 0) {
      this.setState({ errorTextMessage: "This field is required" });
    } else {
      this.setState({ errorTextMessage: "" });
    }
  }

  render() {
    const { fullScreen } = this.props;

    const { error } = this.state;

    const enabled = this.state.email.length > 0;
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
            <DialogContentText>
              Default Password sent to registered email ID
            </DialogContentText>
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
        <MuiThemeProvider>
          <div className="col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="forgotPassMargin">
              <div className="forgotPasswordTextP">FORGOT PASSWORD</div>

              <div className="row">
                <div className="col-lg-1 colmd-1 col-sm-1 col-1 displayInline">
                  <img
                    className="userIconInForgotPass"
                    src={require("../assets/user_id.png")}
                  />
                </div>
                <div className="col-lg-5 col-md-5 col-sm-5 col-5 displayInline">
                  <TextField
                    style={{ marginLeft: "10px", width: "220px" }}
                    hintText="Enter your User Id"
                    floatingLabelText="User Id *"
                    required={true}
                    autoComplete="off"
                    onBlur={event => this.requiredValidation(event)}
                    errorText={this.state.errorTextMessage}
                    onChange={(event, newValue) =>
                      this.setState({ email: newValue })
                    }
                  />
                </div>
              </div>
              <div className=" col-lg-12 col-md-12 col-sm-12 col-12">
                {" "}
                <Button
                  color="danger"
                  className="forgotPassSubmitBtn"
                  disabled={!enabled}
                  onClick={this.handleClick}
                >
                  Submit
                </Button>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <a onClick={this.result}>
                  <div className="BackToLoginDiv">
                    <img
                      style={{ width: "15px", marginRight: "8px" }}
                      src={require("../assets/left-arrow.svg")}
                    />
                    <span style={{ color: "#808080", fontWeight: "bold" }}>
                      Back to Login
                    </span>
                  </div>
                </a>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                {error && <div className="forgotPassErrorStyle">{error}</div>}
              </div>
            </div>
          </div>

          <div className="sweet-loading" style={{ marginLeft: "-20%" }}>
            <FadeLoader
              css={override}
              sizeUnit={"px"}
              size={150}
              color={"#123abc"}
              loading={this.state.loading}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
ForgotPassword.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withMobileDialog()(ForgotPassword);
