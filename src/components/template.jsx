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

let valid;
let accountNumberValid;
let errorTextAccountNumber;

let enabled;
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
class Template extends Component {
  constructor(props) {
    super(props);

    this.route = this.route.bind(this);

    this.state = {
      number: "",
      accountLimit: "",
      transactionLimit: "",
      templateNumber: "",
      merchantTemplate: false,
      payerTemplate: false,
      statementFrequency: "",
      settlementFrequency: "",
      errorTextNumber: "",
      selectedOption: "option1",
      checkNumber: false,
      open: false
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    // this.handleClick()
  }
  handleClick() {}

  checkMobile() {}

  handleOptionChange = changeEvent => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  validateNumber(event) {
    errorTextAccountNumber = "";
    switch (event.target.name) {
      case "accountNumber": {
        if (event.target.validity.valid) {
          accountNumberValid = true;
          errorTextAccountNumber = "";
        } else if (event.target.value.length == 0) {
          errorTextAccountNumber = "This field is required";
        } else {
          accountNumberValid = false;
          errorTextAccountNumber = "Must be Numeric";
        }
        break;
      }

      default:
        break;
    }
  }

  route(number) {
    if (this.state.selectedOption === "option2") {
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .get(
          dotenv.API_ROOT_CONFIG +
            "/configs/merchantTemplate?templateNumber=" +
            this.state.number,
          config
        )
        .then(response => {
          if (response.status == "200") {
            if (response.data.response) {
              if (response.data.response.responseCode == 700) {
                window.localStorage.setItem(
                  "templateNumber",
                  response.data.response.message[0].templateNumber
                );
                const path = "/merchantTemplate";
                browserHistory.push({
                  pathname: path
                });
              } else if (
                response.data.response.message === "Template Not Found"
              ) {
                this.setState({ open: true });
                this.setState({ merchantTemplate: true });
                this.setState({ payerTemplate: false });
              }
            }
            if (response.data.message == "Invalid Token") {
              const path = "/";
              browserHistory.push({
                pathname: path
              });
            }
          }
        })
        .catch(error => {
          if (error.response) {
            this.setState({ error: error.response.data.error.message });
          } else {
            this.setState({ error: "Unable to reach Server" });
          }
        });
    } else if (this.state.selectedOption === "option1") {
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .get(
          dotenv.API_ROOT_CONFIG +
            "/configs/payerTemplate?templateNumber=" +
            this.state.number,
          config
        )
        .then(response => {
          if (response.status == "200") {
            if (response.data.response) {
              if (response.data.response.responseCode == 700) {
                window.localStorage.setItem(
                  "accountLimit",
                  response.data.response.message[0].accountLimit
                );
                window.localStorage.setItem(
                  "transactionLimit",
                  response.data.response.message[0].transactionLimit
                );
                window.localStorage.setItem(
                  "templateNumber",
                  response.data.response.message[0].templateNumber
                );
                const path = "/payerTemplate";
                browserHistory.push({
                  pathname: path,
                  state: {
                    accountLimit:
                      response.data.response.message[0].accountLimit,
                    transactionLimit:
                      response.data.response.message[0].transactionLimit,
                    templateNumber:
                      response.data.response.message[0].templateNumber
                  }
                });
              } else if (
                response.data.response.message === "Template Not Found"
              ) {
                this.setState({ open: true });
                this.setState({ merchantTemplate: false });
                this.setState({ payerTemplate: true });
              }
            }
            if (response.data.message == "Invalid Token") {
              const path = "/";
              browserHistory.push({
                pathname: path
              });
            }
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

  render() {
    const { classes, theme, fullScreen } = this.props;

    enabled = this.state.number.length > 0;

    return (
      <div className="col-md-12">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {(() => {
            if (this.state.payerTemplate === true) {
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
                      Payer Template not found
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

            if (this.state.merchantTemplate === true) {
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
                      Merchant Template not found
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
            <MDBCard className="templateCardView">
              <MDBCardBody>
                <MDBCardTitle className="">Template Accounts</MDBCardTitle>

                <MuiThemeProvider>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="col-lg-1 col-md-1 col-sm-1 col-1 templateAccountIcon displayInline">
                        <img
                          style={{ width: "19px" }}
                          src={require("../assets/template_number.png")}
                        />
                      </div>
                      <div className="col-lg-5 col-md-5 col-sm-5 col-5 displayInline">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px", width: "220px" }}
                          type="text"
                          hintText="Template Account Number"
                          floatingLabelText="Template Account Number *"
                          required={true}
                          pattern="[0-9]*"
                          autoComplete="off"
                          // errorText="error"
                          onInput={e => this.validateNumber(e)}
                          name="accountNumber"
                          pattern="[0-9]*"
                          errorText={errorTextAccountNumber}
                          onChange={(event, newValue) =>
                            this.setState({ number: newValue })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-4 col-6">
                      <label className="payerInTemplate">
                        <Radio
                          checked={this.state.selectedOption === "option1"}
                          onChange={this.handleOptionChange}
                          value="option1"
                          color="default"
                          name="radio-button-demo"
                          aria-label="D"
                        />
                        Payer
                      </label>
                    </div>

                    <div className="col-lg-3 col-md-3 col-sm-4 col-6">
                      <label className="merchantInTemplate">
                        <Radio
                          checked={this.state.selectedOption === "option2"}
                          onChange={this.handleOptionChange}
                          value="option2"
                          color="default"
                          name="radio-button-demo"
                          aria-label="D"
                        />
                        Merchant
                      </label>
                    </div>
                  </div>
                  <div className="col=lg-12 col-md-12 col-sm-12 col-12">
                    <Button
                      color="danger"
                      className="templateAccountSubmit"
                      onClick={() => this.route(this.state.number)}
                      disabled={!enabled || !accountNumberValid}
                    >
                      Submit
                    </Button>
                  </div>
                </MuiThemeProvider>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </main>
      </div>
    );
  }
}

Template.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withStyles(styles, { withTheme: true })(Template);
