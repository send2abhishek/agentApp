import axios from "axios";
import { subDays } from "date-fns";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "reactstrap";
import Dashboard from "./dashboard";
import Cookies from "js-cookie";
const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};

const css = `

TextField{
  cursor: default !important;
}

.label-heading{
  color: rgb(0,188,212) !important;
}

.date-selection-field{
  margin-top:3%;
  color: #3D3636 !important;
  font-size:13px;
  font-weight:bold;
}

.sum-style{
  font-size:20px;
  font-weight:bold;
}
.sum-text{
color:#43425D;
}
.total-text{
  color:#54A4F3;
}
`;

let merchantDetails = [];
var totalSum = 0;
let disabled = false;
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
class Statements extends Component {
  state = { value: 0, startDate: new Date() };
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: window.localStorage.getItem("mobile"),
      merchantDetails1: "",
      merchantName: "",
      date: "",
      startDate: "",
      searchedData: "",
      sum: "",
      allData: true
    };
    this.handleChange = this.handleChange.bind(this);
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
    disabled = false;
    merchantDetails = [];
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .get(
        dotenv.API_ROOT_TXNMGNT +
          "/Transactions/getStatementsForMerchant?mobileNumber=" +
          window.localStorage.getItem("mobile") +
          "&auth=Payer",
        config
      )
      .then(response => {
        var data = response.data.statementData;
        if (
          response.status == 200 &&
          response.data.message != "Invalid Token"
        ) {
          var data = response.data.statementData;
          for (let i = 0; i < data.length; i++) {
            merchantDetails.push(data[i]);
          }
          this.setState({ merchantDetails1: merchantDetails });

          var searchDataList = [];
          for (var i = 0; i < merchantDetails.length; ++i) {
            var obj = merchantDetails[i];
            var searchData = {
              Payer: obj.Payer,
              Time: obj.Time,
              TransactionId: obj.TransactionId,
              Type: obj.Type,
              Status: obj.Status,
              Amount: obj.Amount
            };
            searchDataList.push(searchData);
          }
          this.setState({ searchedData: searchDataList });
          this.setState({
            merchantName: response.data.merchantName
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

  handleChange(date) {
    if (date != undefined) {
      disabled = false;
      if (date > subDays(new Date(), 7) && date < new Date()) {
        this.setState({
          startDate: date
        });
        this.setState({ allData: false });
      }
    } else {
      this.setState({ allData: true });
      this.setState({
        startDate: ""
      });
    }
  }
  handleClick() {
    var searchDataList = [];
    totalSum = 0;
    if (this.state.allData == true) {
      var searchDataList = [];
      for (var i = 0; i < this.state.merchantDetails1.length; ++i) {
        var obj = this.state.merchantDetails1[i];
        var searchData = {
          Payer: obj.Payer,
          Time: obj.Time,
          TransactionId: obj.TransactionId,
          Type: obj.Type,
          Status: obj.Status,
          Amount: obj.Amount
        };
        searchDataList.push(searchData);
      }
      this.setState({ searchedData: searchDataList });
      this.setState({ sum: 0 });
    } else {
      for (var i = 0; i < this.state.merchantDetails1.length; ++i) {
        var date = this.state.merchantDetails1[i].date;
        var sel = this.state.startDate.toString();
        var obj = this.state.merchantDetails1[i];
        if (sel.substring(4, 15) == date.substring(4)) {
          totalSum += obj.Amount;
          var searchData = {
            Payer: obj.Payer,
            Time: obj.Time,
            TransactionId: obj.TransactionId,
            Type: obj.Type,
            Status: obj.Status,
            Amount: obj.Amount
          };
          searchDataList.push(searchData);
          // alert("hitting");
        }
      }

      this.setState({ searchedData: searchDataList });
      this.setState({ sum: totalSum });
    }
  }

  render() {
    var columns = [
      {
        label: "Payer",
        field: "payerName",
        sort: "asc",
        width: 150
      },
      {
        label: "Time",
        sort: "asc",
        width: 270
      },
      {
        label: "Transaction ID",
        sort: "asc",
        width: 200
      },
      {
        label: "Type",
        sort: "asc",
        width: 100
      },
      {
        label: "Status",
        sort: "asc",
        width: 100
      },
      {
        label:
          "Amount" + "(" + window.localStorage.getItem("currencyImage") + ")",
        sort: "asc",
        width: 100
      }
    ];
    const { classes, theme } = this.props;
    const a = [0];
    return (
      <div className="col-md-12" x-ms-format-detection="none">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <style>{css}</style>
          <Dashboard />
          <MDBCol>
            <MDBCard className="statementCardView">
              <MDBCardBody>
                <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                  Merchant Statement
                </MDBCardTitle>
                <MuiThemeProvider>
                  <div className="container">
                    <div className="row">
                      <div className=" col-lg-4 col-md-6 col-sm-12 col-12">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{
                            marginLeft: "10px",
                            width: "220px"
                          }}
                          hintText="Enter Number"
                          floatingLabelText="Merchant Number"
                          required={true}
                          name="number"
                          autoComplete="off"
                          readonly
                          disabled
                          value={this.state.mobileNumber}
                        />
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px", width: "220px" }}
                          hintText="Enter Number"
                          floatingLabelText="Merchant Name"
                          required={true}
                          autoComplete="off"
                          name="number"
                          readonly
                          disabled
                          value={this.state.merchantName}
                        />
                      </div>
                      <div className=" col-lg-4 col-md-6 col-sm-12 col-12">
                        <p className="date-selection-field">
                          Please select Date for search:
                        </p>
                        <DatePicker
                          selected={this.state.startDate}
                          // onChange={this.handleChange}
                          placeholderText="Select Date"
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMM dd yyyy"
                          timeCaption="time"
                          onkeydown="return false;"
                          maxDate={new Date()}
                          minDate={subDays(new Date(), 6)}
                          onChange={event => this.handleChange(event)}
                        />
                        <Button
                          color="danger"
                          disabled={disabled}
                          onClick={this.handleClick.bind(this)}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </MuiThemeProvider>
                <MDBDataTable
                  style={{ fontSize: "100px" }}
                  striped
                  bordered
                  small
                  sortable={false}
                  data={{ columns, rows: this.state.searchedData }}
                  entries="5"
                  entriesLabel
                  entriesOptions={a}
                  responsive={true}
                />
                {(() => {
                  if (this.state.sum != 0) {
                    return (
                      <div className="text-right sum-style">
                        <span className="sum-text">Total Sum : </span>
                        <span className="total-text">
                          {window.localStorage.getItem("currencyImage")}{" "}
                          {this.state.sum}
                        </span>
                      </div>
                    );
                  }
                })()}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Statements);
