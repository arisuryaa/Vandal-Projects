import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Link, useNavigate } from "react-router";
import { Line } from "react-chartjs-2";
import useDocumentTitle from "../hook/useDocumentTitle";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WatchlistPage = () => {
  useDocumentTitle("Vandal | Watchlist Page");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dataWatchlist = useSelector((state) => state.dataWatchlist);

  console.log(dataWatchlist);

  const removeToWatchlist = (id) => {
    dispatch({
      type: "DELETE_DATA_WATCHLIST",
      payload: id,
    });
    alert("sukses");
  };

  useEffect(() => {
    if (dataWatchlist.data.length <= 0) {
      navigate("/");
      return;
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="px-10 mt-32">
        <div className="flex flex-col gap-2 mb-12">
          <h1 className="text-2xl font-semibold">Your Coin Watchlist</h1>
          <p className="text-sm text-white opacity-75">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque, harum.</p>
        </div>
        <div className="overflow-x-auto rounded-box  bg-base-100">
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
              {dataWatchlist.data.length > 0
                ? dataWatchlist.data.map((coin, i) => {
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

                    return (
                      <tr key={coin.id} className="hover:bg-gray-900 transition-all cursor-pointer">
                        <td>
                          <button onClick={() => removeToWatchlist(coin.id)}>
                            <FaStar className="text-xl text-orange-400  opacity-75 cursor-pointer" />
                          </button>
                        </td>
                        <Link className="contents" to={`/detail/${coin.id}`}>
                          <td>{i + 1}</td>

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
        </div>
      </div>
    </>
  );
};

export default WatchlistPage;
