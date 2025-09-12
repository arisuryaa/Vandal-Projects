const DEFAULT_STATE = {
  data: {},
};

export const dataGlobalReducer = (state = DEFAULT_STATE, action) => {
  if (action.type === "STORE_DATA_GLOBAL") {
    const prevState = { ...state };
    prevState.data = action.payload;
    return prevState;
  }

  return state;
};
