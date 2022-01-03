import { DRAGON } from "../action/types";
import fetchStates from "./fetchStates";

const DEFUALT_DRAGON = {
  generationId: "",
  dragonId: "",
  nickName: "",
  birthDate: "",
  traits: [],
};

const dragon = (state = DEFUALT_DRAGON, action) => {
  switch (action.type) {
    case DRAGON.FETCH:
      return {
        ...state,
        status: fetchStates.fetching,
      };
    case DRAGON.FETCH_ERROR:
      return {
        ...state,
        status: fetchStates.error,
        message: action.message,
      };
    case DRAGON.FETCH_SUCCESS:
      return {
        ...state,
        status: fetchStates.success,
        ...action.dragon,
      };
    default:
      return state;
  }
};
export default dragon;
