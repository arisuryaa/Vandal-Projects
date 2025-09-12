import { combineReducers } from "redux";
import { dataGlobalReducer } from "./dataGlobal";

export const Store = combineReducers({
  dataGlobal: dataGlobalReducer,
});
