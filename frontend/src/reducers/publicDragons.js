import { PUBLIC_DRAGONS } from "../action/types";
import fetchStates from "./fetchStates";

const DEFUALT_GENERATION = { dragons: [] };

const publicDragons = (state = DEFUALT_GENERATION, action) => {
  switch (action.type) {
    case PUBLIC_DRAGONS.FETCH:
      return {
        ...state,
        status: fetchStates.fetching,
      };
    case PUBLIC_DRAGONS.FETCH_ERROR:
      return {
        ...state,
        status: fetchStates.error,
        message: action.message,
      };
    case PUBLIC_DRAGONS.FETCH_SUCCESS:
      return {
        ...state,
        status: fetchStates.success,
        dragons: action.dragons,
      };
    default:
      return state;
  }
};
export default publicDragons;
