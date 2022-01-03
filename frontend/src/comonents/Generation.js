import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchGeneration } from "../action/generation";
import fetchStates from "../reducers/fetchStates";
import generationReducer from "../reducers/generation";
const MIN_DELAY = 3000;

class Generation extends Component {
  timer = null;

  componentDidMount() {
    this.fetchNextGeneration();
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  fetchNextGeneration = () => {
    this.props.fetchGeneration();
    let delay =
      new Date(this.props.generation.expiration).getTime() -
      new Date().getTime();

    if (delay < MIN_DELAY) delay = MIN_DELAY;

    this.timer = setTimeout(() => {
      this.fetchNextGeneration();
    }, delay);
  };

  render() {
    console.log("props: ", this.props);
    const { generation } = this.props;


    if (generation.status === fetchStates.error) {
      return <div>{generation.message}</div>;
    }

    return (
      <div>
        <h3> Generation :{generation.generationId}.expired in:</h3>
        <h4>{new Date(generation.expiration).toString()}</h4>
      </div>
    );
  }
}

//incoming state from redux
const mapStateToProps = (state) => {
  const generation = state.generation;
  return { generation };
};

//connect redux to componnents
const componnetConector = connect(mapStateToProps, { fetchGeneration });
export default componnetConector(Generation);
