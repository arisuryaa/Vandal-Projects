import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router";
const apiKey = import.meta.env.VITE_API_KEY;

const Navbar = () => {
  const [data, setData] = useState({});

  const fetchData = async () => {
    const response = await axiosInstance.get(`/global`, {
      params: {
        x_cg_demo_api_key: apiKey,
      },
    });
    setData(response.data.data);
    console.log(response);
  };

  useEffect(() => {
    // fetchData();
  }, []);
  return (
    <nav className="px-10 py-4 flex flex-col gap-5">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-white text-xs">Coins : </h1>
          <h1 className="text-white text-xs">{data?.active_cryptocurrencies?.toLocaleString("id-ID")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-white text-xs">Exchanges : </h1>
          <h1 className="text-white text-xs">{data?.markets?.toLocaleString("id-ID")}</h1>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-10">
          <img src="./logo.svg" />
          <div className="flex items-center gap-5">
            <Link className="text-sm font-semibold">Homepage</Link>
            <Link className="text-sm ">Community</Link>
            <Link className="text-sm ">Blog</Link>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <input type="text" placeholder="Search" />
          <div className="flex items-center gap-3">
            <h1>Portofolio</h1>
          </div>
          <div className="flex items-center gap-3">
            <h1>Portofolio</h1>
          </div>
          <Link>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
