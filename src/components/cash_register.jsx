import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCol } from "mdbreact";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Dashboard from "./dashboard";
import Cookies from "js-cookie";
import { browserHistory } from "react-router";

const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};

const css = `
input {
  color: #B7BDBA;
  caret-color: transparent !important;
}


span.amount{
  font-size: 50px;
  font-weight : bold;
  font-style : Roboto;
}
p.field-name{
  font-size: 20px;
  color : #A2A2AE;
}

.inr-symbol{
  color:#A0AAA0;
  font-size: 50px;
}

.right-border{
  border-right:1px solid rgba(112,112,112,0.5);
}

.balance-color{
  color:#54A4F3;
}

.account-limit-color{
  color: #54A4F3
}

.transaction-limit-color{
  color:#43425D
}
.top-margin{
  margin-top:2%;
}
`;

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
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

var date = new Date().getDate();
let disable = false;
class CashRegister extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: window.localStorage.getItem("mobile"),
      payerName: "",
      balance: "",
      accountLimit: "",
      transactionLimit: "",
      expenses: "",
      fundsLoaded: "",
      value: 0,
      systemBalance: "",
      today_in_funds: "",
      today_to_be_settled: "",
      balance_yesterday: "",
      today_settled: "",
      yesterday_settled_amount: "",
      systemBalance: "",
      today_bonus: "",
      id: ""
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

    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .get(dotenv.API_ROOT_CASH_RGT + "/cash_registers/getCashRegister", config)
      .then(response => {
        if (
          response.status == 200 &&
          response.data.message != "Invalid Token"
        ) {
          this.setState({
            systemBalance: response.data.response.systemBalance
          });
          this.setState({
            today_in_funds: response.data.response.today_in_funds
          });
          this.setState({
            today_to_be_settled: response.data.response.today_to_be_settled
          });
          this.setState({
            balance_yesterday: response.data.response.balance_yesterday
          });
          this.setState({
            today_settled: response.data.response.today_settled
          });
          this.setState({
            yesterday_settled_amount:
              response.data.response.yesterday_settled_amount
          });
          this.setState({
            systemBalance: response.data.response.systemBalance
          });
          this.setState({
            today_bonus: response.data.response.today_in_bonus
          });
          this.setState({
            id: response.data.response.id
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
          this.setState({ error: error.response.data.error.message });
        } else {
          this.setState({ error: "Unable to reach Server" });
        }
      });
  }

  refreshData() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    window.localStorage.setItem("date", new Date().getDate());
    axios
      .post(
        dotenv.API_ROOT_CASH_RGT + "/cash_registers/clearData",
        {
          system_balance: this.state.systemBalance,
          balance_yesterday: this.state.balance_yesterday,
          yesterday_settled_amount: this.state.yesterday_settled_amount,
          id: this.state.id,
          today_to_be_settled: this.state.today_to_be_settled,
          today_settled_amount: this.state.today_settled
        },
        config
      )
      .then(response => {
        window.location.reload();
        if (
          response.status == 200 &&
          response.data.message != "Invalid Token"
        ) {
        } else if (response.data.message == "Invalid Token") {
          const path = "/";
          browserHistory.push({
            pathname: path
          });
        }
      })
      .catch(error => {
        if (error.response) {
          // this.setState({ error: error.response.data.error.message });
        } else {
          this.setState({ error: "Unable to reach Server" });
        }
      });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    var columns1 = [
      {
        label: "Merchant",
        field: "merchant",
        sort: "asc"
      },
      {
        label: "Amount",
        field: "amount",
        sort: "asc"
      },
      {
        label: "Date",
        field: "date",
        sort: "asc"
      },
      {
        label: "Time",
        field: "time",
        sort: "asc"
      }
    ];

    var columns2 = [
      {
        label: "Date",
        field: "date",
        sort: "asc"
      },
      {
        label: "Amount",
        field: "amount",
        sort: "asc"
      }
    ];

    const a = [3];
    const { classes, theme } = this.props;
    return (
      <div className="col-md-12">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <style>{css}</style>
          <Dashboard />
          <MDBCol>
            <MDBCard className="cashRegisterCardView">
              <MDBCardBody>
                <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                  Cash Register
                </MDBCardTitle>
                <div className="container">
                  <div className="col-md-4 col-sm-3 col-12 text-center right-border displayInline" />
                  <div className="col-md-4 col-sm-3  col-12 text-center right-border displayInline" />
                  <div
                    className="col-md-4 col-sm-6 col-12 text-center displayInline"
                    // style={{ backgroundColor: "grey", width: "150%" }}
                  >
                    <p className="field-name">System Balance</p>
                    <span className="inr-symbol">
                      {window.localStorage.getItem("currencyImage")}
                    </span>
                    <span className="amount balance-color">
                      {this.state.systemBalance}
                    </span>
                  </div>
                </div>
                <MuiThemeProvider>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="col-lg-6 col-md-6 col-sm-6 ">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "220px" }}
                        floatingLabelText="Funds Loaded Today "
                        required={true}
                        value={
                          window.localStorage.getItem("currencyImage") +
                          this.state.today_in_funds
                        }
                        name="number"
                        autoComplete="off"
                        disabled
                        maxlength="10"
                        pattern="\d*"
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "220px" }}
                        floatingLabelText="Pending Settlement "
                        required={true}
                        autoComplete="off"
                        disabled
                        value={
                          window.localStorage.getItem("currencyImage") +
                          this.state.today_to_be_settled
                        }
                        name="name"
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "220px" }}
                        hintText="Balance Brought Forward"
                        disabled
                        floatingLabelText="Balance Brought Forward "
                        required={true}
                        autoComplete="off"
                        value={
                          window.localStorage.getItem("currencyImage") +
                          this.state.balance_yesterday
                        }
                        name="money"
                        pattern="[0-9]*"
                        //   onBlur={event => this.requiredValidation(event)}
                        //   errorText={this.state.errorTextMoney}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "220px" }}
                        hintText="Settled as of Yesterday"
                        autoComplete="off"
                        value={
                          window.localStorage.getItem("currencyImage") +
                          this.state.yesterday_settled_amount
                        }
                        floatingLabelText="Settled as of Yesterday "
                        disabled
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "220px" }}
                        hintText=" Bonus Added Today"
                        autoComplete="off"
                        floatingLabelText=" Bonus Added Today"
                        value={
                          window.localStorage.getItem("currencyImage") +
                          this.state.today_bonus
                        }
                        disabled
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "220px" }}
                        hintText=" Settlement Done Today"
                        autoComplete="off"
                        floatingLabelText=" Settlement Done Today "
                        value={
                          window.localStorage.getItem("currencyImage") +
                          this.state.today_settled
                        }
                        disabled
                      />
                    </div>
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

CashRegister.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(CashRegister);
