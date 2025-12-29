import { useState, useCallback } from "react";
import { axiosServer } from "../lib/axios";
import { getAuth } from "firebase/auth";

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch watchlist - gunakan useCallback untuk stabil reference
  const fetchWatchlist = useCallback(async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const token = await user.getIdToken();
      const result = await axiosServer.get("/watchlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sesuaikan dengan response backend Anda
      // Ambil array coinId dari response
      const coinIds = result.data.data?.map((coin) => coin.id) || [];
      setWatchlist(coinIds);

      console.log("✅ Watchlist fetched:", coinIds);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setWatchlist([]);
    }
  }, []);

  // Add to watchlist
  const addToWatchlist = async (coinId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();
      await axiosServer.post(
        "/watchlist",
        { coinId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state langsung tanpa fetch ulang
      setWatchlist((prev) => [...prev, coinId]);
      console.log("✅ Added to watchlist:", coinId);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("Failed to add to watchlist");
    } finally {
      setLoading(false);
    }
  };

  // Remove from watchlist
  const removeFromWatchlist = async (coinId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      await axiosServer.delete(`/watchlist/${coinId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state langsung tanpa fetch ulang
      setWatchlist((prev) => prev.filter((id) => id !== coinId));
      console.log("✅ Removed from watchlist:", coinId);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      alert("Failed to remove from watchlist");
    } finally {
      setLoading(false);
    }
  };

  // Check if coin is in watchlist
  const isInWatchlist = (coinId) => {
    return watchlist.includes(coinId);
  };

  return {
    watchlist,
    loading,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
};

export default useWatchlist;
