import AppBar from "@material-ui/core/AppBar";
import { withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import Cookies from "js-cookie";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { browserHistory } from "react-router";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBDataTable
} from "mdbreact";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Radio from "@material-ui/core/Radio";
import SwipeableViews from "react-swipeable-views";
import Dashboard from "./dashboard";

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
    width: 500
  }
});

let selectedItemValue = "";

class FullWidthTabs extends Component {
  menuItemAction(event) {
    this.setState({ selectedMenuItem: "" });
    this.setState({
      selectedMenuItem: event.currentTarget.dataset.name,
      columns: [event.currentTarget.dataset.name].columns
    });
    selectedItemValue = event.currentTarget.dataset.name;
    this.triggerTransactionLogs();
  }
  handleOptionChange = changeEvent => {
    this.setState({
      isAdminActivityLogs: changeEvent.target.value
    });
  };

  state = { value: 0, isAdminActivityLogs: "adminLogs" };
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
      paginationforSettlements: [],
      selectedMenuItem: "transactionPTM",
      columns: [],
      rows: [],
      logData: []
    };
  }

  triggerTransactionLogs() {
    if (selectedItemValue === "transactionPTM") {
      this.setState({ logData: "" });
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .get(
          dotenv.API_ROOT_TXNMGNT + "/Transactions/getPayTransaction?auth=Payer",
          config
        )
        .then(response => {
          if (response.status == "200") {
            if (response.data.response) {
              if (response.data.response.responseCode == 700) {
                this.setState({
                  logData: response.data.response.SettledTransactionData
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
    } else if (selectedItemValue == "fundsLoaded") {
      this.setState({ logData: "" });
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .get(
          dotenv.API_ROOT_TXNMGNT + "/Transactions/getFundsLoadTransaction?auth=Payer",
          config
        )
        .then(response => {
          if (response.status == "200") {
            if (response.data.response) {
              if (response.data.response.responseCode == 700) {
                this.setState({
                  logData: response.data.response.SettledTransactionData
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
    } else if (selectedItemValue == "promotionalBalance") {
      this.setState({ logData: "" });
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .get(
          dotenv.API_ROOT_TXNMGNT + "/Transactions/getBonusTrasaction?auth=Payer",
          config
        )
        .then(response => {
          if (response.status == "200") {
            if (response.data.response) {
              if (response.data.response.responseCode == 700) {
                this.setState({
                  logData: response.data.response.BonusTrasactionData
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
    } else if (selectedItemValue == "settlement") {
      this.setState({ logData: "" });
      require("es6-promise").polyfill();
      var axios = require("axios");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("x-auth-token");
      axios
        .get(
          dotenv.API_ROOT_TXNMGNT + "/Transactions/getSettledTransaction?auth=Payer",
          config
        )
        .then(response => {
          if (response.status == "200") {
            if (response.data.response) {
              if (response.data.response.responseCode == 700) {
                this.setState({
                  logData: response.data.response.SettledTransactionData
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
    this.setState({ isAdminActivityLogs: "adminLogs" });
    // this.setState({ columns: columnsRowsInfo.transactionPTM.columns });
    window.localStorage.getItem("currency");
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .get(
        dotenv.API_ROOT_TXNMGNT + "/Transactions/getPayTransaction?auth=Payer",
        config
      )
      .then(response => {
        if (response.status == "200") {
          if (response.data.response) {
            if (response.data.response.responseCode == 700) {
              this.setState({
                logData: response.data.response.SettledTransactionData
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
    const transactionPTM = {
      columns: [
        {
          label: "Merchant",
          field: "merchant",
          sort: "asc"
        },
        {
          label: "Payer",
          field: "payer",
          sort: "asc"
        },
        {
          label: "Time",
          field: "time",
          sort: "asc"
        },
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
      ]
    };
    const fundsLoaded = {
      columns: [
        {
          label: "Agent",
          field: "agent",
          sort: "asc"
        },
        {
          label: "Payer",
          field: "payer",
          sort: "asc"
        },
        {
          label: "Time",
          field: "time",
          sort: "asc"
        },
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
      ],
      rows: "getparametersChanges"
    };
    const promotionalBalance = {
      columns: [
        {
          label: "Payer ",
          field: "payer",
          sort: "asc"
        },
        {
          label: "Time",
          field: "time",
          sort: "asc"
        },
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
      ],
      rows: "getparametersChanges"
    };
    const settlement = {
      columns: [
        {
          label: "Agent",
          field: "agent",
          sort: "asc"
        },
        {
          label: "Merchant",
          field: "merchant",
          sort: "asc"
        },
        {
          label: "Time",
          field: "time",
          sort: "asc"
        },
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
      ],
      rows: "getparametersChanges"
    };

    const a = [3];
    const { classes, theme } = this.props;
    return (
      <div className="col-md-12" x-ms-format-detection="none">
        <style>{css}</style>

        <Dashboard />
        <MDBCol>
          <MDBCard
            style={{
              width: "1000px",
              height: "530px",
              marginTop: "120px",
              marginLeft: "180px"
            }}
          >
            <MDBCardBody>
              <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                System Logs
              </MDBCardTitle>

              <MuiThemeProvider>
                <div className="container top-margin">
                  <div className={(classes.root, "col-md-12")}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab
                          label="Transaction Logs"
                          style={{ fontSize: "12px", color: "black" }}
                        />
                        <Tab
                          label="Activity Logs"
                          style={{ fontSize: "12px", color: "black" }}
                        />
                      </Tabs>
                    </AppBar>
                  </div>

                  <div className={(classes.root, "col-md-12")}>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={this.state.value}
                      onChangeIndex={this.handleChangeIndex}
                    >
                      <TabContainer dir={theme.direction}>
                        <div
                          className={(classes.root, "col-md-2")}
                          // style={{ borderColor: "white" }}
                        >
                          <nav
                            // class="navbar "
                            style={{ marginLeft: "-14px", marginTop: "2px" }}
                          >
                            <ul class="navbar-nav">
                              <li class="nav-item">
                                <a
                                  onClick={event => this.menuItemAction(event)}
                                  data-name="transactionPTM"
                                  className={
                                    this.state.selectedMenuItem ===
                                    "transactionPTM"
                                      ? "list-group-item active"
                                      : "list-group-item"
                                  }
                                  style={{ fontSize: "12px", color: "black" }}
                                  // class="nav-link"
                                >
                                  Transaction(PTM)
                                </a>
                              </li>

                              <li class="nav-item">
                                <a
                                  onClick={event => this.menuItemAction(event)}
                                  data-name="fundsLoaded"
                                  style={{ fontSize: "12px", color: "black" }}
                                  className={
                                    this.state.selectedMenuItem ===
                                    "fundsLoaded"
                                      ? "list-group-item active"
                                      : "list-group-item"
                                  }
                                >
                                  Funds Loaded
                                </a>
                              </li>
                              <li class="nav-item">
                                <a
                                  onClick={event => this.menuItemAction(event)}
                                  data-name="promotionalBalance"
                                  style={{ fontSize: "12px", color: "black" }}
                                  className={
                                    this.state.selectedMenuItem ===
                                    "promotionalBalance"
                                      ? "list-group-item active"
                                      : "list-group-item"
                                  }
                                >
                                  Promotional Balance
                                </a>
                              </li>
                              <li class="nav-item">
                                <a
                                  onClick={event => this.menuItemAction(event)}
                                  data-name="settlement"
                                  style={{ fontSize: "12px", color: "black" }}
                                  className={
                                    this.state.selectedMenuItem === "settlement"
                                      ? "list-group-item active"
                                      : "list-group-item"
                                  }
                                >
                                  Settlement
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                        <div className={(classes.root, "col-md-10")}>
                          {(() => {
                            if (
                              this.state.selectedMenuItem === "transactionPTM"
                            ) {
                              return (
                                <MDBDataTable
                                  striped
                                  bordered
                                  sortable={false}
                                  hover
                                  data={{
                                    columns: transactionPTM.columns,
                                    rows: this.state.logData
                                  }}
                                  entries="5"
                                />
                              );
                            }
                            if (this.state.selectedMenuItem === "fundsLoaded") {
                              return (
                                <MDBDataTable
                                  striped
                                  bordered
                                  sortable={false}
                                  hover
                                  data={{
                                    columns: fundsLoaded.columns,
                                    rows: this.state.logData
                                  }}
                                  entries="5"
                                />
                              );
                            }
                            if (
                              this.state.selectedMenuItem ===
                              "promotionalBalance"
                            ) {
                              return (
                                <MDBDataTable
                                  striped
                                  bordered
                                  sortable={false}
                                  hover
                                  data={{
                                    columns: promotionalBalance.columns,
                                    rows: this.state.logData
                                  }}
                                  entries="5"
                                />
                              );
                            }
                            if (this.state.selectedMenuItem === "settlement") {
                              return (
                                <MDBDataTable
                                  striped
                                  bordered
                                  sortable={false}
                                  hover
                                  data={{
                                    columns: settlement.columns,
                                    rows: this.state.logData
                                  }}
                                  entries="5"
                                />
                              );
                            }
                          })()}
                        </div>
                      </TabContainer>
                    </SwipeableViews>
                  </div>
                </div>
              </MuiThemeProvider>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
