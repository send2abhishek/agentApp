import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import http from "../components/services/httpService";
import Cookies from "js-cookie";
import jwtdecode from "jwt-decode";
import jwt from "jsonwebtoken";
import { browserHistory } from "react-router";
const dotenv = require("../../src/env");
var upn = "";
var signedToken = "";
const config = {
  headers: { Pragma: "no-cache" }
};
class validateUser extends Component {
  state = { error: "" };
  // getToken = () => {
  //   const token = this.props.location.hash;
  //   const tokenArray = token.split("&")[0].split("=");
  //   return tokenArray[1];
  // };
  getAgentAccessDetails() {
    //var tokenInfo = jwtdecode(this.getToken());
    require("es6-promise").polyfill();
    var axios = require("axios");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + window.localStorage.getItem("x-auth-token");
    //alert(window.localStorage.getItem("x-auth-token"));
    Cookies.set("x-auth-token", window.localStorage.getItem("x-auth-token"));
    axios
      .get(dotenv.API_ROOT_USERMGNT + "/agents/getAgent?email=" + upn, config)
      .then(response => {
        console.log("Response from agent call",response);
        if (response.data.response.responseCode == 700) {
          window.localStorage.setItem(
            "isSuperFlag",
            response.data.response.isSuper
          );
          require("es6-promise").polyfill();
          var axios = require("axios");
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + window.localStorage.getItem("x-auth-token");
          axios
            .get(dotenv.API_ROOT_CONFIG + "/configs/getActiveCurrency", config)
            .then(response => {
              console.log("API response account",response);
              if (response.status == 200) {
                window.localStorage.setItem(
                  "currency",
                  response.data.response.Currencytype
                );
              }
            })
            .catch(error => {
              if (error.response) {
                this.setState({ error: error.response.data.error.message });
              } else {
                this.setState({ error: "Unable to reach Server" });
              }
            });

          browserHistory.push("/homepage");
        } else if (response.data.response.responseCode == 800) {
          window.localStorage.setItem(
            "errorMessage",
            response.data.response.message
          );
          Cookies.remove("x-auth-token");
          window.localStorage.removeItem("isSuperFlag");
          window.localStorage.removeItem("x-auth-token");
          window.location =dotenv.logout_url
          //   //"https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=https://ewallet.attralive.com/";
          // // browserHistory.push("/");
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

  // getToken = () => {
  //   const token = this.props.location.hash;
  //   var tokenArray = token.split("&")[0].split("=");
  //   const Atoken = tokenArray[1];
  //   var PrivateKey = dotenv.privateKey;
  //   if (Atoken != undefined) {
  //     const decode = jwtdecode(Atoken, { complete: true });
  //     upn = decode.upn;
  //     try {
  //       jwt.sign(
  //         JSON.stringify(decode),
  //         PrivateKey,
  //         { algorithm: "RS256" },
  //         (err, data) => {
  //           window.localStorage.setItem("x-auth-token", data);
  //           //Cookies.set("x-auth-token", data);
  //           //http.setJwt(data);
  //           if (err === null) tokenArray[1] = data;
  //         }
  //       );
  //     } catch (ex) {}
  //   }
  //   return tokenArray[1];
  // };
  getToken = () => {
    const token = this.props.location.hash;
    var tokenArray = token.split("&")[0].split("=");
    const Atoken = tokenArray[1];
    var PrivateKey = dotenv.privateKey;
    // alert("Atoken", Atoken);
    if (Atoken != undefined) {
      const decode = jwtdecode(Atoken, { complete: true });

      console.log("DECODE ",decode);
      upn = decode.email;
      window.localStorage.setItem("name", decode.name);
      window.localStorage.setItem("email", upn);

      // alert("upn", upn);
      // try {
      var sign = jwt.sign(
        JSON.stringify(decode),
        PrivateKey,
        { algorithm: "RS256" }
        // (err, data) => {
        //   alert("data", data);
        //   window.localStorage.setItem("x-auth-token", data);
        //   //Cookies.set("x-auth-token", data);
        //   //http.setJwt(data);
        //   if (err === null) tokenArray[1] = data;
        // }
      );
      //debugger;
      window.localStorage.setItem("x-auth-token", sign);
      // alert();
      // } catch (ex) {}
    }
    return tokenArray[1];
  };

  render() {
    signedToken = this.getToken();
    if (signedToken) {
      // http.setJwt(signedToken);
      // Cookies.set("x-auth-token", signedToken);
      this.getAgentAccessDetails();
    }
    return (
      <div className="spinnerStyle">
        <CircularProgress disableShrink className="ui-spinner-input" />
      </div>
    );
  }
}

export default validateUser;
