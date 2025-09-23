import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router";
import { FaChartPie } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { useDebounce } from "use-debounce";
const apiKey = import.meta.env.VITE_API_KEY;

const Navbar = () => {
  const dispatch = useDispatch();
  const globalData = useSelector((state) => state.dataGlobal);
  const [inputActive, setInputActive] = useState(false);
  const dataTrending = useSelector((state) => state.dataTrending);
  const [text, setText] = useState("");
  const [debounceText] = useDebounce(text, 800);
  const [resultSearch, setResultSearch] = useState();

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

  const getDataSearch = async (qur) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query: qur,
        },
      });
      setResultSearch(response);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(resultSearch);
  // console.log(`text : ${text}`);
  // console.log(`debounce : ${debounceText}`);
  useEffect(() => {
    getDataGlobal();
  }, []);

  useEffect(() => {
    getDataSearch(debounceText);
  }, [debounceText]);

  return (
    <nav className="bg-[#080D10] fixed z-50 top-0 left-0 right-0 px-10 pt-4 pb-6 border-b border-background flex flex-col gap-5">
      {inputActive == true ? (
        <>
          <div className="w-full h-screen bg-gray-800 opacity-40 flex items-center justify-center absolute  top-0 left-0 bottom-0 right-0"></div>
          <div className="flex justify-center w-full h-screen items-center px-4 py-8 opacity-100 absolute z-50 top-0 left-0 right-0 bottom-0 ">
            <div className="bg-white text-black w-[60%] max-h-[80%] px-4 py-4 rounded-lg overflow-y-auto">
              <div className="flex justify-between items-center">
                <CiSearch />
                <button className="w-full">
                  <input
                    type="text"
                    autoFocus
                    className="w-full px-3 py-1 outline-none"
                    placeholder="search"
                    defaultValue={text}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  />
                </button>
                <button className="cursor-pointer" onClick={() => setInputActive(false)}>
                  <IoIosClose />
                </button>
              </div>
              <div className="flex flex-col pt-3 gap-3">
                <h1 className="text-sm opacity-80 font-semibold">Trending Crypto</h1>
                {resultSearch?.data?.coins.length > 0
                  ? resultSearch.data.coins.map((e) => {
                      return (
                        <Link
                          key={e.id}
                          to={`/detail/${e.id}`}
                          onClick={() => {
                            setInputActive(false);
                            setText("");
                          }}
                        >
                          <div className="flex justify-between items-center hover:bg-gray-200 w-full rounded-lg px-3 cursor-pointer">
                            <div className="flex gap-2 items-center ">
                              <img src={e.thumb} className="w-5 rounded-full h-5" alt="" />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <h1 className="capitalize font-semibold">{e.id}</h1>
                                  <h1 className="text-[10px] text-white text-center bg-gray-400 px-1 py-1 rounded-md"># {e.market_cap_rank}</h1>
                                </div>
                                <h1 className="text-xs opacity-70">{e.symbol}</h1>
                              </div>
                            </div>
                            {/* 
                          <div className="flex flex-col gap-1">
                            <h1 className="font-semibold text-sm">$ {e.item?.data?.price.toLocaleString("en-US")}</h1>
                            <h1 className={e.item?.data?.price_change_percentage_24h.usd < 0 ? `text-sm text-red-500` : `text-sm text-green-500`}>
                              {e.item?.data?.price_change_percentage_24h.usd.toFixed(1)} %
                            </h1>
                          </div> */}
                          </div>
                        </Link>
                      );
                    })
                  : dataTrending.data.slice(0, 4).map((e) => {
                      return (
                        <Link
                          key={e.item.id}
                          to={`/detail/${e.item.id}`}
                          onClick={() => {
                            setInputActive(false);
                          }}
                        >
                          <div className="flex justify-between items-center hover:bg-gray-200 w-full rounded-lg px-3 cursor-pointer">
                            <div className="flex gap-2 items-center ">
                              <img src={e.item.small} className="w-5 rounded-full h-5" alt="" />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <h1 className="capitalize font-semibold">{e.item.id}</h1>
                                  <h1 className="text-[10px] text-white text-center bg-gray-400 px-1 py-1 rounded-md"># {e.item.market_cap_rank}</h1>
                                </div>
                                <h1 className="text-xs opacity-70">{e.item.symbol}</h1>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <h1 className="font-semibold text-sm">$ {e.item?.data?.price.toLocaleString("en-US")}</h1>
                              <h1 className={e.item?.data?.price_change_percentage_24h.usd < 0 ? `text-sm text-red-500` : `text-sm text-green-500`}>
                                {e.item?.data?.price_change_percentage_24h.usd.toFixed(1)} %
                              </h1>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-10">
          <img src="/logo.svg" />
          <div className="flex items-center gap-5">
            <Link className="text-sm " to={"/"}>
              Homepage
            </Link>
            <Link className="text-sm ">Community</Link>
            <Link className="text-sm ">Blog</Link>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => setInputActive(true)}>
            <input disabled={inputActive} type="text" placeholder="Search" className="bg-background px-4  active:outline-none active:bordeno py-2 rounded-xl placeholder:text-sm outline-none" />
          </button>
          <Link className="flex items-center gap-2">
            <FaChartPie />
            <h1>Portofolio</h1>
          </Link>
          <Link className="flex items-center gap-2" to={"/watchlist"}>
            <FaStar />
            <h1>Watchlist</h1>
          </Link>
          <Link to={"/login"} className="bg-primary px-8 py-2 rounded-md font-bold">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
