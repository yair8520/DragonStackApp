import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { logout } from "../action/account";
import Generation from "./Generation";
import Dragon from "./Dragon";
import { Link } from 'react-router-dom';
import AccountInfo from "./AccountInfo";


class Home extends Component {
  render() {
    return (
      <div>
        <Button onClick={this.props.logout} className="logout-button">
          Log Out
        </Button>
        Dragon Stack
        
        <Generation />
        <Dragon />
        <hr />
        <AccountInfo/> 
        <hr />
        <Link to='/account-dragons'>Account Dragons</Link>
        <br/>
        <Link to='/public-dragons'>Public Dragons</Link>
      </div>
    );
  }
}

export default connect(null, { logout })(Home);
