import { css } from "@emotion/core";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import { withStyles } from "@material-ui/core/styles";
import { browserHistory } from "react-router";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBDataTable
} from "mdbreact";
import React, { Component } from "react";
import { FadeLoader } from "react-spinners";
import { Button } from "reactstrap";
import DashBoard from "./dashboard";
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

let item = window.localStorage.getItem("mobile");
let defaultNumberValid;
let accountLimitValid;
let transactionLimitValid;
let errorTextNumber;
let errorTextaccountLimit;
let errorTextTransactionLimit;
let errorTextTemplateName;
let fieldDecider = false;
var a = [3];
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
class Settlements extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      transactionLimit: "",
      defaultNumber: "",
      templateName: "",
      accountLimit: "",
      option: false,
      merchantSettlements: "",
      checkChange: false,
      enableOtp: true,
      loading: false,
      open: false,
      otpNumber: "",
      AmmountSettled: false,
      invaliOtpError: false,
      otpSent: false
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };
  handleClose1 = () => {
    this.setState({ open: false });
    window.location.reload();
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
    this.handleClick();
  }
  handleClick() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    let merchantDetails1 = [];
    axios
      .post(
        dotenv.API_ROOT_SLTMNT + "/settlements/getSettlements" + "?auth=Agent",
        {
          mobileNumber: window.localStorage.getItem("mobile")
        },
        config
      )
      .then(response => {
        if (response.status == 200) {
          if (response.data.response) {
            if (response.data.response.message != "Invalid Token") {
              this.setState({
                merchantNames:
                  response.data.settlements[
                    response.data.settlements.length - 1
                  ].merchantName
              });
            }
          }
          if (response.data.message) {
            if (response.data.message != "Invalid Token") {
              this.setState({
                merchantNames:
                  response.data.settlements[
                    response.data.settlements.length - 1
                  ].merchantName
              });
            }
          }
        }

        if (response.data.message) {
          if (response.data.message == "Invalid Token") {
            const path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        }
        if (response.data.response) {
          if (response.data.response.message == "Invalid Token") {
            const path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        } else {
          for (let i = 0; i < response.data.settlements.length - 1; i++) {
            if (response.data.settlements[i].isSettled == true) {
              response.data.settlements[i].isSettled = "Yes";
            } else {
              response.data.settlements[i].isSettled = "No";
            }
            merchantDetails1.push(response.data.settlements[i]);
          }
          this.setState({ merchantSettlements: merchantDetails1 });
        }
      })
      .catch(error => {
        if (error.response) {
          this.setState({ error: error.response.data.error.message });
        } else {
          this.setState({ error: "Unable to reach Server" });
        }
      });

    // this.setState({ statements: statementList });
    // this.setState({ settlements: settlementList });
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
        if (event.target.validity.valid) {
          accountLimitValid = true;
          errorTextaccountLimit = "";
        } else if (event.target.value.length == 0) {
          errorTextaccountLimit = "This field is required";
        } else {
          accountLimitValid = false;
          errorTextaccountLimit = "Must be Numeric";
        }
        break;
      }

      case "transactionLimit": {
        if (event.target.validity.valid) {
          transactionLimitValid = true;
          errorTextTransactionLimit = "";
        } else if (event.target.value.length == 0) {
          errorTextTransactionLimit = "This field is required";
        } else {
          transactionLimitValid = false;
          errorTextTransactionLimit = "Must be Numeric";
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
  changeState() {
    this.setState({ checkChange: true });
  }

  getotpField(key, t, a, i, state, rows, otpNumber) {
    this.setState({ rowData: rows[i] });
    this.setState({ loading: true });
    // alert(this.state.otpNumber);
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .post(
        dotenv.API_ROOT_SLTMNT + "/settlements/sendOTP?auth=Agent",
        {
          mobileNumber: window.localStorage.getItem("mobile")
        },
        config
      )
      .then(response => {
        if (response.data.response) {
          if (response.data.response.responseCode == 700) {
            this.setState({ loading: false });
            this.setState({ open: true });
            this.setState({ otpSent: true });
          } else if (response.data.response.message == "Invalid Token") {
            const path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        }
        if (response.data.message) {
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

    this.fieldDecider = true;

    for (let j = 0; j < rows.length; j++) {
      rows[j]["otp"] = <input disabled />;
      rows[j]["checkbox"] = (
        <Checkbox style={{ marginTop: "-15%" }} key={i} disabled />
      );
    }
    rows[i]["otp"] = (
      <input onChange={e => this.handleChangeSinglePost(e.target.value)} />
    );
    rows[i]["submit"] = (
      <Button onClick={(e, t, e1) => this.submit(rows[i])} color="danger">
        Submit
      </Button>
    );

    this.setState({ enableOtp: false });
  }

  handleChangeSinglePost(value) {
    this.setState({ otpNumber: value });
  }

  submit(data) {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .post(
        dotenv.API_ROOT_SLTMNT + "/settlements/confirmOTP?auth=Agent",
        {
          mobileNumber: window.localStorage.getItem("mobile"),
          otp: this.state.otpNumber,
          date: data.date.replace(/-0+/g, "-"),
          settledAmount: data.totalSettlement,
          agentName: window.localStorage.getItem("name")
        },
        config
      )
      .then(response => {
        if (response.status == 200) {
          if (response.data.response.message == "Invalid OTP") {
            this.setState({ invaliOtpError: true });
            this.setState({ AmmountSettled: false });
            this.setState({ open: true });
          } else {
            this.setState({ invaliOtpError: false });
            this.setState({ AmmountSettled: true });
            this.setState({ open: true });
          }
        }
        if (response.data.message) {
          if (response.data.message == "Invalid Token") {
            const path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        } else if (response.data.response) {
          if (response.data.response.message == "Invalid Token") {
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
    const data = {
      columns: [
        {
          label: "Date",
          field: "",
          sort: "asc",
          width: 150
        },
        {
          label:
            "Total Settlement" +
            "(" +
            window.localStorage.getItem("currencyImage") +
            ")",
          sort: "asc",
          field: "",
          width: 270
        },
        {
          label:
            "Credits" +
            "(" +
            window.localStorage.getItem("currencyImage") +
            ")",
          sort: "asc",
          field: "",
          width: 200
        },
        {
          label:
            "Debits  " +
            "(" +
            window.localStorage.getItem("currencyImage") +
            ")",
          sort: "asc",
          field: "",
          width: 100
        },
        {
          label: "Transaction Count",
          sort: "asc",
          field: "",
          width: 150
        },
        {
          label: "OTP Verified",
          sort: "asc",
          width: 100,
          field: ""
        },

        {
          label: "Verify",
          sort: "asc",
          width: 100,
          field: ""
        },

        {
          label: "OTP",
          sort: "asc",
          width: 100,
          field: ""
        },
        {
          label: "Submit",
          sort: "asc",
          width: 100,
          field: ""
        }
      ],
      rows: this.state.merchantSettlements
    };
    for (let i = 0; i < data.rows.length; i++) {
      if (data.rows[i].isSettled == "No") {
        if (!this.fieldDecider) {
          data.rows[i]["checkbox"] = (
            <Checkbox
              style={{ marginTop: "-15%" }}
              key={i}
              defaultChecked={this.state.checkChange}
              onChange={(e, t, e1) =>
                this.getotpField(e, t, e1, i, this.state, data.rows)
              }
            />
          );
        }
        if (!this.fieldDecider) {
          data.rows[i]["otp"] = (
            <input
              onChange={(event, newValue) =>
                this.setState({ otpNumber: newValue })
              }
              disabled
            />
          );
          data.rows[i]["submit"] = (
            <Button
              disabled
              onClick={(e, t, e1) => this.submit(data.rows[i])}
              color="danger"
            >
              Submit
            </Button>
          );
        }
      } else {
        //this.changeState();
        // this.setState({ checkChange: true });
        data.rows[i]["checkbox"] = (
          <Checkbox
            style={{ marginTop: "-15%" }}
            defaultChecked={true}
            disabled={true}
            key={i}
            onChange={(e, t, e1) => this.getotpField(e, t, e1, i)}
          />
        );

        data.rows[i]["otp"] = <input disabled />;
        data.rows[i]["submit"] = (
          <Button color="danger" disabled>
            Submit
          </Button>
        );
      }
    }

    let enabled;

    if (
      this.state.transactionLimit.length > 0 &&
      this.state.accountLimit.length > 0 &&
      this.state.defaultNumber.length > 0 &&
      this.state.templateName.length > 0
    ) {
      enabled = true;
    } else {
      enabled = false;
    }

    return (
      <div className="col-md-12">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {(() => {
            if (this.state.AmmountSettled === true) {
              return (
                <Dialog
                  fullScreen={fullScreen}
                  open={this.state.open}
                  onClose={this.handleClose1}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {"Note"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>Amount Settled</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={this.handleClose1}
                      color="primary"
                      autoFocus
                    >
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              );
            }

            if (this.state.invaliOtpError === true) {
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
                      Entered OTP is invalid
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
            if (this.state.otpSent === true) {
              return (
                <Dialog
                  fullScreen={fullScreen}
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {"Note"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      OTP sent to registered Mobile Number
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
            <MDBCard className="merchantSettlementCardView">
              <MDBCardBody>
                <MDBCardTitle className="merchantSettlementCardTitle">
                  Merchant Settlement
                </MDBCardTitle>

                <MuiThemeProvider>
                  <div className="container">
                    <div className="row">
                      <div className="col-md-6 col-sm-12 col-12">
                        <div className="col-md-1 col-sm-1 col-1 merchantSettlePhoneIconDiv">
                          <img
                            style={{ width: "19px" }}
                            src={require("../assets/template_number.png")}
                          />
                        </div>
                        <div className="col-md-8 col-sm-11 col-5 merchantMobileNumbDiv">
                          <TextField
                            style={{ width: "220px" }}
                            type="text"
                            hintText="Merchant Mobile "
                            floatingLabelText="Merchant Mobile "
                            pattern="[0-9]*"
                            autoComplete="off"
                            value={window.localStorage.getItem("mobile")}
                            errorText={errorTextNumber}
                            name="merchantNumber"
                            disabled
                            onInput={e => this.validateNumber(e)}
                            onChange={(event, newValue) =>
                              this.setState({ defaultNumber: newValue })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12 col-12">
                        <div className="col-md-1 col-sm-1 col-1 merchantSettlePhoneIconDiv">
                          <img
                            style={{ width: "19px" }}
                            src={require("../assets/template_name.png")}
                          />
                        </div>
                        <div className="col-md-8 col-sm-11 col-5 merchantMobileNumbDiv">
                          <TextField
                            style={{ width: "220px" }}
                            type="text"
                            autoComplete="off"
                            hintText="Merchant Name "
                            floatingLabelText="Merchant Name"
                            value={this.state.merchantNames}
                            disabled
                            errorText={errorTextTemplateName}
                            onInput={e => this.validateNumber(e)}
                            name="templateName"
                            onChange={(event, newValue) =>
                              this.setState({ templateName: newValue })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </MuiThemeProvider>
                <div style={{ marginTop: "2%" }}>
                  <span
                    style={{
                      color: "red",
                      fontSize: "12px",
                      fontWeight: "bold",
                      fontFamily: "Arial",
                      marginTop: "500px"
                    }}
                  >
                    *Click "Verify" to initiate Settlement for the specific date
                  </span>
                </div>

                <MDBDataTable
                  style={{ fontSize: "100px" }}
                  striped
                  bordered
                  sortable={false}
                  small
                  data={data}
                  entriesOptions={a}
                  entries="3"
                  responsive={true}
                />

                <div
                  className="sweet-loading"
                  style={{ marginLeft: "-5%", marginTop: "-8%" }}
                >
                  <FadeLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={"#123abc"}
                    loading={this.state.loading}
                  />
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Settlements);
