import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaChartPie, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { axiosInstance } from "../../lib/axios";
import { useDebounce } from "use-debounce";
import OpenNavbar from "./OpenNavbar"; // Import komponen baru

const apiKey = import.meta.env.VITE_API_KEY;

const Navbar = () => {
  const dispatch = useDispatch();
  const [inputActive, setInputActive] = useState(false);
  const [text, setText] = useState("");
  const [debounceText] = useDebounce(text, 800);
  const [resultSearch, setResultSearch] = useState();
  const dataTrending = useSelector((state) => state.dataTrending);
  const user = useSelector((state) => state.dataUser);

  const getDataGlobal = async () => {
    const response = await axiosInstance.get(`/global`, {
      params: { x_cg_demo_api_key: apiKey },
    });
    dispatch({
      type: "STORE_DATA_GLOBAL",
      payload: response.data.data,
    });
  };

  const getDataSearch = async (qur) => {
    try {
      const response = await axiosInstance.get("/search", { params: { query: qur } });
      setResultSearch(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataGlobal();
  }, []);

  useEffect(() => {
    getDataSearch(debounceText);
  }, [debounceText]);

  return (
    <nav className="bg-[#080D10] fixed z-50 top-0 left-0 right-0 px-10 pt-4 pb-6 border-b border-background flex flex-col gap-5">
      {inputActive && <OpenNavbar mode="search" text={text} setText={setText} resultSearch={resultSearch} dataTrending={dataTrending} setInputActive={setInputActive} />}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-10">
          <img src="/logo.svg" alt="logo" />
          <div className="flex items-center gap-5">
            <Link className="text-sm" to={"/"}>
              Homepage
            </Link>
            <Link className="text-sm" to={"/community"}>
              Community
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => setInputActive(true)}>
            <input disabled={inputActive} type="text" placeholder="Search" className="bg-background px-4 py-2 rounded-xl placeholder:text-sm outline-none" />
          </button>

          <Link to={"/Portofolio"} className="flex items-center gap-2">
            <FaChartPie />
            <h1>Portofolio</h1>
          </Link>
          <Link className="flex items-center gap-2" to={"/watchlist"}>
            <FaStar />
            <h1>Watchlist</h1>
          </Link>

          {user ? (
            <button onClick={handleLogout} className="cursor-pointer bg-primary px-8 py-2 rounded-md font-bold">
              Logout
            </button>
          ) : (
            <Link to={"/login"} className="bg-primary px-8 py-2 rounded-md font-bold">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
