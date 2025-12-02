import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/layout/Navbar";
import { useNavigate, useParams } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { axiosInstance, axiosLocal, axiosServer } from "../lib/axios";
import { FaArrowUp, FaArrowDown, FaCalendar, FaCoins, FaDollarSign, FaStickyNote } from "react-icons/fa";
import ProtectedRoute from "./ProtectedPages/ProtectPage";
const apiKey = import.meta.env.VITE_API_KEY;

const AddCoinPages = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [dataCoin, setDataCoin] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "buy",
      transactedAt: new Date().toISOString().slice(0, 16),
    },
  });

  const quantity = watch("quantity");
  const pricePerCoin = watch("pricePerCoin");
  const type = watch("type");
  const totalValue = quantity && pricePerCoin ? (quantity * pricePerCoin).toFixed(2) : "0.00";

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

  const onSubmit = async (data) => {
    try {
      const token = await user.getIdToken();
      console.log(token);
      setIsSubmitting(true);
      const transactionData = {
        type: data.type,
        coinId: id,
        quantity: parseFloat(data.quantity),
        pricePerCoin: parseFloat(data.pricePerCoin),
        totalValue: parseFloat(totalValue),
        transactedAt: new Date(data.transactedAt),
        note: data.note,
      };
      console.log("Transaction Data:", transactionData);

      const response = await axiosLocal.post("/portofolio/transaction", transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Transaction added successfully!");
        navigate("/portofolio");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        setUser(user);
        setLoading(false);
      } else {
        console.error("error");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDataDetail();
  }, []);

  useEffect(() => {
    if (dataCoin?.tickers?.[0]?.last) {
      setValue("pricePerCoin", dataCoin.tickers[0].last);
    }
    console.log(dataCoin);
  }, [dataCoin, setValue]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white">
        <Navbar />

        <div className="px-4 sm:px-6 md:px-10 mt-28 max-w-4xl mx-auto mb-20">
          {/* Header with Coin Badge */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-500 rounded-full flex items-center justify-center">
                <FaCoins className="text-2xl text-black" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Add Transaction</h1>
                <p className="text-gray-400 text-sm uppercase tracking-wider">{id}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Record your cryptocurrency transaction details below</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-[#0D1419] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Transaction Type - Featured */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 border border-gray-700">
                <label className="block text-base font-semibold mb-4 text-white">
                  Transaction Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center justify-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                      type === "buy" ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <input type="radio" value="buy" {...register("type", { required: true })} className="sr-only" />
                    <FaArrowDown className={`text-xl ${type === "buy" ? "text-green-400" : "text-gray-500"}`} />
                    <span className={`font-bold text-lg ${type === "buy" ? "text-green-400" : "text-gray-400"}`}>Buy</span>
                  </label>
                  <label
                    className={`relative flex items-center justify-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                      type === "sell" ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <input type="radio" value="sell" {...register("type", { required: true })} className="sr-only" />
                    <FaArrowUp className={`text-xl ${type === "sell" ? "text-red-400" : "text-gray-500"}`} />
                    <span className={`font-bold text-lg ${type === "sell" ? "text-red-400" : "text-gray-400"}`}>Sell</span>
                  </label>
                </div>
              </div>

              {/* Two Column Layout for Amount Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantity */}
                <div className="space-y-2">
                  <label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <FaCoins className="text-primary" />
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="quantity"
                      type="number"
                      step="0.00000001"
                      {...register("quantity", {
                        required: "Quantity is required",
                        min: { value: 0.00000001, message: "Quantity must be greater than 0" },
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="0.00000000"
                    />
                  </div>
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>

                {/* Price Per Coin */}
                <div className="space-y-2">
                  <label htmlFor="pricePerCoin" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <FaDollarSign className="text-primary" />
                    Price Per Coin (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      id="pricePerCoin"
                      type="number"
                      step="0.01"
                      {...register("pricePerCoin", {
                        required: "Price per coin is required",
                        min: { value: 0.01, message: "Price must be greater than 0" },
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.pricePerCoin && <p className="text-red-500 text-xs mt-1">{errors.pricePerCoin.message}</p>}
                </div>
              </div>

              {/* Total Value - Highlighted */}
              <div className="bg-gradient-to-r from-primary/20 to-yellow-500/20 border-2 border-primary/50 rounded-xl p-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Value (USD)</label>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-primary">${totalValue}</span>
                  <span className="text-gray-400 text-sm">USD</span>
                </div>
              </div>

              {/* Transaction Date */}
              <div className="space-y-2">
                <label htmlFor="transactedAt" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FaCalendar className="text-primary" />
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="transactedAt"
                  type="datetime-local"
                  {...register("transactedAt", { required: "Transaction date is required" })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {errors.transactedAt && <p className="text-red-500 text-xs mt-1">{errors.transactedAt.message}</p>}
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label htmlFor="note" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FaStickyNote className="text-primary" />
                  Note (Optional)
                </label>
                <textarea
                  id="note"
                  {...register("note")}
                  rows="4"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Add any notes about this transaction..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1 bg-gradient-to-r from-primary to-yellow-500 text-black font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Transaction...
                    </span>
                  ) : (
                    "Add Transaction"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="sm:w-auto px-8 bg-gray-800 border border-gray-700 text-white font-semibold py-4 rounded-xl hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-400 text-sm">
              <span className="font-semibold">💡 Tip:</span> Make sure to double-check your transaction details before submitting. All fields marked with * are required.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AddCoinPages;
