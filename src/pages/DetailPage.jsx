import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { axiosInstance } from "../lib/axios";
const apiKey = import.meta.env.VITE_API_KEY;

const DetailPage = () => {
  const [dataCoin, setDataCoin] = useState([]);
  const { id } = useParams();

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

  useEffect(() => {
    getDataDetail();
  }, []);

  console.log(dataCoin);
  return (
    <div className="pt-32 px-10">
      <div className="flex gap-2 h-80">
        <div className="w-[30%] flex flex-col gap-4 h-full">
          <div className="flex items-center gap-4 mb-4">
            <Link to={"/"}>{`Cryptocurrencies`}</Link>
            <p>{`>`}</p>
            <p className="capitalize text-primary font-semibold">{dataCoin.id} Price</p>
          </div>
          <div className="flex items-center gap-2">
            <img src={dataCoin?.image?.small} className="w-8 h-8" alt="" />
            <h1 className="text-xl font-semibold capitalize">{dataCoin.id}</h1>
            <h1 className="text-white uppercase opacity-70 text-sm">$ {dataCoin.symbol}</h1>
          </div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">$ {dataCoin?.tickers?.[6]?.last.toLocaleString("en-US")}</h1>
            <h2></h2>
          </div>
        </div>
        <div className="w-[70%]"></div>
      </div>
    </div>
  );
};

export default DetailPage;
