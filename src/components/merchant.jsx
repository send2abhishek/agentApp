import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBDataTable
} from "mdbreact";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import DashBoard from "./dashboard";
import Cookies from "js-cookie";

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

class Merchant extends Component {
  constructor(props) {
    super(props);

    // this.handleClick ();

    this.state = {
      email: "",

      password: "",

      error: "",

      errorTextMail: "",

      errorpassword: "",
      merchantDetails1: "",
      columnData: ""
    };
  }

  componentDidMount() {
    this.handleClick();
  }

  sendData(e, rowData) {
    window.localStorage.setItem("mobile", rowData.mobile);
    window.localStorage.setItem("firstName", rowData.firstName);
    window.localStorage.setItem("lastName", rowData.lastName);
    window.localStorage.setItem("location", rowData.location);
    window.localStorage.setItem("isActive", rowData.isActive);
    window.localStorage.setItem("mail", rowData.email);
    window.localStorage.setItem("otpVerified", rowData.emailVerified);

    this.setState({ columnData: rowData });
    const path = "/merchantActivation";
    browserHistory.push({
      pathname: path,
      state: {
        mobile: rowData.mobile,

        firstName: rowData.firstName,
        location: rowData.location,
        isActive: rowData.isActive,
        otpVerified: rowData.emailVerified,
        pagination: []
      }
    });
  }
  handleClick() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    merchantDetails = [];

    axios
      .get(
        dotenv.API_ROOT_USERMGNT +
          "/merchants/?filter=%7B%22fields%22%3A%7B%22id%22%3Afalse%2C%22username%22%3Afalse%2C%22realm%22%3Afalse%7D%20%7D&" +
          "type=Agent",
        config
      )
      .then(response => {
        if (
          response.status == 200 &&
          response.data.message != "Invalid Token"
        ) {
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].emailVerified) {
              response.data[i].emailVerified = "Yes";
            } else {
              response.data[i].emailVerified = "No";
            }

            merchantDetails.push(response.data[i]);
          }
          this.setState({ merchantDetails1: merchantDetails });

          this.state.error = "Login Success";

          this.setState({ error: "Login Success" });
        } else if ((response.data.message = "Invalid Token")) {
          const path = "/";
          browserHistory.push({
            pathname: path
          });
        }
        if (merchantDetails.length == 0) {
          this.setState({ pagination: [] });
        } else {
          this.setState({ pagination: ["Previous", "Next"] });
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
    const { classes, theme } = this.props;

    const data = {
      columns: [
        {
          label: "First Name",
          field: "name",
          sort: "asc",
          width: 150
        },
        {
          label: "Last Name",
          field: "lastName",
          sort: "asc",
          width: 270
        },
        {
          label: "Location",
          field: "location",
          sort: "asc",
          width: 200
        },
        {
          label: "Type",
          field: "type",
          sort: "asc",
          width: 100
        },
        {
          label: "Mobile Number",
          field: "number",
          sort: "asc",
          width: 150
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
          width: 100
        },

        {
          label: "Email Id",
          field: "button",
          sort: "asc",
          width: 100
        },
        {
          label: "OTP Verified",
          field: "otpVerified",
          sort: "asc",
          width: 100
        },

        {
          label: "Action",
          field: "button",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.merchantDetails1
    };
    for (let i = 0; i < data.rows.length; i++) {
      data.rows[i]["button"] = (
        <Button onClick={e => this.sendData(e, data.rows[i])}>
          <img style={{ width: "50%" }} src={require("../assets/edit.png")} />
        </Button>
      );
    }

    return (
      <div className="col-md-12" x-ms-format-detection="none">
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <DashBoard />

          <MDBCol>
            <MDBCard className="merchantActivationCardView">
              <MDBCardBody>
                <MDBCardTitle className="merchantActivationCardTitle">
                  Merchant Activation List
                </MDBCardTitle>

                <MDBDataTable
                  style={{ fontSize: "100px" }}
                  striped
                  bordered
                  sortable={false}
                  small
                  paginationLabel={this.state.pagination}
                  data={data}
                  entries="5"
                  responsive={true}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </main>
      </div>
    );
  }
}

Merchant.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Merchant);
