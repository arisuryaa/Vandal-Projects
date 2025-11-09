import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import ButtonBg from "../components/ui/ButtonBg";
import CardPortofolio from "../components/ui/CardPortofolio";
import useDocumentTitle from "../hook/useDocumentTitle";
import OpenNavbar from "../components/layout/OpenNavbar";
import { useDebounce } from "use-debounce";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance, axiosServer } from "../lib/axios";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PortofolioPage = () => {
  const navigate = useNavigate();
  useDocumentTitle("Vandal | Portofolio");

  const [inputActive, setInputActive] = useState(false);
  const [text, setText] = useState("");
  const [debounceText] = useDebounce(text, 800);
  const [resultSearch, setResultSearch] = useState();
  const [resultPortofolio, setResultPortofolio] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalCurrentBalance: 0,
    totalProfitLoss: 0,
    totalChangePercent: 0,
    topPerformer: { coin: "-", change: 0 },
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const dataTrending = useSelector((state) => state.dataTrending);
  const apiKey = import.meta.env.VITE_API_KEY;

  const getDataSearch = async (qur) => {
    try {
      if (!qur) return;
      const response = await axiosInstance.get("/search", { params: { query: qur } });
      setResultSearch(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataGlobal = async () => {
    const response = await axiosInstance.get(`/global`, {
      params: { x_cg_demo_api_key: apiKey },
    });
    dispatch({
      type: "STORE_DATA_GLOBAL",
      payload: response.data.data,
    });
  };

  const getDataPortofolio = async (user) => {
    try {
      const token = await user.getIdToken();
      const result = await axiosServer.get("/portofolio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return result.data.portfolioData.result || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getCoinMarketData = async (coinIds) => {
    if (!coinIds.length) return {};
    try {
      const response = await axiosInstance.get(`/coins/markets`, {
        params: {
          vs_currency: "usd",
          ids: coinIds.join(","),
          x_cg_demo_api_key: apiKey,
        },
      });

      const map = {};
      response.data.forEach((coin) => {
        map[coin.id] = {
          currentPrice: coin.current_price,
          priceChange24h: coin.price_change_percentage_24h,
        };
      });
      return map;
    } catch (error) {
      console.error("Error fetching market data:", error);
      return {};
    }
  };

  const calculatePortfolioStats = async (portfolio) => {
    if (!portfolio.length) return;

    const coinIds = portfolio.map((p) => p.coinId);
    const prices = await getCoinMarketData(coinIds);

    let totalBalance = 0;
    let totalCurrentBalance = 0;
    let totalProfitLoss = 0;
    let totalChangePercent = 0;
    let topPerformer = { coin: "-", change: 0 };

    portfolio.forEach((p) => {
      const coinData = prices[p.coinId];
      if (!coinData) return;

      const currentValue = p.quantity * coinData.currentPrice;
      const profitLoss = currentValue - p.totalSpend;
      const changePercent = coinData.priceChange24h;

      totalBalance += Number(p.totalSpend);
      totalCurrentBalance += currentValue;
      totalProfitLoss += profitLoss;
      totalChangePercent += changePercent;

      if (changePercent > topPerformer.change) {
        topPerformer = { coin: p.coinId, change: changePercent };
      }
    });

    setStats({
      totalBalance,
      totalCurrentBalance,
      totalProfitLoss,
      totalChangePercent: totalChangePercent / portfolio.length,
      topPerformer,
    });
  };

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    getDataGlobal();
  }, []);

  useEffect(() => {
    getDataSearch(debounceText);
  }, [debounceText]);

  const handleAddCoin = (coin) => {
    navigate(`/addcoin/${coin.id}`);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const result = await getDataPortofolio(user);
        setResultPortofolio(result);
        await calculatePortfolioStats(result);
        setLoading(false);
      } else {
        console.error("User not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {inputActive && <OpenNavbar mode="add" text={text} setText={setText} resultSearch={resultSearch} dataTrending={dataTrending} setInputActive={setInputActive} onAddCoin={handleAddCoin} />}

      <Navbar />

      <div className="px-10 mt-28">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">My Portfolio</h1>
          <div className="flex gap-2 items-center">
            <button onClick={() => setInputActive(true)} className="bg-blue-600 text-white px-3 py-2 rounded-lg">
              + Add Coin
            </button>
            <ButtonBg>Get Recommendation</ButtonBg>
          </div>
        </div>

        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : (
          <div className="flex justify-center gap-4 mt-8">
            <CardPortofolio title={formatCurrency(stats.totalBalance)} description="Total Spend" style={"w-[19%]"} />
            <CardPortofolio title={formatCurrency(stats.totalCurrentBalance)} description="Current Balance" style={"w-[19%]"} />
            <CardPortofolio title={`${stats.totalChangePercent.toFixed(2)}%`} description="24h Portfolio Change" style={"w-[19%]"} />
            <CardPortofolio title={formatCurrency(stats.totalProfitLoss)} description="Total Profit / Loss" style={"w-[19%]"} />
            <CardPortofolio title={`${stats.topPerformer?.coin?.toUpperCase?.() || "-"} (${stats.topPerformer?.change?.toFixed?.(2) || "0.00"}%)`} description="Top Performer 24h" style={"w-[19%]"} />
          </div>
        )}
      </div>
    </>
  );
};

export default PortofolioPage;
