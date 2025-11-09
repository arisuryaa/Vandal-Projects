import { combineReducers } from "redux";
import { dataGlobalReducer } from "./dataGlobal";
import { dataTrendingReducer } from "./dataTrending";
import { dataWatchlistReducer } from "./dataWatchlist";
import { dataUserReducer } from "./dataUser";

export const Store = combineReducers({
  dataGlobal: dataGlobalReducer,
  dataTrending: dataTrendingReducer,
  dataWatchlist: dataWatchlistReducer,
  dataUser: dataUserReducer,
});
