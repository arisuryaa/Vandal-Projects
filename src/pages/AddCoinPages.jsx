import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/layout/Navbar";
import { useNavigate, useParams } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { axiosServer } from "../lib/axios";

const AddCoinPages = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // From useParams in your actual code
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "buy",
      transactedAt: new Date().toISOString().slice(0, 16),
    },
  });

  // Watch quantity and pricePerCoin to calculate total
  const quantity = watch("quantity");
  const pricePerCoin = watch("pricePerCoin");
  const totalValue = quantity && pricePerCoin ? (quantity * pricePerCoin).toFixed(2) : "0.00";

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

      const response = await axiosServer.post("/portofolio/transaction", transactionData, {
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

    return () => unsubscribe(); // cleanup listener saat unmount
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      {/* Main Content */}
      <div className="px-10 mt-28 max-w-2xl mb-20">
        <h1 className="text-3xl font-semibold mb-8">Add Transaction ${id}</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Transaction Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="buy" {...register("type", { required: true })} className="w-4 h-4" />
                <span className="text-green-400 font-semibold">Buy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="sell" {...register("type", { required: true })} className="w-4 h-4" />
                <span className="text-red-400 font-semibold">Sell</span>
              </label>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              type="number"
              step="0.00000001"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 0.00000001, message: "Quantity must be greater than 0" },
              })}
              className="w-full  border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-lime-400"
              placeholder="0.00"
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
          </div>

          {/* Price Per Coin */}
          <div>
            <label htmlFor="pricePerCoin" className="block text-sm font-medium mb-2">
              Price Per Coin (USD) <span className="text-red-500">*</span>
            </label>
            <input
              id="pricePerCoin"
              type="number"
              step="0.01"
              {...register("pricePerCoin", {
                required: "Price per coin is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
              className="w-full  border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-lime-400"
              placeholder="0.00"
            />
            {errors.pricePerCoin && <p className="text-red-500 text-sm mt-1">{errors.pricePerCoin.message}</p>}
          </div>

          {/* Total Value (Read Only) */}
          <div>
            <label className="block text-sm font-medium mb-2">Total Value (USD)</label>
            <div className="w-full  border border-gray-700 rounded-lg px-4 py-2 text-lime-400 font-semibold">${totalValue}</div>
          </div>

          {/* Transaction Date */}
          <div>
            <label htmlFor="transactedAt" className="block text-sm font-medium mb-2">
              Transaction Date <span className="text-red-500">*</span>
            </label>
            <input
              id="transactedAt"
              type="datetime-local"
              {...register("transactedAt", { required: "Transaction date is required" })}
              className="w-full  border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-lime-400"
            />
            {errors.transactedAt && <p className="text-red-500 text-sm mt-1">{errors.transactedAt.message}</p>}
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              Note (Optional)
            </label>
            <textarea
              id="note"
              {...register("note")}
              rows="4"
              className="w-full  border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-lime-400"
              placeholder="Add any notes about this transaction..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 bg-lime-400 text-black font-semibold py-3 rounded-lg hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </button>
            <button onClick={() => window.history.back()} className="px-8 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoinPages;
