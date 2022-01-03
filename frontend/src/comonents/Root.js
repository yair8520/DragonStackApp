import React, { Component } from "react";
import { connect } from "react-redux";
import AuthFrom from "./AuthForm";
import Home from "./Home";

class Root extends Component {
  render() {
    return this.props.account.loggedIn ? <Home /> : <AuthFrom />;
  }
}

export default connect(({ account }) => ({ account }), null)(Root);
