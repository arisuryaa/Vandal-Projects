import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
const apiKey = import.meta.env.VITE_API_KEY;

const useGetDataMarket = () => {
  const [dataMarkets, setDataMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    const getDataMarkets = async () => {
      try {
        setLoading(true);
        const responseMarkets = await axiosInstance.get("/coins/markets", {
          params: {
            vs_currency: "usd",
            per_page: 10,
            x_cg_demo_api_key: apiKey,
            page: pagination,
            sparkline: true,
          },
        });
        setDataMarkets(responseMarkets.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getDataMarkets();
  }, [pagination]);

  return { dataMarkets, setDataMarkets, loading, setLoading, pagination, setPagination };
};

export default useGetDataMarket;
