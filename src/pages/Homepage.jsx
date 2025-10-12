import React from "react";
import Card from "../components/ui/Card";
import CardList from "../components/ui/CardList";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Line } from "react-chartjs-2";
import { CiStar } from "react-icons/ci";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Navbar from "../components/layout/Navbar";
import useDocumentTitle from "../hook/useDocumentTitle";
import { useGetDataTrending } from "../hook/useGetDataTrending";
import useGetDataMarket from "../hook/useGetDataMarket";
import useGetDataChart from "../hook/useGetDataChart";
import useAddToWatchlist from "../hook/useAddToWatchlist";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Homepage = () => {
  useDocumentTitle("Vandal | Homepage");
  useGetDataTrending();
  const dataTrending = useSelector((state) => state.dataTrending);
  const globalData = useSelector((state) => state.dataGlobal);
  const { dataMarkets, loading, pagination, setPagination } = useGetDataMarket();
  const { chartData, options } = useGetDataChart();

  return (
    <>
      <Navbar />
      <div className="pt-32 px-10 text-white">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl font-semibold">Cryptocurrencies Price by Market Cap </h1>

          <p className="text-white opacity-45">
            The global cryptocurrency market cap today is $ {globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")}, a{" "}
            {globalData.data.market_cap_change_percentage_24h_usd?.toLocaleString("id-ID", { style: "percent", maximumFractionDigits: 1 })} change in the last 24 hours.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full  my-8">
          <div className="flex flex-col gap-2 ">
            <Card
              chart={<div className="w-full h-[60px]">{chartData.bitcoin ? <Line data={chartData.bitcoin} options={options} /> : <p>Loading...</p>}</div>}
              className="w-full"
              title={"$ " + globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")}
              description={"Total Market Cap"}
            />
            <Card
              className="w-full"
              title={"$ " + globalData?.data?.total_volume?.usd.toLocaleString("en-US")}
              description={"24h Total Trading Volume"}
              chart={<div className="w-full h-[60px]">{chartData.bitcoin ? <Line data={chartData.bitcoin} options={options} /> : <p>Loading...</p>}</div>}
            />
          </div>

          <div className="">
            <CardList className="w-full h-full" title="🔥 Trending" data={dataTrending.data.slice(0, 3)} />
          </div>
          <div className="">
            <CardList className="w-full h-full" title="🚀 Top Gainer" data={dataTrending.data.slice(0, 3)} />
          </div>
        </div>

        <div className="flex items-center gap-8 pb-4 pt-6 border-b border-background mb-4 text-white opacity-70">
          <Link className="pb-2 text-primary opacity-100">All</Link>
          <Link className="pb-2 hover:border-b-2 transition-all border-primary">Binance Launchpool</Link>
          <Link className="pb-2 hover:border-b-2 transition-all border-primary">Layer 2</Link>
          <Link className="pb-2 hover:border-b-2 transition-all border-primary">Stablecoin</Link>
        </div>

        <div className="overflow-x-auto rounded-box  bg-base-100">
          {loading ? (
            <p className="py-4 text-center ">Loading...</p>
          ) : (
            <table className="table bg-backgroundBlack overflow-x-hidden">
              <thead>
                <tr className="text-xs overflow-x-hidden">
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
                {dataMarkets.length > 0
                  ? dataMarkets.map((coin, i) => {
                      const chartData = {
                        labels: coin.sparkline_in_7d.price.map((_, idx) => idx),
                        datasets: [
                          {
                            data: coin.sparkline_in_7d.price,
                            borderColor: "red",
                            fill: false,
                            tension: 0.25,
                            pointRadius: 0,
                            borderWidth: 1.5,
                          },
                        ],
                      };
                      const index = (pagination - 1) * 10 + (i + 1);

                      return (
                        <tr key={coin.id} className="hover:bg-gray-900 transition-all cursor-pointer">
                          <td>
                            <button onClick={() => useAddToWatchlist(coin)}>
                              <CiStar className="text-xl text-white opacity-75 cursor-pointer" />
                            </button>
                          </td>
                          <Link className="contents" to={`/detail/${coin.id}`}>
                            <td>{index}</td>

                            <td>
                              <div className="flex items-center gap-2 h-fit">
                                <img src={coin.image} className="w-6 h-6 rounded-full" alt="" />
                                <p className="capitalize">{coin.id}</p>
                                <p className="text-xs text-white opacity-70 uppercase">{coin.symbol}</p>
                              </div>
                            </td>

                            <td className="overflow-x-hidden">
                              <h1 className="text-primary border border-primary rounded-full py-1 px-2 text-center">Buy</h1>
                            </td>

                            <td className="overflow-x-hidden">${coin.current_price.toLocaleString("en-US")}</td>

                            <td className={coin.price_change_percentage_24h > 0 ? `text-green-500` : `text-red-500`}>{Number(coin.price_change_percentage_24h).toFixed(1) + " %"}</td>

                            <td>$ {coin.total_volume.toLocaleString("en-US")}</td>

                            <td>$ {coin.market_cap.toLocaleString("en-US")}</td>

                            <td>
                              <div className="w-full h-[60px]">
                                <Line data={chartData} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                              </div>
                            </td>
                          </Link>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-center items-center gap-6 py-6">
          <button className="cursor-pointer" onClick={() => setPagination(pagination - 1)} disabled={pagination == 1}>{`<`}</button>
          <h1 className="bg-primary px-4 py-2 rounded-lg text-sm">{pagination}</h1>
          <button className="cursor-pointer" onClick={() => setPagination(pagination + 1)}>{`>`}</button>
        </div>
      </div>
    </>
  );
};

export default Homepage;
