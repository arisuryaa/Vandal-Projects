const DEFAULT_STATE = {
  data: [],
};

export const dataWatchlistReducer = (state = DEFAULT_STATE, action) => {
  if (action.type == "STORE_DATA_WATCHLIST") {
    const dataWatchlist = action.payload;
    const dupeState = { ...state };
    dupeState.data = [...state.data, dataWatchlist];
    return dupeState;
  }
  return state;
};
