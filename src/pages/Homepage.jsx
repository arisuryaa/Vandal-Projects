import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../components/ui/Card";
import CardList from "../components/ui/CardList";
import { axiosInstance } from "../lib/axios";
const apiKey = import.meta.env.VITE_API_KEY;

const Homepage = () => {
  const globalData = useSelector((state) => state.dataGlobal);
  const [dataTrending, setDataTrending] = useState([]);
  const newArr = dataTrending.slice(0, 3);
  const gainerArr = dataTrending.slice(4, 7);
  const getDataTrending = async () => {
    try {
      const responseTrending = await axiosInstance.get("/search/trending", {
        params: {
          x_cg_demo_api_key: apiKey,
        },
      });
      setDataTrending(responseTrending.data.coins);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataTrending();
  }, []);

  return (
    <div className="mt-40 px-10 text-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-2xl font-semibold">Cryptocurrencies Price by Market Cap </h1>

        <p className="text-white opacity-45">
          The global cryptocurrency market cap today is $ {globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")}, a{" "}
          {globalData.data.market_cap_change_percentage_24h_usd?.toLocaleString("id-ID", { style: "percent", maximumFractionDigits: 1 })} change in the last 24 hours.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full  my-8">
        <div className="flex flex-col gap-2 ">
          <Card className="w-full" title={globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")} description={"Market Cap 1.1%"} />
          <Card className="w-full" title={"$4,172,439,821,650"} description={"Market Cap 1.1%"} />
        </div>

        <div className="">
          <CardList className="w-full h-full" title="🔥 Trending" data={newArr} />
        </div>
        <div className="">
          <CardList className="w-full h-full" title="🚀 Top Gainer" data={gainerArr} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
