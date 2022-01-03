import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPublicDragons } from "../action/publicDragons";
import PublicDragonRow from "./PublicDragonRow";
import { fetchAccountDragons } from "../action/accountDragons";

class PublicDragons extends Component {
  componentDidMount() {
    this.props.fetchPublicDragons();
    this.props.fetchAccountDragons();
  }
  render() {
    return (
      <div>
        <h3> Public Dragon</h3>

        {this.props.publicDragons.dragons.map((dragon) => {
          return (
            <div key={dragon.dragonId}>
              <PublicDragonRow dragon={dragon} />
              <hr />
            </div>
          );
        })}
        <Link to="/">Home</Link>
      </div>
    );
  }
}
export default connect(({ publicDragons }) => ({ publicDragons }), {
  fetchPublicDragons,
  fetchAccountDragons,
})(PublicDragons);
