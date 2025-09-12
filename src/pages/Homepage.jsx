import React from "react";
import { useSelector } from "react-redux";

const Homepage = () => {
  const globalData = useSelector((state) => state.dataGlobal);
  console.log(globalData);
  return (
    <div className="mt-40 px-10 text-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-2xl font-semibold">Cryptocurrencies Price by Market Cap </h1>

        <p className="text-white opacity-45">
          The global cryptocurrency market cap today is $ {globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")}, a{" "}
          {globalData.data.market_cap_change_percentage_24h_usd?.toLocaleString("id-ID", { style: "percent", maximumFractionDigits: 1 })} change in the last 24 hours.
        </p>
      </div>
    </div>
  );
};

export default Homepage;
