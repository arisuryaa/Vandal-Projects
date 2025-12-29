import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { axiosLocal } from "../lib/axios";
import Navbar from "../components/layout/Navbar";
import useDocumentTitle from "../hook/useDocumentTitle";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import useWatchlist from "../hook/useWatchlist";
import ProtectedRoute from "./ProtectedPages/ProtectPage";

const WatchlistPage = () => {
  useDocumentTitle("Vandal | Watchlist Page");

  const { watchlist, removeFromWatchlist, isInWatchlist, fetchWatchlist } = useWatchlist();

  const [watchlistCoin, setWatchlistCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDetailedWatchlist = async (user) => {
    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const { data } = await axiosLocal.get("/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Watchlist response:", data);

      if (data.data && data.data.length > 0) {
        setWatchlistCoins(data.data);
      } else {
        setWatchlistCoins([]);
      }
    } catch (error) {
      console.error("❌ Error getting watchlist:", error);
      setError("Failed to load watchlist. Please try again.");
      setWatchlistCoins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchWatchlist();
        await getDetailedWatchlist(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchWatchlist]);

  const handleRemoveFromWatchlist = async (coinId) => {
    await removeFromWatchlist(coinId);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await getDetailedWatchlist(user);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="px-4 sm:px-6 md:px-10 mt-28 mb-20">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400">Loading your watchlist...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="px-4 sm:px-6 md:px-10 mt-28 mb-20">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) getDetailedWatchlist(user);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
            >
              Try Again
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (watchlistCoin.length === 0) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="px-4 sm:px-6 md:px-10 mt-28 mb-20">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-xl sm:text-2xl font-medium text-white">Your Coin Watchlist</h1>
            <p className="text-gray-400 text-sm sm:text-base">Track your favorite cryptocurrencies in one place</p>
          </div>

          <div className="flex flex-col items-center justify-center py-20 bg-backgroundBlack rounded-lg">
            <CiStar className="text-6xl text-gray-600 mb-4" />
            <h2 className="text-xl text-white mb-2">No coins in watchlist</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">Start building your watchlist by clicking the star icon on any coin from the homepage</p>
            <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
              Browse Coins
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-10 mt-28 mb-20">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-medium text-white">Your Coin Watchlist</h1>
            <span className="text-sm text-gray-400">
              {watchlistCoin.length} {watchlistCoin.length === 1 ? "coin" : "coins"}
            </span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Track your favorite cryptocurrencies and their performance</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-base-100">
          <table className="table bg-backgroundBlack w-full min-w-[800px]">
            <thead>
              <tr className="text-xs">
                <th className="w-12"></th>
                <th className="w-12">#</th>
                <th>Coin</th>
                <th className="hidden lg:table-cell w-24"></th>
                <th>Price</th>
                <th>24h</th>
                <th className="hidden md:table-cell">24h Volume</th>
                <th className="hidden lg:table-cell">Market Cap</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {watchlistCoin.map((coin, i) => (
                <tr key={coin.id} className="hover:bg-gray-900 transition-all cursor-pointer group">
                  {/* Star Button */}
                  <td>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFromWatchlist(coin.id);
                      }}
                      className="hover:scale-110 transition-transform"
                      title="Remove from watchlist"
                    >
                      <FaStar className="text-xl text-yellow-400 cursor-pointer" />
                    </button>
                  </td>

                  <Link className="contents" to={`/detail/${coin.id}`}>
                    {/* Index */}
                    <td>{i + 1}</td>

                    {/* Coin Info */}
                    <td>
                      <div className="flex items-center gap-2 h-fit">
                        <img
                          src={coin.image}
                          className="w-6 h-6 rounded-full bg-gray-800"
                          alt={coin.name || coin.id}
                          onError={(e) => {
                            // Fallback jika image gagal load
                            e.target.onerror = null;
                            e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><rect width='24' height='24' fill='%23374151'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12' font-weight='bold'>${
                              coin.symbol?.charAt(0).toUpperCase() || "?"
                            }</text></svg>`;
                          }}
                        />
                        <p className="capitalize hidden sm:inline">{coin.name || coin.id}</p>
                        <p className="text-xs text-white opacity-70 uppercase">{coin.symbol}</p>
                      </div>
                    </td>

                    {/* Buy Button */}
                    <td className="hidden lg:table-cell">
                      <h1 className="text-primary border border-primary rounded-full py-1 px-2 text-center whitespace-nowrap">Buy</h1>
                    </td>

                    {/* Price - ✅ FIXED */}
                    <td className="whitespace-nowrap">${coin.current_price?.toLocaleString("en-US") || "N/A"}</td>

                    {/* 24h Change - ✅ FIXED */}
                    <td className={coin.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}>
                      {coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) + "%" : "N/A"}
                    </td>

                    {/* 24h Volume - ✅ FIXED */}
                    <td className="hidden md:table-cell whitespace-nowrap">${coin.total_volume?.toLocaleString("en-US") || "N/A"}</td>

                    {/* Market Cap - ✅ FIXED */}
                    <td className="hidden lg:table-cell whitespace-nowrap">${coin.market_cap?.toLocaleString("en-US") || "N/A"}</td>
                  </Link>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Click the star icon to remove coins from your watchlist</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WatchlistPage;
