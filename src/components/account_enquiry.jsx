import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCol } from "mdbreact";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Button } from "reactstrap";
import DashBoard from "./dashboard";
import Cookies from "js-cookie";
import { withStyles } from "@material-ui/core/styles";

const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};

let merchantDetails = [];
const styles = theme => ({
  root: {
    display: "flex"
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  }
});
class AccountEnquiry extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      number: "",
      merchantDetails1: "",
      selectedOption: "option1",
      errorTextNumber: "",
      open: false,
      errorTextMerchant: false,
      errorTextPayer: false,
      lengthValid: false
    };
  }

  componentDidMount() {
    // this.handleClick()
  }

  handleClose = () => {
    this.setState({ open: false });
  };
  handleClick(number) {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    var path;
    window.localStorage.setItem("mobile", number);
    if (this.state.selectedOption === "option1") {
      axios
        .get(dotenv.API_ROOT_ACCTMGNT + "/accounts/77" + number + "?Ptype=PAndM", config)
        .then(response => {
          if (
            response.status == 200 &&
            response.data.message != "Invalid Token"
          ) {
            path = "/merchantAccountEnquiry";
            browserHistory.push({
              pathname: path
            });
          } else if (response.data.message == "Invalid Token") {
            const path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        })
        .catch(error => {
          if (error.response) {
            this.setState({ open: true });
            this.setState({ errorTextMerchant: true });
            this.setState({ errorTextPayer: false });

            // this.setState({ error: error.response.data.error.message });
          } else {
            this.setState({ error: "Unable to reach Server" });
          }
        });
    } else if (this.state.selectedOption === "option2") {
      axios
        .get(dotenv.API_ROOT_ACCTMGNT + "/accounts/80" + number + "?Ptype=PAndM", config)
        .then(response => {
          if (
            response.status == 200 &&
            response.data.message != "Invalid Token"
          ) {
            this.setState({ open: true });
            this.setState({ errorTextPayer: true });
            path = "/payerAccountEnquiry";
            browserHistory.push({
              pathname: path
            });
          } else if (response.data.message == "Invalid Token") {
            const path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        })
        .catch(error => {
          if (error.response) {
            this.setState({ open: true });
            this.setState({ errorTextPayer: true });
            this.setState({ errorTextMerchant: false });

            // this.setState({ error: error.response.data.error.message });
          } else {
            this.setState({ error: "Unable to reach Server" });
          }
        });
    }
  }

  checkMobile() {}

  handleOptionChange = changeEvent => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  validateNumber(event) {
    if (event.target.validity.valid) {
      this.setState({ errorTextNumber: "" });
      this.setState({ validate: false });
      this.setState({ lengthValid: true });
    } else {
      this.setState({ errorTextNumber: "Must be Numeric" });
      this.setState({ validate: true });
    }
  }

  requiredValidation(state) {
    if (state.target.value == "" && state.target.value.length == 0) {
      this.setState({ errorTextNumber: "This field is required" });
    } else if (state.target.value.length > 0) {
      if (this.state.validate == true) {
        this.setState({ errorTextNumber: "Must be Numeric" });
      }
    } else {
      this.setState({ errorTextNumber: "" });
    }
  }

  render() {
    const { classes, theme, fullScreen } = this.props;

    const enabled = this.state.number.length > 0;

    return (
      <div className="col-md-12">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {(() => {
            if (this.state.errorTextMerchant === true) {
              return (
                <Dialog
                  fullScreen={fullScreen}
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {"Error"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Merchant Account not found
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={this.handleClose}
                      color="primary"
                      autoFocus
                    >
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              );
            }

            if (this.state.errorTextPayer === true) {
              return (
                <Dialog
                  fullScreen={fullScreen}
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {"Error"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Payer Account not found
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={this.handleClose}
                      color="primary"
                      autoFocus
                    >
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              );
            }
          })()}
          <DashBoard />
          <MDBCol>
            <MDBCard className="accountEnquirycardView">
              <MDBCardBody>
                <MDBCardTitle className="accountEnquiryCardTitle">
                  Account Enquiry
                </MDBCardTitle>

                <MuiThemeProvider>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 col-12 displayInline">
                      <div
                        className="col-md-1 col-sm-1 col-1 displayInline"
                        style={{ marginTop: "40px" }}
                      >
                        <img
                          style={{ width: "19px" }}
                          src={require("../assets/mobile_number.jpg")}
                        />
                      </div>
                      <div className="col-md-5 col-sm-5 col-5 displayInline">
                        <TextField
                          style={{ marginTop: "0%" }}
                          // style={{ marginLeft: "10px", width: "220px" }}
                          className="textFieldMargin"
                          hintText="Enter Number"
                          floatingLabelText="Mobile Number *"
                          required={true}
                          name="number"
                          pattern="[0-9]*"
                          maxlength="10"
                          autoComplete="off"
                          onInput={e => this.validateNumber(e)}
                          onBlur={event => this.requiredValidation(event)}
                          errorText={this.state.errorTextNumber}
                          onChange={(event, newValue) =>
                            this.setState({ number: newValue })
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="col-md-3 col-sm-6 col-6 accountLabel"
                      style={{ marginTop: "3%" }}
                    >
                      <label className="merchantLabelInAccount">
                        <Radio
                          checked={this.state.selectedOption === "option1"}
                          onChange={this.handleOptionChange}
                          value="option1"
                          color="default"
                          name="radio-button-demo"
                          aria-label="D"
                        />
                        Merchant
                      </label>
                    </div>
                    <div
                      className="col-md-3 col-sm-6 col-6 accountLabel"
                      style={{ marginTop: "3%" }}
                    >
                      <label className="payerLabelInAccount">
                        <Radio
                          checked={this.state.selectedOption === "option2"}
                          onChange={this.handleOptionChange}
                          value="option2"
                          color="default"
                          name="radio-button-demo"
                          aria-label="D"
                        />
                        Payer
                      </label>
                    </div>
                  </div>
                </MuiThemeProvider>
                <div className="row ">
                  <div className="col-12">
                    <Button
                      color="danger"
                      onClick={() => this.handleClick(this.state.number)}
                      className="accountSubmit"
                      disabled={!enabled || this.state.validate}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </main>
      </div>
    );
  }
}
AccountEnquiry.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(AccountEnquiry);
