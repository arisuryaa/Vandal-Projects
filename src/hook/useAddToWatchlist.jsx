import React from "react";
import { useDispatch } from "react-redux";

const useAddToWatchlist = (coin) => {
  const dispatch = useDispatch();
  dispatch({
    type: "STORE_DATA_WATCHLIST",
    payload: coin,
  });
  alert("SUCCESS");
};

export default useAddToWatchlist;
