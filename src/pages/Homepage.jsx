import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../components/ui/Card";
import CardList from "../components/ui/CardList";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router";
const apiKey = import.meta.env.VITE_API_KEY;

const Homepage = () => {
  const globalData = useSelector((state) => state.dataGlobal);
  const [dataTrending, setDataTrending] = useState([]);
  const [dataMarkets, setDataMarkets] = useState([]);
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

  const getDataMarkets = async () => {
    try {
      const responseMarkets = await axiosInstance.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          per_page: 20,
          x_cg_demo_api_key: apiKey,
        },
      });
      setDataMarkets(responseMarkets.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataTrending();
    getDataMarkets();
  }, []);

  console.log(dataMarkets);
  // console.log(globalData);
  return (
    <div className="pt-40 px-10 text-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-2xl font-semibold">Cryptocurrencies Price by Market Cap </h1>

        <p className="text-white opacity-45">
          The global cryptocurrency market cap today is $ {globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")}, a{" "}
          {globalData.data.market_cap_change_percentage_24h_usd?.toLocaleString("id-ID", { style: "percent", maximumFractionDigits: 1 })} change in the last 24 hours.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full  my-8">
        <div className="flex flex-col gap-2 ">
          <Card className="w-full" title={"$ " + globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")} description={"Total Market Cap"} />
          <Card className="w-full" title={"$ " + globalData?.data?.total_volume?.usd.toLocaleString("en-US")} description={"24h Total Trading Volume"} />
        </div>

        <div className="">
          <CardList className="w-full h-full" title="🔥 Trending" data={newArr} />
        </div>
        <div className="">
          <CardList className="w-full h-full" title="🚀 Top Gainer" data={gainerArr} />
        </div>
      </div>

      <div className="flex items-center gap-8 pb-4 pt-6 border-b border-background mb-4 text-white opacity-70">
        <Link>All</Link>
        <Link>Binance Launchpool</Link>
        <Link>Layer 2</Link>
        <Link>Stablecoin</Link>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table bg-backgroundBlack">
          {/* head */}
          <thead>
            <tr className="text-xs">
              <th></th>
              <th>#</th>
              <th>Coin</th>
              <th></th>
              <th>Price</th>
              <th>24h</th>
              <th>24h Volume</th>
              <th>Market Cap</th>
              <th>Last 7 Day</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {/* row 1 */}

            {dataMarkets.length > 0
              ? dataMarkets.map((e, i) => {
                  return (
                    <tr key={e.id}>
                      <th>⭐</th>
                      <td>{i + 1}</td>
                      <td className="flex items-center gap-2">
                        <img src={e.image} className="w-6 h-6 rounded-full" alt="" />
                        <p>{e.id}</p>
                      </td>
                      <td>Buy</td>
                      <td>${e.current_price.toLocaleString("en-US")}</td>
                      <td className={e.price_change_percentage_24h > 0 ? `text-green-500` : `text-red-500`}>{e.price_change_percentage_24h.toFixed(1) + " %"}</td>
                      <td>$ {e.total_volume.toLocaleString("en-US")}</td>
                      <td>$ {e.market_cap.toLocaleString("en-US")}</td>
                      <td></td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homepage;
