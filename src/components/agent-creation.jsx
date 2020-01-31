import { css } from "@emotion/core";
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
import { browserHistory } from "react-router";
import Select from "react-select";
import { FadeLoader } from "react-spinners";
import { Button } from "reactstrap";
import DashBoard from "./dashboard";
import Cookies from "js-cookie";
import { withStyles } from "@material-ui/core/styles";
const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};
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
let merchantDetails = [];
let mailMessage;
let enableField = false;
let templateErrorTextMessage = "";

const selectStyles = {
  menu: base => ({
    ...base,
    zIndex: 100
  })
};
const locationValues = [
  { label: "EC2", value: "EC2" },
  { label: "Others", value: "Others" }
];

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class AgentCreation extends Component {
  constructor(props) {
    super(props);

    // this.handleClick = this.handleClick.bind(this);

    this.state = {
      errorTextAgentId: "",
      errorTextNumber: "",
      errorTextMail: "",
      errorEmpId: "",
      errorTextMailValidate: false,
      errorTextNumberValidate: false,
      errorTextEmpIdValidate: false,
      loading: false,
      mailID: "",
      mobileNumber: "",
      empId: "",
      location: "",
      agentId: "",
      agentExistsMessage: "",
      responseText: "",
      locationValue: "",
      submitDisable: false,
      open: false,
      enableSubmitButton: false,
      errorTextNumberValidateDigits: false
    };
  }

  validateNumber(event) {
    switch (event.target.name) {
      case "mailID":
        if (event.target.validity.valid) {
          this.setState({ errorTextMail: "" });
          this.setState({ errorTextMailValidate: false });
          this.setState({ enableSubmitButton: false });
        } else {
          this.setState({ errorTextMail: "Invalid Email-Id" });
          this.setState({ errorTextMailValidate: true });
          this.setState({ enableSubmitButton: true });
        }
        break;

      case "mobileNumber":
        this.setState({ errorTextNumber: "" });
        if (event.target.validity.valid && event.target.value.length == 10) {
          this.setState({ errorTextNumber: "" });
          this.setState({ errorTextNumberValidate: false });
          this.setState({ errorTextNumberValidateDigits: false });
          this.setState({ enableSubmitButton: false });
        } else if (
          event.target.validity.valid &&
          event.target.value.length < 10
        ) {
          this.setState({ errorTextNumber: "Must be 10 digits" });
          this.setState({ errorTextNumberValidateDigits: true });
          this.setState({ errorTextNumberValidate: false });
          this.setState({ enableSubmitButton: true });
        } else {
          this.setState({ errorTextNumber: "Must be Numeric" });
          this.setState({ errorTextNumberValidate: true });
          this.setState({ errorTextNumberValidateDigits: false });

          this.setState({ enableSubmitButton: true });
        }
        break;
      case "empId":
        if (event.target.validity.valid) {
          this.setState({ errorTextEmpId: "" });
          this.setState({ errorTextEmpIdValidate: false });
          this.setState({ enableSubmitButton: false });
        } else if (
          event.target.value.length > 1 &&
          event.target.value === "000000"
        ) {
          this.setState({
            errorTextEmpId: "Employee Id cannot be zero"
          });
          this.setState({ errorTextEmpIdValidate: true });
          this.setState({ enableSubmitButton: true });
        } else if (
          event.target.value.length > 1 &&
          event.target.length < 6 &&
          event.target.validity.valid
        ) {
          this.setState({
            errorTextEmpId: "Must be 6 digits"
          });
          this.setState({ errorTextEmpIdValidate: true });
          this.setState({ enableSubmitButton: true });
        } else {
          this.setState({
            errorTextEmpId: "Must be Numeric with 6 digits"
          });
          this.setState({ errorTextEmpIdValidate: true });
          this.setState({ enableSubmitButton: true });
        }
        break;
      default:
        break;
    }
  }
  submitData() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");

    axios
      .post(
        dotenv.API_ROOT_USERMGNT + "/agents/AddAgent",
        {
          mobile: this.state.mobileNumber,
          location: this.state.locationValue,
          email: this.state.mailID,
          empId: this.state.empId
        },
        config
      )
      .then(response => {
        console.log("response of agent creation",response);
        if (response.status == "200") {
          if (response.data.response) {
            if (response.data.response.responseCode == "700") {
              this.setState({ confirmMessage: true });
              this.setState({ open: true });
            } else if (response.data.response.responseCode == "800") {
              this.setState({ agentExistsMessage: true });
              this.setState({ open: true });
            }
          }
        }
        if (response.data.response) {
          if (response.data.response.message == "Invalid Token") {
            const path = "/";
            browserHistory.push({
              pathname: path
            });
          }
        } else if (response.data.message) {
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

  handleClose = () => {
    this.setState({ open: false });
    window.location.reload();
  };

  componentDidMount() {}

  requiredValidation(state) {
    switch (state.target.name) {
      case "mobileNumber":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorTextNumber: "This field is required" });
        } else if (state.target.value.length > 0) {
          if (this.state.errorTextNumberValidate == true) {
            this.setState({ errorTextNumber: "Must be Numeric" });
            this.setState({ enableSubmitButton: true });
          } else if (this.state.errorTextNumberValidateDigits == true) {
            this.setState({ errorTextNumber: "Must be 10 digits" });
            this.setState({ enableSubmitButton: true });
          }
        } else {
          this.setState({ errorTextNumber: "" });
          this.setState({ enableSubmitButton: false });
        }
        break;

      case "mailID":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorTextMail: "This field is required" });
        } else if (state.target.value.length > 0) {
          if (this.state.errorTextMailValidate == true) {
            this.setState({ errorTextMail: "Invalid Email-Id" });
            this.setState({ enableSubmitButton: true });
          }
        } else {
          this.setState({ errorTextMail: "" });
          this.setState({ enableSubmitButton: false });
        }
         break;
      case "empId":
        if (state.target.value == "" && state.target.value.length == 0) {
          this.setState({ errorTextEmpId: "This field is required" });
        } else if (
          state.target.value.length > 0 &&
          state.target.value !== "000000"
        ) {
          if (this.state.errorTextEmpIdValidate == true) {
            this.setState({ errorTextEmpId: "Must be Numeric with 6 digits" });
            this.setState({ enableSubmitButton: true });
          }
        } else if (
          state.target.value.length > 0 &&
          state.target.value === "000000"
        ) {
          this.setState({ errorTextEmpId: "Employee Id cannot be zero" });
          this.setState({ enableSubmitButton: true });
        } else {
          this.setState({ errorTextEmpId: "" });
          this.setState({ enableSubmitButton: false });
        }
        break;
    }
  }

  dropdownValue(value) {
    this.setState({ locationValue: value.value });
  }

  render() {
    const { classes, theme } = this.props;
    let enable = false;
    let validSubmit = false;

    if (
      this.state.mailID.length == 0 ||
      this.state.mobileNumber.length == 0 ||
      this.state.empId.length == 0 ||
      this.state.locationValue == ""
    ) {
      validSubmit = true;
    } else {
      validSubmit = false;
    }
    const { fullScreen } = this.props;

    return (
      <div className="col-md-12">
        <main className={classes.content}>
          <div className={classes.toolbar} />

          {(() => {
            if (this.state.confirmMessage === true) {
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
                      Agent Created Successfully
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
            if (this.state.agentExistsMessage === true) {
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
                    <DialogContentText>Agent already exists</DialogContentText>
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
            <MDBCard
              style={{ height: "320px" }}
              className="merchantActionCardView"
            >
              <MDBCardBody>
                <MDBCardTitle style={{ color: "#4D4F5C", fontSize: "20px" }}>
                  Customer Service Agent Creation
                </MDBCardTitle>

                <MuiThemeProvider>
                  <div className="container">
                    <div className="row ">
                      <div className="col-md-6 col-sm-12 col-xs-12 ">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px" }}
                          hintText="Enter Email Id"
                          floatingLabelText="Email Id *"
                          //pattern="^\w+?\.([a-zA-Z0-9])+@([attra]{5,5})+?\.([com]{3,3})+?\.[au]{2,2}$"
                          onInput={e => this.validateNumber(e)}
                          onBlur={event => this.requiredValidation(event)}
                          errorText={this.state.errorTextMail}
                          required={true}
                          name="mailID"
                          onChange={(event, newValue) =>
                            this.setState({ mailID: newValue })
                          }
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 col-xs-12 ">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px" }}
                          hintText="Enter Employee Id"
                          floatingLabelText="Employee Id * "
                          required={true}
                          pattern="^(?!0{6})[0-9]{6}$"
                          maxlength="6"
                          onInput={e => this.validateNumber(e)}
                          name="empId"
                          onBlur={event => this.requiredValidation(event)}
                          errorText={this.state.errorTextEmpId}
                          onChange={(event, newValue) =>
                            this.setState({ empId: newValue })
                          }
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-sm-12 col-12 ">
                        <TextField
                          style={{ marginTop: "15%" }}
                          style={{ marginLeft: "10px" }}
                          hintText="Enter Mobile Number"
                          type="text"
                          floatingLabelText="Mobile Number * "
                          required={true}
                          autoComplete="off"
                          name="mobileNumber"
                          pattern="[0-9]*"
                          maxlength="10"
                          onInput={e => this.validateNumber(e)}
                          onBlur={event => this.requiredValidation(event)}
                          errorText={this.state.errorTextNumber}
                          onChange={(event, newValue) =>
                            this.setState({ mobileNumber: newValue })
                          }
                        />
                      </div>
                      <div className="col-md-4 col-sm-12  col-12  statusStyle">
                        <p
                          style={{
                            color: "rgba(0, 0, 0, 0.3)",
                            fontSize: "13px",
                            fontWeight: "bold"
                          }}
                        >
                          Location *
                        </p>
                        <Select
                          className="customSelect"
                          styles={selectStyles}
                          options={locationValues}
                          onChange={e => this.dropdownValue(e)}
                          // value={stateValue}
                          defaultValue={{
                            label: "Select",
                            value: ""
                          }}
                          floatingLabelText="Location *"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-sm-12 col-12 ">
                        <Button
                          color="danger"
                          onClick={this.submitData.bind(this)}
                          disabled={
                            validSubmit ||
                            this.state.errorTextMailValidate ||
                            this.state.errorTextEmpIdValidate ||
                            this.state.errorTextNumberValidate ||
                            this.state.errorTextNumberValidateDigits
                          }
                          className="activationSubmit"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>

                    <div className="row" style={{ marginLeft: "-3%" }}>
                      <FadeLoader
                        css={override}
                        sizeUnit={"px"}
                        size={150}
                        style={{ marginLeft: "20px" }}
                        color={"#123abc"}
                        loading={this.state.loading}
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
AgentCreation.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
export default withStyles(styles, { withTheme: true })(AgentCreation);
