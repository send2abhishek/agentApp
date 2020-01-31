import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Button } from "reactstrap";
import DashBoard from "../components/dashboard";
import axios from "axios";
import Cookies from "js-cookie";
const dotenv = require("../../src/env");
const config = {
  headers: { Pragma: "no-cache" }
};

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
      backgroundColor: "#43425D",
      color: "#43425D"
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
      backgroundColor: "#43425D"
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: "#43425D",
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
      backgroundColor: "#43425D"
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 3 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 7 + 1
    }
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

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
      errorTextMail: "",
      errorpassword: "",
      superAdminFlag: window.localStorage.getItem("isSuperFlag")
    };
  }

  route() {
    if (this.state.superAdminFlag === "false") {
      const path = "/merchant";
      browserHistory.push(path);
    } else {
      const path = "/agentCreation";
      browserHistory.push(path);
    }
  }
  routeToStatements() {
    const path1 = "/statementsAndSettlements";
    browserHistory.push(path1);
  }
  routeToAccount() {
    const path2 = "/account";
    browserHistory.push(path2);
  }
  routeToSystemLogs() {
    const path2 = "/systemLogs";
    browserHistory.push(path2);
  }

  routeToPayer() {
    const path3 = "/payerload";
    browserHistory.push(path3);
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div>
        <DashBoard />

        {(() => {
          if (this.state.superAdminFlag === "false") {
            return (
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className="container">
                  <div className="row">
                    <div className="col-md-4 col-sm-4">
                      <Button
                        className="merchantActivation"
                        color="#43425D"
                        size="lg"
                        onClick={this.route.bind(this)}
                      >
                        Merchant Activation {<p className="merchantActLine" />}
                      </Button>
                    </div>

                    <div className="col-md-4 col-sm-4">
                      <Button
                        className="stateSettle"
                        color="#43425D"
                        onClick={this.routeToStatements}
                        size="lg"
                      >
                        Statements & Settlements{" "}
                        {<p className="stateSettleLine" />}
                      </Button>
                    </div>

                    <div className="col-md-4 col-sm-4">
                      <Button
                        className="systemLog"
                        color="#43425D"
                        size="lg"
                        onClick={this.routeToSystemLogs}
                      >
                        System Logs {<p className="systemLogLine" />}
                      </Button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 col-sm-4">
                      <Button
                        className="payerAccountEnquiry"
                        color="#43425D"
                        onClick={this.routeToAccount}
                        size="lg"
                      >
                        Account Enquiry{" "}
                        {<p className="payerAccountEnquiryLine" />}
                      </Button>
                    </div>
                    <div className="col-md-4 col-sm-4">
                      <Button
                        className="payerLoadFunds"
                        color="#43425D"
                        onClick={this.routeToPayer}
                        size="lg"
                      >
                        {" "}
                        Load Wallet {<p className="payerLoadFundsLine" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </main>
            );
          } else {
            return (
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className="container">
                  <div className="row">
                    <div className="col-md-4 col-sm-4">
                      <Button
                        className="merchantActivation"
                        color="#43425D"
                        size="lg"
                        onClick={this.route.bind(this)}
                      >
                        Enroll Customer Service Agent{" "}
                        {<p className="merchantActLine" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </main>
            );
          }
        })()}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(HomePage);
