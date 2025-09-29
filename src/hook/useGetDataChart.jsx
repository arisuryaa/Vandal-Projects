import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
const apiKey = import.meta.env.VITE_API_KEY;

const useGetDataChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const getDataChart = async (id = "bitcoin") => {
      try {
        const res = await axiosInstance.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
          params: {
            x_cg_demo_api_key: apiKey,
            vs_currency: "usd",
            days: 7,
          },
        });
        const prices = res.data.prices;
        setChartData((prev) => ({
          ...prev,
          [id]: {
            labels: prices.map((p) => new Date(p[0]).toLocaleDateString("en-US", { month: "short" })),
            datasets: [
              {
                data: prices.map((p) => p[1]),
                borderColor: "red",
                fill: false,
                tension: 0.25,
                pointRadius: 0,
                borderWidth: 1.5,
              },
            ],
          },
        }));
      } catch (error) {
        console.log(error);
      }
    };
    getDataChart();
  }, []);

  return { chartData, options, setChartData };
};

export default useGetDataChart;
