import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router";
import { FaChartPie } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const apiKey = import.meta.env.VITE_API_KEY;

const Navbar = () => {
  const dispatch = useDispatch();
  const globalData = useSelector((state) => state.dataGlobal);

  const getDataGlobal = async () => {
    const response = await axiosInstance.get(`/global`, {
      params: {
        x_cg_demo_api_key: apiKey,
      },
    });
    dispatch({
      type: "STORE_DATA_GLOBAL",
      payload: response.data.data,
    });
  };

  useEffect(() => {
    getDataGlobal();
  }, []);
  // console.log(globalData);
  return (
    <nav className="bg-[#080D10] fixed z-50 top-0 left-0 right-0 px-10 pt-4 pb-6 border-b border-background flex flex-col gap-5">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-white text-xs">Coins : </h1>
          <h1 className="text-white text-xs">{globalData.data?.active_cryptocurrencies?.toLocaleString("id-ID")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-white text-xs">Exchanges : </h1>
          <h1 className="text-white text-xs">{globalData.data?.markets?.toLocaleString("id-ID")}</h1>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-10">
          <img src="./logo.svg" />
          <div className="flex items-center gap-5">
            <Link className="text-sm font-semibold text-primary">Homepage</Link>
            <Link className="text-sm ">Community</Link>
            <Link className="text-sm ">Blog</Link>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <input type="text" placeholder="Search" className="bg-background px-4  active:outline-none active:bordeno py-2 rounded-xl placeholder:text-sm outline-none" />
          <Link className="flex items-center gap-2">
            <FaChartPie />
            <h1>Portofolio</h1>
          </Link>
          <Link className="flex items-center gap-2">
            <FaStar />
            <h1>Watchlist</h1>
          </Link>
          <Link className="bg-primary px-8 py-2 rounded-md font-bold">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
