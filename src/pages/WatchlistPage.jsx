import React from "react";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { axiosServer, axiosInstance } from "../lib/axios";
import Navbar from "../components/layout/Navbar";
import useDocumentTitle from "../hook/useDocumentTitle";
import { CiStar } from "react-icons/ci";
import { Link } from "react-router";
import useAddToWatchlist from "../hook/useAddToWatchlist";

const WatchlistPage = () => {
  useDocumentTitle("Vandal | Watchlist Page");

  const [watchlistCoin, setWatchlistCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noWatchlistCoin, setNoWatchlistCoin] = useState(false);

  const getDetailedWatchlist = async (user) => {
    try {
      const token = await user.getIdToken();
      const { data } = await axiosServer.get("/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(data);
      return data.data;
    } catch (error) {
      console.error("Error getting detailed watchlist:", error);
      return [];
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // user sudah login → baru ambil data
        setLoading(true);
        const result = await getDetailedWatchlist(user);

        if (result.length === 0) {
          setNoWatchlistCoin(true);
        } else {
          setWatchlistCoins(result);
          setNoWatchlistCoin(false);
          console.log(result);
        }
        setLoading(false);
      } else {
        // belum login → tampilkan pesan
        setNoWatchlistCoin(true);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup listener saat unmount
  }, []);

  useEffect(() => {
    console.log(watchlistCoin);
  }, [watchlistCoin]);

  if (noWatchlistCoin) return <p>No coins in watchlist.</p>;

  return (
    <>
      <Navbar />
      <div className="px-10 mt-28">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">Your Coin Watchlist</h1>
          <p className="text-background">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit, ipsum?</p>
        </div>

        {/* TABEL */}
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
                {watchlistCoin.length > 0
                  ? watchlistCoin.map((coin, i) => {
                      // const chartData = {
                      //   labels: coin.sparkline_in_7d.price.map((_, idx) => idx),
                      //   datasets: [
                      //     {
                      //       data: coin.sparkline_in_7d.price,
                      //       borderColor: "red",
                      //       fill: false,
                      //       tension: 0.25,
                      //       pointRadius: 0,
                      //       borderWidth: 1.5,
                      //     },
                      //   ],
                      // };

                      return (
                        <tr key={coin.id} className="hover:bg-gray-900 transition-all cursor-pointer">
                          <td>
                            <button onClick={() => useAddToWatchlist(coin.id)}>
                              <CiStar className="text-xl text-white opacity-75 cursor-pointer" />
                            </button>
                          </td>
                          <Link className="contents" to={`/detail/${coin.id}`}>
                            <td>{i + 1}</td>

                            <td>
                              <div className="flex items-center gap-2 h-fit">
                                <img src={coin.image.thumb} className="w-6 h-6 rounded-full" alt="" />
                                <p className="capitalize">{coin.id}</p>
                                <p className="text-xs text-white opacity-70 uppercase">{coin.symbol}</p>
                              </div>
                            </td>

                            <td className="overflow-x-hidden">
                              <h1 className="text-primary border border-primary rounded-full py-1 px-2 text-center">Buy</h1>
                            </td>

                            <td className="overflow-x-hidden">${coin.market_data.current_price.usd.toLocaleString("en-US")}</td>

                            <td className={coin.market_data.price_change_percentage_24h_in_currency.usd > 0 ? "text-green-500" : "text-red-500"}>
                              {coin.market_data.price_change_percentage_24h_in_currency.usd.toFixed(2) + " %"}
                            </td>

                            <td>$ {coin.market_data.total_volume.usd.toLocaleString("en-US")}</td>

                            <td>$ {coin.market_data.market_cap.usd.toLocaleString("en-US")}</td>

                            {/* <td>
                              <div className="w-full h-[60px]">
                                <Line data={chartData} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                              </div>
                            </td> */}
                          </Link>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchlistPage;
