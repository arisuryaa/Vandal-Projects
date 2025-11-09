import React from "react";
import { axiosServer } from "../lib/axios";
import { getAuth } from "firebase/auth";
// import { useDispatch } from "react-redux";

const useAddToWatchlist = async (coin) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }
  const token = await user.getIdToken();
  console.log(token);

  try {
    const result = await axiosServer.post(
      "/watchlist",
      {
        coinId: coin,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("sukses");
  } catch (error) {
    alert("error");
    console.log(error);
  }
};

export default useAddToWatchlist;
