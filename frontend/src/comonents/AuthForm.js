import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import { signup, login } from "../action/account";
import fetchStates from "../reducers/fetchStates";

class AuthFrom extends Component {
  state = {
    username: "",
    password: "",
    buttenClicked: false,
  };
  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  signup = () => {
    this.setState({ buttenClicked: true });
    const { username, password } = this.state;
    this.props.signup({ username, password });
  };
  login = () => {
    this.setState({ buttenClicked: true });
    const { username, password } = this.state;
    this.props.login({ username, password });
  };

  get Error() {
    if (
      this.state.buttenClicked &&
      this.props.account.status === fetchStates.error
    ) {
      return <div>{this.props.account.message}</div>;
    }
  }

  render() {
    return (
      <div>
        <h2>Dragon Stack</h2>
        <FormGroup>
          <FormControl
            name="username"
            onChange={this.inputHandler}
            type="text"
            value={this.state.username}
            placeholder="username..."
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="password"
            onChange={this.inputHandler}
            type="password"
            value={this.state.password}
            placeholder="password..."
          />
        </FormGroup>
        <div>
          <Button onClick={this.login}>Log in </Button>
          <span> or </span>
          <Button onClick={this.signup}>Sign up</Button>
        </div>
        <br />
        {this.Error}
      </div>
    );
  }
} //1.mapStateToProps 2.mapDispatchToProps
export default connect(({ account }) => ({ account }), { signup, login })(
  AuthFrom
);
