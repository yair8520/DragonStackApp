import { GENERATION } from "../action/types";
import fetchStates from "./fetchStates";

const DEFUALT_GENERATION = { generationId: "", expiration: "" };

const generationReducer = (state = DEFUALT_GENERATION, action) => {
  switch (action.type) {
    case GENERATION.FETCH:
      return {
        ...state,
        status: fetchStates.fetching,
      };
    case GENERATION.FETCH_ERROR:
      return {
        ...state,
        status: fetchStates.error,
        message: action.message,
      };
    case GENERATION.FETCH_SUCCESS:
      return {
        ...state,
        status: fetchStates.success,
        ...action.generation,
      };
    default:
      return state;
  }
};
export default generationReducer;
