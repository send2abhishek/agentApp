import AppBar from "@material-ui/core/AppBar";
import { withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
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
const config = {
  headers: { Pragma: "no-cache" }
};
let messageforTable = "";

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
    display: "flex",
    backgroundColor: theme.palette.background.paper,
    width: 500
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

class PayerAccountEnquiry extends Component {
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
      paginationforExpenses: [],
      paginationforFundsLoaded: []
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
          "/accounts/80" +
          window.localStorage.getItem("mobile") +
          "?Ptype=PAndM",
        config
      )
      .then(response => {
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
          var expensesList = [];
          if (response.data.spends != undefined) {
            for (var i = 0; i < response.data.spends.length; ++i) {
              var obj = response.data.spends[i];
              var expenses = {
                merchantMobileNumber: obj.merchantMobileNumber,
                amount: obj.amount,
                date: obj.date.toString().substring(0, 10),
                time: new Date(obj.date).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                })
              };
              expensesList.push(expenses);
            }
          }

          var fundsLoadedList = [];
          if (response.data.fundsLoaded != undefined) {
            for (var j = 0; j < response.data.fundsLoaded.length; ++j) {
              var obj1 = response.data.fundsLoaded[j];
              var loaded = {
                date: obj1.dateAndTime.toString().substring(0, 10),
                amount: obj1.amount
              };
              fundsLoadedList.push(loaded);
            }
          }
          if (expensesList.length == 0) {
            messageforTable = "No records found";
            this.setState({ paginationforExpenses: [] });
          } else {
            messageforTable = "";
            this.setState({ paginationforExpenses: ["Previous", "Next"] });
          }
          if (fundsLoadedList.length == 0) {
            this.setState({ paginationforFundsLoaded: [] });
          } else {
            this.setState({ paginationforFundsLoaded: ["Previous", "Next"] });
          }

          this.setState({ expenses: expensesList });
          this.setState({ fundsLoaded: fundsLoadedList });
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
        label:
          "Amount " +
          "(" +
          window.localStorage.getItem("currencyImage") +
          ")",
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
        label:
          "Amount" + "(" + window.localStorage.getItem("currencyImage") + ")",
        field: "amount",
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
            <MDBCard className="payerAccountEnquiryCardView">
              <MDBCardBody>
                <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                  Payer Enquiry
                </MDBCardTitle>
                <MuiThemeProvider>
                  <div className="row">
                    <div className=" col-lg-4 col-md-4 col-sm-4 text-center right-border">
                      <span className="inr-symbol">
                        {window.localStorage.getItem("currencyImage")}
                      </span>
                      <span className="amount balance-color">
                        {this.state.balance}
                      </span>
                      <p className="field-name">Balance</p>
                    </div>

                    <div className="col-lg-4 col-md-4 col-sm-4 text-center right-border">
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
                  <div className="container top-margin">
                    <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "230px" }}
                        hintText="Enter Number"
                        floatingLabelText="Payer Number"
                        required={true}
                        autoComplete="off"
                        name="number"
                        readonly
                        disabled
                        value={this.state.mobileNumber}
                      />
                      <TextField
                        style={{ marginTop: "15%" }}
                        style={{ marginLeft: "10px", width: "230px" }}
                        hintText="Enter Number"
                        floatingLabelText="Payer Name"
                        autoComplete="off"
                        required={true}
                        name="number"
                        readonly
                        disabled
                        value={this.state.payerName}
                      />
                    </div>

                    <div
                      className={
                        (classes.root,
                        "col-lg-8 col-md-12 col-sm-12 col-12 margin")
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
                          <Tab label="Expenses" />
                          <Tab label="Funds Loaded" />
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
                              rows: this.state.expenses
                            }}
                            entries="3"
                            paginationLabel={this.state.paginationforExpenses}
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
                              rows: this.state.fundsLoaded
                            }}
                            entries="3"
                            paginationLabel={
                              this.state.paginationforFundsLoaded
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

PayerAccountEnquiry.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PayerAccountEnquiry);
