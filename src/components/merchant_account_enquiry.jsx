import AppBar from "@material-ui/core/AppBar";
import { withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { browserHistory } from "react-router";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBDataTable
} from "mdbreact";
import PropTypes from "prop-types";
import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import Dashboard from "./dashboard";
import Cookies from "js-cookie";

const dotenv = require("../../src/env");
let messageforTable = "";
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
  color:#FF533D;
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
    <Typography
      component="div"
      dir={dir}
      style={{
        width: "100%",
        marginTop: "5%",
        overflow: "hidden"
      }}
    >
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

class MerchantAccountEnquiry extends Component {
  // state = { value: 0 };
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: window.localStorage.getItem("mobile"),
      payerName: "",
      balance: "",
      accountLimit: "",
      transactionLimit: "",
      statements: "",
      settlements: "",
      value: 0,
      paginationforStatements: [],
      paginationforSettlements: []
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
      .get(
        dotenv.API_ROOT_ACCTMGNT +
          "/accounts/77" +
          window.localStorage.getItem("mobile") +
          "?Ptype=PAndM",
        config
      )
      .then(async response => {
        if (
          response.status == 200 &&
          response.data.message != "Invalid Token"
        ) {
          this.setState({ payerName: response.data.name });
          this.setState({ balance: response.data.balance });
          this.setState({ accountLimit: response.data.Account.accountLimit });
          this.setState({
            transactionLimit: response.data.Account.transactionLimit
          });

          var statementList = [];
          await axios
            .get(
              dotenv.API_ROOT_TXNMGNT +
                "/Transactions/getStatementsForMerchant?mobileNumber=" +
                window.localStorage.getItem("mobile") +
                "&auth=Payer",
              config
            )
            .then(async response => {
              if (
                response.status == 200 &&
                response.data.message != "Invalid Token"
              ) {
                var data = response.data.statementData;
                for (var i = 0; i < data.length; ++i) {
                  var obj = data[i];
                  var newDate = this.getCustomDate(obj.date);
                  var statement = {
                    Payer: obj.Payer,
                    Amount: obj.Amount,
                    date: newDate,
                    Time: obj.Time
                  };
                  await statementList.push(statement);
                }
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

          var settlementList = [];
          await axios
            .post(
              dotenv.API_ROOT_SLTMNT + "/settlements/getSettlements" + "?auth=Agent",
              {
                mobileNumber: window.localStorage.getItem("mobile")
              },

              config
            )
            .then(async response => {
              if (
                response.status == 200 &&
                response.data.message != "Invalid Token"
              ) {
                var data = response.data.settlements;
                for (var i = 0; i < data.length - 1; ++i) {
                  var obj = data[i];
                  var status;
                  if (obj.isSettled) {
                    status = "Settled";
                  } else if (!obj.isSettled) {
                    status = "Open";
                  }
                  var settlement = {
                    date: obj.date,
                    Amount: obj.totalSettlement,
                    Status: status
                  };
                  await settlementList.push(settlement);
                }
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

          if (statementList.length == 0) {
            messageforTable = "No records found";
            this.setState({ paginationforStatements: [] });
          } else {
            messageforTable = "";
            this.setState({ paginationforStatements: ["Previous", "Next"] });
          }
          if (settlementList.length == 0) {
            this.setState({ paginationforSettlements: [] });
          } else {
            this.setState({ paginationforSettlements: ["Previous", "Next"] });
          }

          this.setState({ statements: statementList });
          this.setState({ settlements: settlementList });
        }
      })
      .catch(error => {
        if (error.response) {
          alert("Account Not Found or Something Went Wrong");
          this.setState({ error: error.response.data.error.message });
        } else {
          this.setState({ error: "Unable to reach Server" });
        }
      });
  }
  getCustomDate(date) {
    var rawDate = new Date(date);
    var year = rawDate.getFullYear();
    var month = "" + (rawDate.getMonth() + 1);
    var day = "" + rawDate.getDate();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
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
        label: "Payer",
        field: "Payer",
        sort: "asc"
      },
      {
        label:
          "Amount" + "(" + window.localStorage.getItem("currencyImage") + ")",
        field: "Amount",
        sort: "asc"
      },
      {
        label: "Date",
        field: "date",
        sort: "asc"
      },
      {
        label: "Time",
        field: "Time",
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
        label:
          "Amount" + "(" + window.localStorage.getItem("currencyImage") + ")",
        field: "amount",
        sort: "asc"
      },
      {
        label: "Status",
        field: "status",
        sort: "asc"
      }
    ];

    const a = [3];
    const { classes, theme } = this.props;
    return (
      <div className="col-md-12" x-ms-format-detection="none">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <style>{css}</style>
          <Dashboard />
          <MDBCol>
            <MDBCard className="merchantAccountEnquiryCardView">
              <MDBCardBody>
                <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                  Merchant Enquiry
                </MDBCardTitle>
                <MuiThemeProvider>
                  <div className="row">
                    <div className=" col-lg-4 col-md-4  col-sm-4 text-center right-border">
                      <span className="inr-symbol">
                        {window.localStorage.getItem("currencyImage")}
                      </span>
                      <span className="amount balance-color">
                        {this.state.balance}
                      </span>
                      <p className="field-name">Balance</p>
                    </div>
                    <div className=" col-lg-4 col-md-4  col-sm-4 text-center right-border">
                      <span className="inr-symbol">
                        {window.localStorage.getItem("currencyImage")}
                      </span>
                      <span className="amount account-limit-color">
                        {this.state.accountLimit}
                      </span>
                      <p className="field-name">Account Limit</p>
                    </div>

                    <div className="col-lg-4 col-md-4 col-sm-4 text-center">
                      <span className="inr-symbol">
                        {window.localStorage.getItem("currencyImage")}
                      </span>
                      <span className="amount transaction-limit-color">
                        {this.state.transactionLimit}
                      </span>
                      <p className="field-name">Transaction Limit</p>
                    </div>
                  </div>
                </MuiThemeProvider>
                <MuiThemeProvider>
                  <div className="row top-margin">
                    <div className=" col-lg-4 col-md-12 col-sm-12">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "230px" }}
                        hintText="Enter Number"
                        floatingLabelText="Merchant Number"
                        required={true}
                        name="number"
                        autoComplete="off"
                        readonly
                        disabled
                        value={this.state.mobileNumber}
                      />
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "230px" }}
                        hintText="Enter Number"
                        floatingLabelText="Merchant Name"
                        required={true}
                        name="number"
                        autoComplete="off"
                        readonly
                        disabled
                        value={this.state.payerName}
                      />
                    </div>

                    <div
                      className={
                        (classes.root, "col-lg-8 col-md-12 col-sm-12 margin")
                      }
                    >
                      <AppBar position="static" color="default">
                        <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth"
                        >
                          <Tab label="Transaction History" />
                          <Tab label="Settlement Data" />
                        </Tabs>
                      </AppBar>
                      <SwipeableViews
                        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                        index={this.state.value}
                        onChangeIndex={this.handleChangeIndex}
                      >
                        <TabContainer dir={theme.direction}>
                          <MDBDataTable
                            striped
                            bordered
                            sortable={false}
                            hover
                            data={{
                              columns: columns1,
                              rows: this.state.statements
                            }}
                            entries="3"
                            paginationLabel={this.state.paginationforStatements}
                            entriesOptions={a}
                          />
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                          <MDBDataTable
                            striped
                            bordered
                            sortable={false}
                            hover
                            data={{
                              columns: columns2,
                              rows: this.state.settlements
                            }}
                            entries="3"
                            paginationLabel={
                              this.state.paginationforSettlements
                            }
                            entriesOptions={a}
                          />
                        </TabContainer>
                      </SwipeableViews>
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

MerchantAccountEnquiry.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MerchantAccountEnquiry);
