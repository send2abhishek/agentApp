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
import { browserHistory } from "react-router";
import { withStyles } from "@material-ui/core/styles";
const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};

let defaultNumberValid;
let accountLimitValid;
let transactionLimitValid;
let PromotionalBonusValid;

let errorTextNumber;
let errorTextaccountLimit;
let errorTextTransactionLimit;
let errorTextPromotionalBonus;
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
class PayerTemplate extends Component {
  constructor(props) {
    super(props);

    this.handleClick1 = this.handleClick1.bind(this);
    this.route = this.route.bind(this);

    this.state = {
      transactionLimit: 0,
      defaultNumber: window.localStorage.getItem("templateNumber"),
      accountLimit: 0,
      templateName: "Payer Template",
      open: false,
      promotionalBonus: 0,
      errorTextaccountLimit: "",
      errorTextTransactionLimit: "",
      errorTextPromotionalBonus: ""
    };
  }

  handleClose = () => {
    this.setState({ open: false });
    window.location.reload();
    //    const path = '/restPassword';
    //    browserHistory.push(path)
  };

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
          "/configs/payerTemplate?templateNumber=" +
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
                promotionalBonus: response.data.response.payerSignupBonus
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

  checkMobile() {}

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

      case "promotionalBonus": {
        if (event.target.validity.valid) {
          PromotionalBonusValid = true;
          this.setState({ errorTextPromotionalBonus: "" });
        } else if (event.target.value.length == 0) {
          this.setState({
            errorTextPromotionalBonus: "This field is required"
          });
        } else {
          PromotionalBonusValid = false;
          this.setState({ errorTextPromotionalBonus: "Must be Numeric" });
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
        dotenv.API_ROOT_CONFIG + "/configs/updatePayerTemplate",
        {
          templateNumber: this.state.defaultNumber,
          accountLimit: parseInt(this.state.accountLimit),
          transactionLimit: parseInt(this.state.transactionLimit),
          payerSignupBonus: parseInt(this.state.promotionalBonus)
        },
        config
      )
      .then(response => {
        if (response.status == "200") {
          if (response.data.reponse) {
            if (response.data.reponse.responseCode == 700) {
              this.setState({ open: true });
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

  render() {
    const { classes, theme, fullScreen } = this.props;

    let enabled = false;

    if (
      this.state.transactionLimit > 0 &&
      this.state.accountLimit > 0 &&
      this.state.promotionalBonus !== "" &&
      this.state.defaultNumber.length > 0 &&
      this.state.templateName.length > 0 &&
      this.state.errorTextaccountLimit == "" &&
      this.state.errorTextTransactionLimit == "" &&
      this.state.errorTextPromotionalBonus == ""
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
            <MDBCard className="payerTemplateCardView">
              <MDBCardBody>
                <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                  Payer Template Account
                </MDBCardTitle>

                <MuiThemeProvider>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 displayInline">
                      <div
                        className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline"
                        style={{ marginTop: "40px" }}
                      >
                        <img
                          style={{ width: "19px" }}
                          src={require("../assets/template_number.png")}
                        />
                      </div>

                      <div className="col-lg-8 col-md-8 col-sm-11 col-5 displayInline">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px", width: "220px" }}
                          type="text"
                          hintText="Default Account Number "
                          floatingLabelText="Default Account Number"
                          required={true}
                          autoComplete="off"
                          pattern="[0-9]*"
                          disabled
                          errorText={errorTextNumber}
                          name="defaultNumber"
                          value={this.state.defaultNumber}
                          onInput={e => this.validateNumber(e)}
                          onChange={(event, newValue) =>
                            this.setState({ defaultNumber: newValue })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 displayInline">
                      <div
                        className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline"
                        style={{ marginTop: "40px" }}
                      >
                        <img
                          style={{ width: "19px" }}
                          src={require("../assets/template_name.png")}
                        />
                      </div>

                      <div className="col-lg-8 col-md-8 col-sm-11 col-5 displayInline">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px", width: "220px" }}
                          type="text"
                          hintText="Payer Template Name "
                          floatingLabelText="Payer Template Name *"
                          required={true}
                          autoComplete="off"
                          disabled
                          value={this.state.templateName}
                          errorText={errorTextTemplateName}
                          onInput={e => this.validateNumber(e)}
                          value="Payer Template"
                          name="templateName"
                          onChange={(event, newValue) =>
                            this.setState({ templateName: newValue })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 displayInline">
                      <div
                        className="col-lg-2 col-md-3 col-sm-2 col-3 displayInline"
                        style={{ marginTop: "35px" }}
                      >
                        <span className="inr-symbol">
                          {window.localStorage.getItem("currencyImage")}
                        </span>
                      </div>

                      <div className="col-lg-8 col-md-8  col-sm-10 col-9 displayInline">
                        <TextField
                          className="payerAccountLimitInput"
                          style={{ marginTop: "0%", width: "220px" }}
                          type="text"
                          hintText="Account Limit "
                          floatingLabelText="Account Limit *"
                          required={true}
                          autoComplete="off"
                          errorText={this.state.errorTextaccountLimit}
                          name="accountLimit"
                          value={this.state.accountLimit}
                          pattern="[0-9]*"
                          onInput={e => this.validateNumber(e)}
                          onChange={(event, newValue) =>
                            this.setState({ accountLimit: newValue })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 displayInline">
                      <div
                        className="col-lg-2 col-md-3 col-sm-2 col-3 displayInline"
                        style={{ marginTop: "35px" }}
                      >
                        <span className="inr-symbol">
                          {window.localStorage.getItem("currencyImage")}
                        </span>
                      </div>
                      <div
                        className="col-lg-8 col-md-3 col-sm-10 col-9 displayInline"
                        style={{ marginLeft: "0%" }}
                      >
                        {" "}
                        <TextField
                          className="payerAccountLimitInput"
                          style={{ marginTop: "15%" }}
                          style={{ width: "220px" }}
                          type="text"
                          hintText="Transaction Limit "
                          floatingLabelText="Transaction Limit *"
                          required={true}
                          autoComplete="off"
                          pattern="[0-9]*"
                          value={this.state.transactionLimit}
                          errorText={this.state.errorTextTransactionLimit}
                          onInput={e => this.validateNumber(e)}
                          //onBlur={event => this.requiredValidation(event)}
                          name="transactionLimit"
                          onChange={(event, newValue) =>
                            this.setState({ transactionLimit: newValue })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row ">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                      {" "}
                      <div
                        className="col-lg-2 col-md-3 col-sm-2 col-3 displayInline"
                        style={{ marginTop: "35px" }}
                      >
                        <span className="inr-symbol">
                          {window.localStorage.getItem("currencyImage")}
                        </span>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-10 col-9 displayInline">
                        <TextField
                          className="payerAccountLimitInput"
                          style={{ marginTop: "15%" }}
                          style={{ width: "220px" }}
                          type="text"
                          hintText="Promotional Bonus "
                          floatingLabelText="Promotional Bonus *"
                          required={true}
                          autoComplete="off"
                          pattern="[0-9]*"
                          value={this.state.promotionalBonus}
                          errorText={this.state.errorTextPromotionalBonus}
                          onInput={e => this.validateNumber(e)}
                          name="promotionalBonus"
                          onChange={(event, newValue) =>
                            this.setState({ promotionalBonus: newValue })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12 col-12 ">
                    <Button
                      color="danger"
                      onClick={this.route.bind(this)}
                      className="payerTemplateSubmit"
                      disabled={enabled}
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

PayerTemplate.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(PayerTemplate);
