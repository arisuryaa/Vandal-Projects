import { combineReducers } from "redux";
import { dataGlobalReducer } from "./dataGlobal";
import { dataTrendingReducer } from "./dataTrending";
import { dataWatchlistReducer } from "./dataWatchlist";

export const Store = combineReducers({
  dataGlobal: dataGlobalReducer,
  dataTrending: dataTrendingReducer,
  dataWatchlist: dataWatchlistReducer,
});
