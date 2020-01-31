import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCol } from "mdbreact";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button } from "reactstrap";
import DashBoard from "./dashboard";
import Cookies from "js-cookie";
import { withStyles } from "@material-ui/core/styles";
import { browserHistory } from "react-router";
const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};

let merchantDetails = [];
let defaultNumberValid;
let accountLimitValid;
let transactionLimitValid;
let errorTextNumber;
let errorTextaccountLimit;
let errorTextTransactionLimit;
let errorTextTemplateName;

const css = `
.inr-symbol{
  font-size: 20px;
  color:#000;
}
`;
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
class MerchantTemplate extends Component {
  constructor(props) {
    super(props);

    this.handleClick1 = this.handleClick1.bind(this);
    // this.route = this.route.bind(this)

    this.state = {
      transactionLimit: "",
      defaultNumber: window.localStorage.getItem("templateNumber"),
      accountLimit: "",
      statementFrequency: "",
      settlementFrequency: "",
      templateName: "Merchant Template",
      errorTextaccountLimit: "",
      errorTextTransactionLimit: "",

      open: false
    };
  }

  componentDidMount() {
    window.localStorage.getItem("currency");

    if (window.localStorage.getItem("currency") == "AUD") {
      window.localStorage.setItem("currencyImage", "A$");
    } else if (window.localStorage.getItem("currency") == "INR") {
      window.localStorage.setItem("currencyImage", "₹");
    } else if (window.localStorage.getItem("currency") == "USD") {
      window.localStorage.setItem("currencyImage", "$");
    } else if (window.localStorage.getItem("currency") == "AED") {
      window.localStorage.setItem("currencyImage", "د.إ");
    } else if (window.localStorage.getItem("currency") == "EUR") {
      window.localStorage.setItem("currencyImage", "€");
    } else if (window.localStorage.getItem("currency") == "GBP") {
      window.localStorage.setItem("currencyImage", "£");
    } else if (window.localStorage.getItem("currency") == "THB") {
      window.localStorage.setItem("currencyImage", "฿");
    } else if (window.localStorage.getItem("currency") == "SGD") {
      window.localStorage.setItem("currencyImage", "S$");
    }
    this.handleClick1();
  }
  handleClick1() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .get(
        dotenv.API_ROOT_CONFIG +
          "/configs/merchantTemplate?templateNumber=" +
          this.state.defaultNumber,
        config
      )
      .then(response => {
        if (response.status == "200") {
          if (response.data.response) {
            if (response.data.response.responseCode == 700) {
              this.setState({
                accountLimit: response.data.response.message[0].accountLimit
              });
              this.setState({
                transactionLimit:
                  response.data.response.message[0].transactionLimit
              });
              this.setState({
                templateNumber: response.data.response.message[0].templateNumber
              });
              this.setState({
                statementFrequency:
                  response.data.response.message[0].statementFrequency
              });
              this.setState({
                settlementFrequency:
                  response.data.response.message[0].settlementFrequency
              });
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

  validateNumber(event) {
    switch (event.target.name) {
      case "defaultNumber": {
        if (event.target.validity.valid) {
          defaultNumberValid = true;
          errorTextNumber = "";
        } else if (event.target.value.length == 0) {
          errorTextNumber = "This field is required";
        } else {
          defaultNumberValid = false;
          errorTextNumber = "Must be Numeric";
        }
        break;
      }

      case "accountLimit": {
        if (event.target.value.length == 0) {
          this.setState({ errorTextaccountLimit: "This field is required" });
        } else if (isNaN(event.target.value)) {
          this.setState({ errorTextaccountLimit: "Must be Numeric " });
        } else if (
          this.state.transactionLimit.toString().length > 0 &&
          !isNaN(this.state.transactionLimit) &&
          parseInt(this.state.transactionLimit) >= parseInt(event.target.value)
        ) {
          this.setState({
            errorTextaccountLimit:
              "Account limit should be greater than Transaction limit"
          });
        } else if (
          event.target.validity.valid &&
          this.state.transactionLimit != "" &&
          !isNaN(this.state.transactionLimit) &&
          parseInt(event.target.value) > parseInt(this.state.transactionLimit)
        ) {
          this.setState({ errorTextaccountLimit: "" });
          this.setState({ errorTextTransactionLimit: "" });
        } else if (event.target.validity.valid) {
          this.setState({ errorTextaccountLimit: "" });
        }
        break;
      }

      case "transactionLimit": {
        if (event.target.value.length == 0) {
          this.setState({});
          this.setState({
            errorTextTransactionLimit: "This field is required"
          });
        } else if (isNaN(event.target.value)) {
          this.setState({ errorTextTransactionLimit: "Must be Numeric " });
        } else if (
          this.state.accountLimit.toString().length > 0 &&
          !isNaN(this.state.accountLimit) &&
          parseInt(this.state.accountLimit) <= parseInt(event.target.value)
        ) {
          this.setState({
            errorTextTransactionLimit:
              " Transaction limit should be less than Account limit"
          });
        } else if (
          event.target.validity.valid &&
          this.state.accountLimit != "" &&
          !isNaN(this.state.accountLimit) &&
          parseInt(event.target.value) < parseInt(this.state.accountLimit)
        ) {
          this.setState({ errorTextaccountLimit: "" });
          this.setState({ errorTextTransactionLimit: "" });
        } else if (event.target.validity.valid) {
          this.setState({ errorTextTransactionLimit: "" });
        }
        break;
      }

      case "templateName": {
        if (event.target.value.length == 0) {
          errorTextTemplateName = "This field is required";
        } else {
          errorTextTemplateName = "";
        }
        break;
      }

      default:
        break;
    }
  }

  route() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .post(
        dotenv.API_ROOT_CONFIG + "/configs/updateMerchantTemplate",
        {
          templateNumber: this.state.defaultNumber,
          accountLimit: parseInt(this.state.accountLimit),
          transactionLimit: parseInt(this.state.transactionLimit),
          statmentFrequency: this.state.statementFrequency,
          settlementFrequency: this.state.settlementFrequency
        },
        config
      )
      .then(response => {
        if (response.status == "200") {
          if (response.data.reponse) {
            if (response.data.reponse.responseCode == 700) {
              this.setState({ open: true });
            }
            if (response.data.message == "Invalid Token") {
              const path = "/";
              browserHistory.push({
                pathname: path
              });
            }
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
  handleClose = () => {
    this.setState({ open: false });
    window.location.reload();
  };

  render() {
    const { classes, theme, fullScreen } = this.props;
    let enabled;

    if (
      JSON.stringify(this.state.transactionLimit).length > 0 &&
      JSON.stringify(this.state.accountLimit).length > 0 &&
      this.state.errorTextaccountLimit == "" &&
      this.state.errorTextTransactionLimit == ""
    ) {
      enabled = false;
    } else {
      enabled = true;
    }

    return (
      <div className="col-md-12">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <style>{css}</style>
          <Dialog
            fullScreen={fullScreen}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">{"Note"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Template Updated Successfully
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <DashBoard />
          <MDBCol>
            <MDBCard className="merchantTemplateCardView">
              <MDBCardBody>
                <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                  Merchant Template Account
                </MDBCardTitle>

                <MuiThemeProvider>
                  <div className="row ">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div
                        className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline"
                        style={{ marginTop: "10%" }}
                      >
                        <img
                          style={{ width: "19px" }}
                          src={require("../assets/template_number.png")}
                        />
                      </div>

                      <div className="col-lg-8 col-md-8 col-sm-5 col-5 displayInline">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px", width: "220px" }}
                          type="text"
                          hintText="Default Account Number "
                          floatingLabelText="Default Account Number"
                          required={true}
                          pattern="[0-9]*"
                          autoComplete="off"
                          value={this.state.defaultNumber}
                          errorText={errorTextNumber}
                          name="defaultNumber"
                          disabled
                          onInput={e => this.validateNumber(e)}
                          onChange={(event, newValue) =>
                            this.setState({ defaultNumber: newValue })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div
                        className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline"
                        style={{ marginTop: "10%" }}
                      >
                        <img
                          style={{ width: "19px" }}
                          src={require("../assets/template_name.png")}
                        />
                      </div>

                      <div className="col-lg-8 col-md-8 col-sm-5 col-5 displayInline">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px", width: "220px" }}
                          type="text"
                          hintText="Merchant Template Name "
                          floatingLabelText="Merchant Template Name *"
                          required={true}
                          autoComplete="off"
                          disabled
                          value="Merchant Template"
                          errorText={errorTextTemplateName}
                          name="templateName"
                          onChange={(event, newValue) =>
                            this.setState({ templateName: newValue })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                      <div
                        className="col-lg-2 col-md-3 col-sm-1 col-3 displayInline"
                        style={{ marginTop: "11%" }}
                      >
                        <span
                          className="inr-symbol"
                          // style={{ marginLeft: "5%" }}
                        >
                          {window.localStorage.getItem("currencyImage")}
                        </span>{" "}
                      </div>
                      <div className="col-lg-4 col-md-3 col-sm-5 col-8 displayInline">
                        {" "}
                        <TextField
                          style={{ marginTop: "15%", width: "220px" }}
                          className="MerchantAccountLimitInput"
                          type="text"
                          hintText="Account Limit "
                          floatingLabelText="Account Limit *"
                          required={true}
                          autoComplete="off"
                          errorText={this.state.errorTextaccountLimit}
                          value={this.state.accountLimit}
                          name="accountLimit"
                          pattern="[0-9]*"
                          onInput={e => this.validateNumber(e)}
                          onChange={(event, newValue) =>
                            this.setState({ accountLimit: newValue })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                      <div
                        className="col-lg-2 col-md-3 col-sm-2 col-3 displayInline"
                        style={{ marginTop: "11%" }}
                      >
                        <span
                          className="inr-symbol"
                          // style={{ marginLeft: "8%" }}
                        >
                          {window.localStorage.getItem("currencyImage")}
                        </span>
                      </div>
                      <div
                        className="col-lg-4 col-md-3 col-sm-5 col-9 displayInline"
                        // style={{ marginLeft: "-8%" }}
                      >
                        {" "}
                        <TextField
                          style={{ marginTop: "15%", width: "220px" }}
                          type="text"
                          className="MerchantAccountLimitInput"
                          hintText="Transaction Limit "
                          floatingLabelText="Transaction Limit *"
                          required={true}
                          autoComplete="off"
                          pattern="[0-9]*"
                          value={this.state.transactionLimit}
                          errorText={this.state.errorTextTransactionLimit}
                          onInput={e => this.validateNumber(e)}
                          name="transactionLimit"
                          onChange={(event, newValue) =>
                            this.setState({ transactionLimit: newValue })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                      <div
                        className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline"
                        style={{ marginTop: "9%" }}
                      />
                      <div className="col-lg-8 col-md-8 col-sm-5 col-5 displayInline">
                        <TextField
                          style={{ marginLeft: "10px", width: "220px" }}
                          type="text"
                          hintText="Statements & Settlements"
                          autoComplete="off"
                          floatingLabelText="Statements & Settlements"
                          disabled
                          value={this.state.settlementFrequency}
                          name="settlementFrequency"
                        />
                      </div>
                    </div>
                  </div>
                  {
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <Button
                        color="danger"
                        className="merchantTemplateSubmit"
                        onClick={this.route.bind(this)}
                        disabled={enabled}
                      >
                        Submit
                      </Button>
                    </div>
                  }
                </MuiThemeProvider>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </main>
      </div>
    );
  }
}

MerchantTemplate.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withStyles(styles, { withTheme: true })(MerchantTemplate);
