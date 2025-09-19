const DEFAULT_STATE = {
  data: [],
};

export const dataTrendingReducer = (state = DEFAULT_STATE, action) => {
  if (action.type === "STORE_DATA_TRENDING") {
    const newState = { ...state };
    newState.data = action.payload;
    return newState;
  }

  return state;
};
