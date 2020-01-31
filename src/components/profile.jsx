import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { browserHistory } from "react-router";
import TextField from "material-ui/TextField";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol
} from "mdbreact";
import PropTypes from "prop-types";
import React from "react";
import DashBoard from "./dashboard";
import Cookies from "js-cookie";

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

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);

    this.editAgent = this.editAgent.bind(this);

    this.state = {
      UserId: "",

      MobileNumber: "",

      Location: "",

      EmailId: "",

      error: ""
    };
  }

  submit() {
    // alert("submitted");
  }

  componentDidMount() {
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("x-auth-token");
    axios
      .get(
        dotenv.API_ROOT_USERMGNT +
          "/agents/getAgent?email=" +
          window.localStorage.getItem("email"),
        {},
        config
      )
      .then(response => {
        if (
          response.status == 200 &&
          response.data.message != "Invalid Token"
        ) {
          this.setState({ MobileNumber: response.data.response.mobile });

          this.setState({ UserId: response.data.response.username });

          this.setState({ Location: response.data.response.Location });

          this.setState({ EmailId: response.data.response.email });

          //this.setState({ error: 'Login Success' })
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
          this.setState({ error: "Server Down" });
        }
      });
  }

  editAgent() {
    // alert("Profile edit");
  }

  render() {
    const { classes, theme } = this.props;

    const { EmailId, UserId, error, Location, MobileNumber } = this.state;

    return (
      <div className="row">
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <style>{css}</style>

          <DashBoard />

          <MDBCol>
            <MDBCard className="profileCardView">
              <MDBCardBody>
                <MuiThemeProvider>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 ">
                      <div className="col-lg-10 col-md-10 col-sm-9 col-6 displayInline">
                        <p className="profileCardTitle">Agent Profile</p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                      <div className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline">
                        <img
                          className="mailIconProfile"
                          src={require("../assets/mail.png")}
                        />
                      </div>
                      <div className="col-lg-5 col-md-5 col-sm-5 col-5 displayInline">
                        <TextField
                          disabled="true"
                          style={{ marginLeft: "10px", width: "350px" }}
                          hintText="Enter your Email ID"
                          floatingLabelText="Email ID"
                          required={true}
                          autoComplete="off"
                          value={this.state.EmailId}
                          name="EmailID"
                          onChange={(event, newValue) =>
                            this.setState({ EmailId: newValue })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                      <div className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline">
                        <img
                          className="locationIconProfile"
                          src={require("../assets/location.png")}
                        />
                      </div>
                      <div className="col-g-5 col-md-5 col-sm-5 col-5 displayInline">
                        <TextField
                          disabled="true"
                          style={{ marginLeft: "10px", width: "350px" }}
                          hintText="Enter your Location"
                          floatingLabelText="Location"
                          name="Location"
                          autoComplete="off"
                          value={this.state.Location}
                          required={true}
                          onChange={(event, newValue) =>
                            this.setState({ Location: newValue })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                      <div className="col-lg-1 col-md-1 col-sm-1 col-1 displayInline">
                        <img
                          className="phoneIconProfile"
                          src={require("../assets/mobile_number.jpg")}
                        />
                      </div>
                      <div className="col-lg-5 col-md-5 col-sm-5 col-5  displayInline">
                        <TextField
                          style={{ marginLeft: "10px", width: "350px" }}
                          hintText="Enter your Mobile Number"
                          floatingLabelText="Mobile Number"
                          disabled
                          autoComplete="off"
                          required={true}
                          value={this.state.MobileNumber}
                          name="Mobile"
                          onChange={(event, newValue) =>
                            this.setState({ MobileNumber: newValue })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {error && <div className="profileErrorStyle">{error}</div>}
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

const errorDisp = {
  marginRight: "150px",

  marginLeft: "230px",

  marginTop: "20px",

  textAlign: "center",

  padding: "15px",

  fontStyle: "italic",

  color: "#a94442",

  fontWeight: "bold",

  borderColor: "#ebccd1",

  backgroundColor: "#f2dede",

  textAlign: "center",

  borderRadius: "25px",

  width: "50%"
};
Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default withStyles(styles, { withTheme: true })(Profile);
