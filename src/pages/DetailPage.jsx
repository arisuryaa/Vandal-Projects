import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { axiosInstance } from "../lib/axios";
import { CiStar } from "react-icons/ci";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
const apiKey = import.meta.env.VITE_API_KEY;
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DetailPage = () => {
  const [dataCoin, setDataCoin] = useState([]);
  const [percent, setPercent] = useState(null);
  const [chartData, setChartData] = useState([]);
  const { id } = useParams();

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false }, // CoinMarketCap tidak pakai legend
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `$${context.raw.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
          title: function (context) {
            const date = new Date(context[0].label);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          maxTicksLimit: 6,
          color: "#666",
        },
      },
      y: {
        grid: { color: "rgba(200,200,200,0.1)", drawBorder: false },
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString("en-US")}`;
          },
          color: "#666",
        },
      },
    },
  };

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
      // console.log(prices);
    } catch (error) {
      console.log(error);
    }
  };

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
  }, [id]);

  // console.log(dataCoin);

  useEffect(() => {
    if (!dataCoin?.market_data) return; // guard biar ga error pas data masih kosong
    const currentPrice = dataCoin.market_data.current_price?.usd;
    const priceChange24h = dataCoin.market_data.price_change_24h_in_currency?.usd;
    if (currentPrice && priceChange24h) {
      const price24hAgo = currentPrice - priceChange24h;
      const percentChange = (priceChange24h / price24hAgo) * 100;
      setPercent(percentChange.toFixed(1));
    }

    getDataChart(id);
  }, [dataCoin]);

  console.log(dataCoin);

  return (
    <div className="pt-32 px-10">
      <div className="flex gap-2 h-fit border-b border-gray-400 mb-10">
        <div className="w-[35%] flex flex-col gap-4 min-h-full border-r border-gray-400 pr-10 pb-10">
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
            <h2 className={percent > 0 ? `text-green-500 font-semibold` : `text-red-500`}> {`${percent}% (24h)`} </h2>
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
              <h1 className="font-semibold">{dataCoin?.market_data?.circulating_supply.toLocaleString("en-US")}</h1>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Total Supply </h1>
              </div>
              <h1 className="font-semibold"> {dataCoin?.market_data?.total_supply.toLocaleString("en-US")}</h1>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Max Supply </h1>
              </div>
              <h1 className="font-semibold"> {dataCoin?.market_data?.max_supply == null ? "infinite" : dataCoin?.market_data?.max_supply?.toLocaleString("en-US")}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <h1 className="text-xl font-bold">Info</h1>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Website</h1>
              </div>
              <a className="font-semibold text-sm bg-gray-600 opacity-85 px-3 py-1 rounded-lg" href={dataCoin?.links?.homepage[0]} target="_blank">
                {dataCoin?.links?.homepage[0]}
              </a>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Explorers</h1>
              </div>
              <a className="font-semibold text-sm bg-gray-600 opacity-85 px-3 py-1 rounded-lg" href={dataCoin?.links?.blockchain_site[0]} target="_blank">
                {dataCoin?.links?.blockchain_site[0]}
              </a>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Community</h1>
              </div>
              <a className="font-semibold text-sm bg-gray-600 opacity-85 px-3 py-1 rounded-lg" href={dataCoin?.links?.twitter_screen_name} target="_blank">
                {dataCoin?.links?.twitter_screen_name}
              </a>
            </div>
            <div className="flex justify-between items-center px-1 py-3 border-b border-gray-500">
              <div className="flex items-center">
                <h1 className="capitalize opacity-80">Source Code</h1>
              </div>
              <a className="font-semibold text-sm bg-gray-600 opacity-85 px-3 py-1 rounded-lg" href={dataCoin?.links?.repos_url?.github[0]} target="_blank">
                {dataCoin?.links?.repos_url?.github[0]}
              </a>
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <h1 className="pb-4 font-semibold">Sentiment Market</h1>
            <div className="flex items-center gap-4  w-full ">
              <span className="text-white">Bullish</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden flex">
                <div className="bg-green-500" style={{ width: `${dataCoin?.sentiment_votes_up_percentage}%` }}></div>
                <div className="bg-red-500" style={{ width: `${dataCoin?.sentiment_votes_down_percentage}%` }}></div>
              </div>
              <span className="text-white">Bearish</span>
            </div>
          </div>
        </div>
        <div className="w-[70%] px-6 py-3">
          <div className="flex mb-6">
            <h1 className="text-2xl font-bold">Chart Overview 7D</h1>
          </div>
          <div className="w-full ">
            <Line data={chartData[id] || { labels: [], datasets: [] }} options={options} />
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">What is {dataCoin.id}</h1>
            <p className="leading-7 text-sm text-white opacity-80">{dataCoin?.description?.en}</p>
          </div>
        </div>
      </div>
      <div className="mb-10 ">
        <h1 className="text-3xl font-semibold capitalize">{dataCoin.id} News</h1>
      </div>
    </div>
  );
};

export default DetailPage;
