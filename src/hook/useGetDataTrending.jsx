import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";

const apiKey = import.meta.env.VITE_API_KEY;

export const useGetDataTrending = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const responseTrending = await axiosInstance.get("/search/trending", {
          params: {
            x_cg_demo_api_key: apiKey,
          },
        });
        dispatch({
          type: "STORE_DATA_TRENDING",
          payload: responseTrending.data.coins,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrending();
  }, [dispatch]);
};
