import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { BACKEND } from "../config";
import history from "../history";
import DragonAvatar from "./DragonAvatar";
import MatingOptions from "./MatingOptions";

export default class PublicDragonRow extends Component {
  state = { displayatingOptions: false };

  toggleDisplayatingOptions = () => {
    this.setState({ displayatingOptions: !this.state.displayatingOptions });
  };

  buy = () => {
    const { dragonId, saleValue } = this.props.dragon;
    fetch(`${BACKEND.ADDRESS}/dragon/buy`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dragonId,
        saleValue,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        alert(json.message);

        if (json.type !== "error") {
          history.push("/account-dragons");
        }
      })
      .catch((error) => alert(error.message));
  };
  render() {
    return (
      <div>
        <div>{this.props.dragon.nickname}</div>
        <DragonAvatar dragon={this.props.dragon} />
        <div>
          <span>Sale value: {this.props.dragon.saleValue}</span>
          {" | "}
          <span>Sire value: {this.props.dragon.sireValue}</span>
        </div>
        <br />
        <Button onClick={this.buy}>Buy</Button>
        <Button onClick={this.toggleDisplayatingOptions}>Sire</Button>
        {this.state.displayatingOptions ? (
          <MatingOptions patronDragonId={this.props.dragon.dragonId} />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
