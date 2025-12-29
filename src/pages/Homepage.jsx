import React, { useEffect } from "react";
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
import useWatchlist from "../hook/useWatchlist"; // ✅ Ganti import
import ProtectedRoute from "./ProtectedPages/ProtectPage";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Homepage = () => {
  useDocumentTitle("Vandal | Homepage");
  useGetDataTrending();
  const dataTrending = useSelector((state) => state.dataTrending);
  const globalData = useSelector((state) => state.dataGlobal);
  const { dataMarkets, isLoading, pagination, setPagination } = useGetDataMarket();
  const { chartData, options } = useGetDataChart();

  const { watchlist, loading: watchlistLoading, addToWatchlist, removeFromWatchlist, isInWatchlist, fetchWatchlist } = useWatchlist();

  // ✅ Fix useEffect dengan dependency yang benar
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  return (
    <ProtectedRoute>
      <>
        <Navbar />
        {/* HAPUS Loading dari sini - sudah ditangani ProtectedRoute */}
        <div className="pt-32 px-4 sm:px-6 md:px-10 text-white">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-xl sm:text-2xl font-semibold">Cryptocurrencies Price by Market Cap </h1>

            <p className="text-white opacity-45 text-sm sm:text-base">
              The global cryptocurrency market cap today is $ {globalData?.data?.total_market_cap?.usd.toLocaleString("en-US")}, a{" "}
              {globalData.data.market_cap_change_percentage_24h_usd?.toLocaleString("id-ID", { style: "percent", maximumFractionDigits: 1 })} change in the last 24 hours.
            </p>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 w-full my-8">
            <div className="flex flex-col gap-2">
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

          {/* Responsive Tabs */}
          <div className="flex items-center gap-4 sm:gap-8 pb-4 pt-6 border-b border-background mb-4 text-white opacity-70 overflow-x-auto">
            <Link className="pb-2 text-primary opacity-100 whitespace-nowrap text-sm sm:text-base">All</Link>
            <Link className="pb-2 hover:border-b-2 transition-all border-primary whitespace-nowrap text-sm sm:text-base">Binance Launchpool</Link>
            <Link className="pb-2 hover:border-b-2 transition-all border-primary whitespace-nowrap text-sm sm:text-base">Layer 2</Link>
            <Link className="pb-2 hover:border-b-2 transition-all border-primary whitespace-nowrap text-sm sm:text-base">Stablecoin</Link>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-box bg-base-100">
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-400">Loading market data...</p>
              </div>
            ) : (
              <table className="table bg-backgroundBlack w-full min-w-[800px]">
                {/* Table content tetap sama */}
                <thead>
                  <tr className="text-xs">
                    <th className="hidden sm:table-cell"></th>
                    <th>#</th>
                    <th>Coin</th>
                    <th className="hidden lg:table-cell"></th>
                    <th>Price</th>
                    <th>24h</th>
                    <th className="hidden md:table-cell">24h Volume</th>
                    <th className="hidden lg:table-cell">Market Cap</th>
                    <th className="hidden xl:table-cell">Last 7 Day</th>
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
                            <td className="hidden sm:table-cell">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation(); // ✅ Tambahkan ini juga
                                  if (isInWatchlist(coin.id)) {
                                    removeFromWatchlist(coin.id);
                                  } else {
                                    addToWatchlist(coin.id);
                                  }
                                }}
                                disabled={watchlistLoading} // ✅ Disable saat loading
                                className="hover:scale-110 transition-transform disabled:opacity-50"
                              >
                                {isInWatchlist(coin.id) ? (
                                  <FaStar className="text-xl text-yellow-400 cursor-pointer" />
                                ) : (
                                  <CiStar className="text-xl text-white opacity-75 cursor-pointer hover:opacity-100" />
                                )}
                              </button>
                            </td>
                            <Link className="contents" to={`/detail/${coin.id}`}>
                              <td>{index}</td>
                              <td>
                                <div className="flex items-center gap-2 h-fit">
                                  <img src={coin.image} className="w-6 h-6 rounded-full" alt="" />
                                  <p className="capitalize hidden sm:inline">{coin.id}</p>
                                  <p className="text-xs text-white opacity-70 uppercase">{coin.symbol}</p>
                                </div>
                              </td>
                              <td className="hidden lg:table-cell">
                                <h1 className="text-primary border border-primary rounded-full py-1 px-2 text-center whitespace-nowrap">Buy</h1>
                              </td>
                              <td className="whitespace-nowrap">${coin.current_price.toLocaleString("en-US")}</td>
                              <td className={coin.price_change_percentage_24h > 0 ? `text-green-500` : `text-red-500`}>{Number(coin.price_change_percentage_24h).toFixed(1) + " %"}</td>
                              <td className="hidden md:table-cell whitespace-nowrap">$ {coin.total_volume.toLocaleString("en-US")}</td>
                              <td className="hidden lg:table-cell whitespace-nowrap">$ {coin.market_cap.toLocaleString("en-US")}</td>
                              <td className="hidden xl:table-cell">
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-6 py-6">
            <button className="cursor-pointer px-3 py-2 bg-background rounded-lg hover:bg-gray-800 disabled:opacity-50" onClick={() => setPagination(pagination - 1)} disabled={pagination == 1}>
              {`<`}
            </button>
            <h1 className="bg-primary px-4 py-2 rounded-lg text-sm">{pagination}</h1>
            <button className="cursor-pointer px-3 py-2 bg-background rounded-lg hover:bg-gray-800" onClick={() => setPagination(pagination + 1)}>
              {`>`}
            </button>
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
};

export default Homepage;
