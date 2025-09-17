import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { axiosInstance } from "../lib/axios";
import { CiStar } from "react-icons/ci";
const apiKey = import.meta.env.VITE_API_KEY;

const DetailPage = () => {
  const [dataCoin, setDataCoin] = useState([]);
  const [percent, setPercent] = useState(null);
  const { id } = useParams();

  const getDataDetail = async () => {
    try {
      const response = await axiosInstance.get(`/coins/${id}`, {
        params: {
          vs_currency: "usd",
          x_cg_demo_api_key: apiKey,
          sparkline: true,
        },
      });
      setDataCoin(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataDetail();
  }, []);

  console.log(dataCoin);

  useEffect(() => {
    if (!dataCoin?.market_data) return; // guard biar ga error pas data masih kosong

    const currentPrice = dataCoin.market_data.current_price?.usd;
    const priceChange24h = dataCoin.market_data.price_change_24h_in_currency?.usd;

    if (currentPrice && priceChange24h) {
      const price24hAgo = currentPrice - priceChange24h;
      const percentChange = (priceChange24h / price24hAgo) * 100;

      setPercent(percentChange.toFixed(1));
    }
  }, [dataCoin]);

  return (
    <div className="pt-32 px-10">
      <div className="flex gap-2 ">
        <div className="w-[35%] flex flex-col gap-4 h-full border-r border-gray-400 pr-10">
          <div className="flex items-center gap-4 mb-4">
            <Link to={"/"}>{`Cryptocurrencies`}</Link>
            <p>{`>`}</p>
            <p className="capitalize text-primary font-semibold">{dataCoin.id} Price</p>
          </div>
          <div className="flex items-center gap-2">
            <img src={dataCoin?.image?.small} className="w-8 h-8" alt="" />
            <h1 className="text-xl font-semibold capitalize">{dataCoin.id}</h1>
            <h1 className="text-white uppercase opacity-70 text-sm">$ {dataCoin.symbol}</h1>
            <span className="ml-3 py-1 px-1 text-xs rounded-sm bg-gray-400 text-white opacity-90"># {dataCoin?.market_cap_rank}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">$ {dataCoin?.tickers?.[6]?.last.toLocaleString("en-US")}</h1>
            <h2 className={percent > 0 ? `text-green-500 font-semibold` : `text-red-500`}> {`${percent} (24h)`} </h2>
          </div>
          <div className="w-full flex gap-1">
            <button type="submit" className="flex gap-3 justify-center items-center w-[85%] bg-primary  text-left px-4 py-2  rounded-lg shadow shadow-primary">
              <div className=" flex text-left items-center w-full justify-start">
                <Link to={"/"}>
                  <h1>Add to Portofolio</h1>
                </Link>
              </div>
            </button>
            <button type="submit" className="w-[15%] bg-primary flex justify-center items-center rounded-lg">
              <CiStar className=" text-lg text-white opacity-75 cursor-pointer" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Market Cap</h1>
              </div>
              <h1 className="font-semibold">$ {dataCoin?.market_data?.market_cap?.usd.toLocaleString("en-US")}</h1>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Fully Diluted Valuation</h1>
              </div>
              <h1 className="font-semibold">$ {dataCoin?.market_data?.fully_diluted_valuation?.usd.toLocaleString("en-US")}</h1>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">24 Hour Trading Vol</h1>
              </div>
              <h1 className="font-semibold">$ {dataCoin?.market_data?.market_cap?.usd.toLocaleString("en-US")}</h1>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Circulating Supply </h1>
              </div>
              <h1 className="font-semibold">$ {dataCoin?.market_data?.market_cap?.usd.toLocaleString("en-US")}</h1>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Total Supply </h1>
              </div>
              <h1 className="font-semibold">$ {dataCoin?.market_data?.market_cap?.usd.toLocaleString("en-US")}</h1>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Max Supply </h1>
              </div>
              <h1 className="font-semibold">$ {dataCoin?.market_data?.market_cap?.usd.toLocaleString("en-US")}</h1>
            </div>
          </div>
        </div>
        <div className="w-[70%]"></div>
      </div>
    </div>
  );
};

export default DetailPage;
