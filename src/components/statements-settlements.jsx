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
class StatementsSettlements extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      number: "",
      merchantDetails1: "",
      selectedOption: "option1",
      errorTextNumber: "",
      open: false,
      validate: false,
      statementError: false,
      settlementError: false,
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
    merchantDetails = [];
    var path;
    window.localStorage.setItem("mobile", number);
    if (this.state.selectedOption === "option1") {
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .get(
          dotenv.API_ROOT_TXNMGNT +
            "/Transactions/getStatementsForMerchant?mobileNumber=" +
            number +
            "&auth=Payer",

          config
        )
        .then(response => {
          if (
            response.status == 200 &&
            response.data.message != "Invalid Token"
          ) {
            if (
              response.data.responseCode == 800 &&
              response.data.message != "Invalid Token"
            ) {
              this.setState({ open: true });
              this.setState({ settlementError: false });
              this.setState({ statementError: true });
            } else if (response.data.message == "Invalid Token") {
              path = "/";
              browserHistory.push({
                pathname: path
              });
            } else {
              this.setState({ statementError: false });
              this.setState({ open: false });
              path = "/statements";
              browserHistory.push({
                pathname: path
              });
            }
          } else if (response.data.message == "Invalid Token") {
            path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        })
        .catch(error => {
          if (error.response) {
            this.setState({ error: error.response.data.error.message });
          } else {
            this.setState({ error: "Unable to reach Server" });
          }
        });
    } else if (this.state.selectedOption === "option2") {
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .post(
          dotenv.API_ROOT_SLTMNT + "/settlements/getSettlements" + "?auth=Agent",
          {
            mobileNumber: number
          },
          config
        )
        .then(response => {
          if (
            response.data.responseCode == 800 &&
            response.data.message != "Invalid Token"
          ) {
            this.setState({ open: true });
            this.setState({ settlementError: true });
            this.setState({ statementError: false });
          } else if (response.data.message == "Invalid Token") {
            path = "/";
            browserHistory.push({
              pathname: path
            });
          } else {
            this.setState({ settlementError: false });
            this.setState({ open: false });
            path = "/settlements";
            browserHistory.push({
              pathname: path
            });
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
  }

  checkMobile() {}

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

  handleOptionChange = changeEvent => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

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

    // const data = {
    //   columns: [
    //     {
    //       label: "Debit Account",
    //       field: "debitAccount",
    //       sort: "asc",
    //       width: 150
    //     },
    //     {
    //       label: "Credit Account",
    //       field: "creditAccount",
    //       sort: "asc",
    //       width: 270
    //     },
    //     {
    //       label: "Amount",
    //       field: "amount",
    //       sort: "asc",
    //       width: 200
    //     },
    //     {
    //       label: "Transaction Date and Time",
    //       field: "transactionDateAndTime",
    //       sort: "asc",
    //       width: 100
    //     },
    //     {
    //       label: "Status",
    //       field: "status",
    //       sort: "asc",
    //       width: 150
    //     },
    //     {
    //       label: "ID",
    //       field: "status",
    //       sort: "asc",
    //       width: 150
    //     }
    //   ],
    //   rows: this.state.merchantDetails1
    // };

    return (
      <div className="col-md-12">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {(() => {
            if (this.state.settlementError === true) {
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
                    <DialogContentText>Settlements not found</DialogContentText>
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

            if (this.state.statementError === true) {
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
                    <DialogContentText>Statements not found</DialogContentText>
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
            <MDBCard className="statementSettlementsCardView">
              <MDBCardBody>
                <MDBCardTitle className="statementSettlementCardTitle">
                  Statements and Settlements
                </MDBCardTitle>
                <MuiThemeProvider>
                  <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 col-12 merchantMobileNumbDiv">
                      <div className=" col-lg-1 col-md-1 col-sm-1 col-1 merchantMobileNumbDiv merchantPhoneIconDiv">
                        <img
                          style={{ width: "19px" }}
                          src={require("../assets/mobile_number.jpg")}
                        />
                      </div>
                      <div className=" col-lg-5 col-md-5 col-sm-5 col-10 merchantMobileNumbDiv">
                        <TextField
                          // style={{ width: "215px" }}
                          className="textFieldMargin"
                          hintText="Merchant Account Number"
                          type="text"
                          autoComplete="off"
                          floatingLabelText="Merchant Account Number *"
                          required={true}
                          autoComplete="off"
                          name="number"
                          pattern="[0-9]*"
                          maxlength="10"
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
                      className=" col-lg-3 col-md-6 col-sm-3 col-6 merchantMobileNumbDiv"
                      style={{ marginTop: "3%" }}
                    >
                      <label className="statement">
                        <Radio
                          checked={this.state.selectedOption === "option1"}
                          onChange={this.handleOptionChange}
                          value="option1"
                          color="default"
                          name="radio-button-demo"
                          aria-label="D"
                        />
                        Statements
                      </label>
                    </div>
                    <div
                      className="col-lg-3 col-md-6 col-sm-3 col-6 merchantMobileNumbDiv"
                      style={{ marginTop: "3%" }}
                    >
                      <label className="settlement">
                        <Radio
                          checked={this.state.selectedOption === "option2"}
                          onChange={this.handleOptionChange}
                          value="option2"
                          color="default"
                          name="radio-button-demo"
                          aria-label="D"
                        />
                        Settlements
                      </label>
                    </div>
                  </div>
                </MuiThemeProvider>
                <div className="row">
                  <Button
                    color="danger"
                    onClick={() => this.handleClick(this.state.number)}
                    className="statementSettlementSubmit"
                    disabled={!enabled || this.state.validate}
                  >
                    Submit
                  </Button>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </main>
      </div>
    );
  }
}

StatementsSettlements.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withStyles(styles, { withTheme: true })(StatementsSettlements);
