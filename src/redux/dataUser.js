const DEFAULT_STATE = {
  data: {},
};

export const dataUserReducer = (state = DEFAULT_STATE, action) => {
  if (action.type === "STORE_DATA_USER") {
    const prevState = { ...state };
    prevState.data = action.payload;
    return prevState;
  }

  return state;
};
