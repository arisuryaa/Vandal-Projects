import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import CardPortofolio from "../components/ui/CardPortofolio";
import useDocumentTitle from "../hook/useDocumentTitle";
import OpenNavbar from "../components/layout/OpenNavbar";
import { useDebounce } from "use-debounce";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance, axiosLocal, axiosServer } from "../lib/axios";
import { Link, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProtectedRoute from "./ProtectedPages/ProtectPage";
import DropdownMenu from "../components/ui/DropdownMenu";
import { ToastContainer } from "react-toastify";

const PortofolioPage = () => {
  const navigate = useNavigate();
  useDocumentTitle("Vandal | Portofolio");

  const [userAuth, setUserAuth] = useState(null);
  const [inputActive, setInputActive] = useState(false);
  const [text, setText] = useState("");
  const [debounceText] = useDebounce(text, 800);
  const [resultSearch, setResultSearch] = useState();
  const [resultPortofolio, setResultPortofolio] = useState([]);
  const [resultAllTransaction, setResultAllTransaction] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [allTransaction, setAllTransaction] = useState(false); // Default ke Coin List
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalCurrentBalance: 0,
    totalProfitLoss: 0,
    totalChangePercent: 0,
    topPerformer: { coin: "-", change: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted
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
      const result = await axiosLocal.get("/portofolio", {
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
    if (!portfolio.length) {
      // Reset stats jika portfolio kosong
      setResultPortofolio([]);
      setStats({
        totalBalance: 0,
        totalCurrentBalance: 0,
        totalProfitLoss: 0,
        totalChangePercent: 0,
        topPerformer: { coin: "-", change: 0 },
      });
      return;
    }

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
      const percentPL = (profitLoss / p.totalSpend) * 100;
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
        percentPL,
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

  // ✅ PERBAIKAN: Function delete yang lebih baik
  const handleDeleteCoin = async (coinId) => {
    // Konfirmasi dengan user
    const isConfirmed = window.confirm(`Are you sure you want to delete ${coinId.toUpperCase()} from your portfolio? This action cannot be undone.`);

    if (!isConfirmed) return;

    try {
      setDeletingId(coinId); // Set loading state untuk button ini
      const token = await userAuth.getIdToken();

      await axiosLocal.delete(`/portofolio/${coinId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh data portfolio setelah delete
      const updatedPortfolio = await getDataPortofolio(userAuth);
      await calculatePortfolioStats(updatedPortfolio);
      await getDataTransaction(userAuth);

      alert(`${coinId.toUpperCase()} successfully deleted from portfolio!`);
    } catch (error) {
      console.error("Error deleting coin:", error);
      alert(`Failed to delete ${coinId.toUpperCase()}. Please try again.`);
    } finally {
      setDeletingId(null); // Reset loading state
    }
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

  const handleAddCoin = (coin) => {
    navigate(`/addcoin/${coin.id}`);
  };

  const getDataTransaction = async (user) => {
    try {
      const token = await user.getIdToken();
      const result = await axiosLocal.get("/portofolio/allTransaction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResultAllTransaction(result.data.portfolioData.result);
      return result.data.portfolioData.result || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    // Konfirmasi dengan user
    const isConfirmed = window.confirm(`Are you sure you want to delete ${transactionId.toUpperCase()} from your portfolio? This action cannot be undone.`);

    if (!isConfirmed) return;

    try {
      // setDeletingId(transactionId); // Set loading state untuk button ini
      const token = await userAuth.getIdToken();

      await axiosLocal.delete(`/portofolio/transaction/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh data portfolio setelah delete
      const updatedPortfolio = await getDataPortofolio(userAuth);
      await calculatePortfolioStats(updatedPortfolio);
      await getDataTransaction();
      await getDataTransaction(userAuth);

      alert(`${transactionId.toUpperCase()} successfully deleted from portfolio!`);
    } catch (error) {
      console.error("Error deleting coin:", error);
      alert(`Failed to delete ${transactionId.toUpperCase()}. Please try again.`);
    } finally {
      setDeletingId(null); // Reset loading state
    }
  };

  useEffect(() => {
    console.log(resultAllTransaction);
  }, [allTransaction]);

  useEffect(() => {
    getDataGlobal();
  }, []);

  useEffect(() => {
    getDataSearch(debounceText);
  }, [debounceText]);

  // ✅ Gabungkan fetch data dalam 1 useEffect
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUserAuth(user);
      setLoading(true);

      try {
        // Fetch portfolio dan transactions secara parallel
        const [portfolio, transactions] = await Promise.all([getDataPortofolio(user), getDataTransaction(user)]);

        await calculatePortfolioStats(portfolio);
        setResultAllTransaction(transactions);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProtectedRoute>
      <>
        {inputActive && <OpenNavbar mode="add" text={text} setText={setText} resultSearch={resultSearch} dataTrending={dataTrending} setInputActive={setInputActive} onAddCoin={handleAddCoin} />}
        <ToastContainer position="top-center" autoClose={false} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

        <Navbar />

        <div className="px-4 sm:px-6 md:px-10 mt-28">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl font-medium">My Portfolio</h1>
              <p className="text-background text-xs sm:text-sm">Track your cryptocurrency investments and performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
              <button onClick={() => setInputActive(true)} className="bg-slate-800 text-sm cursor-pointer hover:bg-background transition-all text-white px-3 py-2 rounded-lg whitespace-nowrap">
                + Add Transaction
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-400">Loading portfolio data...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
                <CardPortofolio title={formatCurrency(stats.totalBalance)} description="Total Spend" style={"w-full"} />
                <CardPortofolio title={formatCurrency(stats.totalCurrentBalance)} description="Current Balance" style={"w-full"} />
                <CardPortofolio
                  title={`${stats.totalChangePercent.toFixed(2)}%`}
                  description="24h Portfolio Change"
                  style={stats.totalChangePercent > 0 ? "w-full text-green-500" : "w-full text-red-500"}
                />
                <CardPortofolio title={formatCurrency(stats.totalProfitLoss)} description="Total Profit / Loss" style={stats.totalProfitLoss > 0 ? "text-green-500 w-full" : "text-red-500 w-full"} />
                <CardPortofolio
                  title={`${stats.topPerformer?.coin || "-"} (${stats.topPerformer?.change?.toFixed?.(2) || "0.00"}%)`}
                  description="Top Performer 24h"
                  style={stats.topPerformer.change > 0 ? "text-green-500 w-full" : "text-red-500 w-full"}
                />
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto rounded-box bg-base-100 mt-8">
                {/* Tab Navigation */}
                <div className="flex items-center gap-6 border-b border-background pb-3 mb-4 text-sm">
                  <button
                    onClick={() => setAllTransaction(false)}
                    className={`transition-all cursor-pointer border-primary ${!allTransaction ? "text-primary font-semibold border-b-2 pb-1" : "hover:border-b hover:pb-1"}`}
                  >
                    Coin List
                  </button>
                  <button
                    onClick={() => setAllTransaction(true)}
                    className={`transition-all cursor-pointer border-primary ${allTransaction ? "text-primary font-semibold border-b-2 pb-1" : "hover:border-b hover:pb-1"}`}
                  >
                    All Transactions
                  </button>
                </div>

                {/* Tables */}
                {allTransaction ? (
                  // All Transactions Table
                  <table className="table bg-backgroundBlack w-full min-w-[800px]">
                    <thead>
                      <tr className="text-xs">
                        <th>#</th>
                        <th>Coin</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price Per Coin</th>
                        <th className="hidden sm:table-cell">Total Value</th>
                        <th className="hidden md:table-cell">Date</th>
                        <th className="hidden lg:table-cell">Note</th>
                        <th className="hidden lg:table-cell">action</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {resultAllTransaction.length > 0 ? (
                        resultAllTransaction.map((transaction, i) => (
                          <tr key={transaction.id || i} className="hover:bg-gray-900 transition-all">
                            <td>{i + 1}</td>
                            <td className="capitalize whitespace-nowrap">{transaction.coinId}</td>
                            <td>
                              <span
                                className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                  transaction.type === "buy" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {transaction.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="whitespace-nowrap">
                              {transaction.quantity.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8,
                              })}
                            </td>
                            <td className="whitespace-nowrap">{formatCurrency(transaction.pricePerCoin)}</td>
                            <td className="hidden sm:table-cell whitespace-nowrap font-semibold text-primary">{formatCurrency(transaction.totalValue)}</td>
                            <td className="hidden md:table-cell whitespace-nowrap text-gray-400">
                              {new Date(transaction.transactedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="hidden lg:table-cell max-w-[200px] truncate text-gray-400">{transaction.note || "-"}</td>
                            <td className="  text-gray-400">
                              <DropdownMenu coinId={transaction._id} isEdit={true} isAddMore={false} onDelete={() => handleDeleteTransaction(transaction._id)}></DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <p className="text-gray-500">No transactions found.</p>
                              <button onClick={() => setInputActive(true)} className="mt-2 text-primary hover:underline text-sm">
                                Add your first transaction
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  // Coin List Table
                  <table className="table bg-backgroundBlack w-full min-w-[800px]">
                    <thead>
                      <tr className="text-xs">
                        <th>#</th>
                        <th>Coin</th>
                        <th>Price</th>
                        <th>PnL</th>
                        <th className="hidden sm:table-cell">PnL %</th>
                        <th className="hidden md:table-cell">Quantity</th>
                        <th className="hidden lg:table-cell">Average Price</th>
                        <th className="hidden xl:table-cell">Total Spend</th>
                        <th className="hidden xl:table-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {resultPortofolio.length > 0 ? (
                        resultPortofolio.map((coin, i) => (
                          <tr key={coin.id || i} className="hover:bg-gray-900 transition-all cursor-pointer">
                            <Link className="contents" to={`/detail/${coin.coinId}`}>
                              <td>{i + 1}</td>
                              <td className="capitalize whitespace-nowrap">{coin.coinId}</td>
                              <td className="whitespace-nowrap">{coin.currentPrice ? formatCurrency(coin.currentPrice) : "-"}</td>
                              <td className={coin.profitLoss >= 0 ? "text-green-500 font-semibold whitespace-nowrap" : "text-red-500 font-semibold whitespace-nowrap"}>
                                {coin.profitLoss ? formatCurrency(coin.profitLoss) : "-"}
                              </td>
                              <td className={`hidden sm:table-cell ${coin.percentPL >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}`}>
                                {coin.percentPL ? `${coin.percentPL.toFixed(2)}%` : "-"}
                              </td>
                              <td className="hidden md:table-cell whitespace-nowrap">{formatCurrency(coin.quantity)}</td>
                              <td className="hidden lg:table-cell whitespace-nowrap">{formatCurrency(coin.averagePrice)}</td>
                              <td className="hidden xl:table-cell whitespace-nowrap">{formatCurrency(coin.totalSpend)}</td>
                            </Link>
                            <td className="hidden xl:table-cell">
                              <DropdownMenu isAddMore={true} coinId={coin.coinId} isEdit={false} onDelete={() => handleDeleteCoin(coin.coinId)} isDeleting={deletingId === coin.coinId} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              <p className="text-gray-500">No coins in portfolio.</p>
                              <button onClick={() => setInputActive(true)} className="mt-2 text-primary hover:underline text-sm">
                                Add your first coin
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </>
    </ProtectedRoute>
  );
};

export default PortofolioPage;
