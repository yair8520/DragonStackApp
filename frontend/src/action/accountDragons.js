import { fetchFromAccount } from "./account";
import { ACCOUNT_DRAGONS } from "./types";

export const fetchAccountDragons = () =>
  fetchFromAccount({
    endpoint: "dragons",
    options: { credentials: "include" },
    FETCH_TYPE: ACCOUNT_DRAGONS.FETCH,
    ERROR_TYPE: ACCOUNT_DRAGONS.FETCH_ERROR,
    SUCCESS_TYPE: ACCOUNT_DRAGONS.FETCH_SUCCESS,
  });
