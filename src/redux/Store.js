import { combineReducers } from "redux";
import { dataGlobalReducer } from "./dataGlobal";
import { dataTrendingReducer } from "./dataTrending";

export const Store = combineReducers({
  dataGlobal: dataGlobalReducer,
  dataTrending: dataTrendingReducer,
});
