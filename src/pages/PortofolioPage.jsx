import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import ButtonBg from "../components/ui/ButtonBg";
import CardPortofolio from "../components/ui/CardPortofolio";
import useDocumentTitle from "../hook/useDocumentTitle";
import OpenNavbar from "../components/layout/OpenNavbar";
import { useDebounce } from "use-debounce";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance, axiosServer } from "../lib/axios";
import { Link, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PortofolioPage = () => {
  const navigate = useNavigate();
  useDocumentTitle("Vandal | Portofolio");

  const [inputActive, setInputActive] = useState(false);
  const [text, setText] = useState("");
  const [debounceText] = useDebounce(text, 800);
  const [resultSearch, setResultSearch] = useState();
  const [resultPortofolio, setResultPortofolio] = useState([]);
  const [marketData, setMarketData] = useState({});
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
    setMarketData(prices);

    let totalBalance = 0;
    let totalCurrentBalance = 0;
    let totalProfitLoss = 0;
    let totalChangePercent = 0;
    let topPerformer = { coin: "-", change: 0 };

    const updatedPortfolio = portfolio.map((p) => {
      const coinData = prices[p.coinId];
      if (!coinData) return p;

      const currentValue = p.quantity * coinData.currentPrice;
      const profitLoss = currentValue - p.totalSpend;
      const percentPL = (profitLoss / p.totalSpend) * 100; // ✅ Tambahan: persentase P/L
      const changePercent = coinData.priceChange24h;

      totalBalance += Number(p.totalSpend);
      totalCurrentBalance += currentValue;
      totalProfitLoss += profitLoss;
      totalChangePercent += changePercent;

      if (changePercent > topPerformer.change) {
        topPerformer = { coin: p.coinId, change: changePercent };
      }

      return {
        ...p,
        currentPrice: coinData.currentPrice,
        profitLoss,
        percentPL, // ✅ Simpan ke data coin
        changePercent,
      };
    });

    setResultPortofolio(updatedPortfolio);

    setStats({
      totalBalance,
      totalCurrentBalance,
      totalProfitLoss,
      totalChangePercent: totalChangePercent / portfolio.length,
      topPerformer,
    });
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0.00";
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
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium">My Portfolio</h1>
            <p className="text-background text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, repellendus?</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => setInputActive(true)} className="bg-slate-800 text-sm cursor-pointer hover:bg-background transition-all text-white px-3 py-2 rounded-lg">
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
            <CardPortofolio
              title={`${stats.totalChangePercent.toFixed(2)}%`}
              description="24h Portfolio Change"
              style={stats.totalChangePercent > 0 ? "w-[19%] text-green-500" : "w-[19%] text-red-500"}
            />
            <CardPortofolio title={formatCurrency(stats.totalProfitLoss)} description="Total Profit / Loss" style={stats.totalProfitLoss > 0 ? "text-green-500 w-[19%] " : "text-red-500 w-[19%] "} />
            <CardPortofolio
              title={`$${stats.topPerformer?.coin || "-"} (${stats.topPerformer?.change?.toFixed?.(2) || "0.00"}%)`}
              description="Top Performer 24h"
              style={stats.topPerformer.change > 0 ? "text-green-500 w-[19%] " : "text-red-500 w-[19%] "}
            />
          </div>
        )}

        <div className="overflow-x-auto rounded-box bg-base-100">
          {loading ? (
            <p className="py-4 text-center">Loading...</p>
          ) : (
            <>
              <h1 className="mt-10 my-4 text-xl font-semibold">Your Coin</h1>
              <table className="table bg-backgroundBlack overflow-x-hidden">
                <thead>
                  <tr className="text-xs">
                    <th>#</th>
                    <th>Coin</th>
                    <th>Price</th>
                    <th>PnL</th>
                    <th>PnL %</th> {/* ✅ Kolom baru */}
                    <th>Quantity</th>
                    <th>Average Price</th>
                    <th>Total Spend</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {resultPortofolio.length > 0 ? (
                    resultPortofolio.map((coin, i) => (
                      <tr key={coin.id || i} className="hover:bg-gray-900 transition-all cursor-pointer">
                        <Link className="contents" to={`/detail/${coin.coinId}`}>
                          <td>{i + 1}</td>
                          <td className="capitalize">{coin.coinId}</td>
                          <td>{coin.currentPrice ? formatCurrency(coin.currentPrice) : "-"}</td>
                          <td className={coin.profitLoss >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{coin.profitLoss ? formatCurrency(coin.profitLoss) : "-"}</td>

                          {/* ✅ Tampilkan persentase PnL */}
                          <td className={coin.percentPL >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{coin.percentPL ? `${coin.percentPL.toFixed(2)}%` : "-"}</td>

                          <td>{formatCurrency(coin.quantity)}</td>
                          <td>{formatCurrency(coin.averagePrice)}</td>
                          <td>{formatCurrency(coin.totalSpend)}</td>
                        </Link>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No coins in portfolio.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PortofolioPage;
