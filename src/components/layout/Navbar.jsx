import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaChartPie, FaStar, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { axiosInstance } from "../../lib/axios";
import { useDebounce } from "use-debounce";
import OpenNavbar from "./OpenNavbar";

const apiKey = import.meta.env.VITE_API_KEY;

const Navbar = () => {
  const dispatch = useDispatch();
  const [inputActive, setInputActive] = useState(false);
  const [text, setText] = useState("");
  const [debounceText] = useDebounce(text, 800);
  const [resultSearch, setResultSearch] = useState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      setMobileMenuOpen(false);
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
    <nav className="bg-[#080D10] fixed z-50 top-0 left-0 right-0 px-4 sm:px-6 md:px-10 pt-4 pb-6 border-b border-background flex flex-col gap-5">
      {inputActive && <OpenNavbar mode="search" text={text} setText={setText} resultSearch={resultSearch} dataTrending={dataTrending} setInputActive={setInputActive} />}

      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-4 md:gap-10">
          <img src="/logo.svg" alt="logo" className="h-6 sm:h-8" />

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-5">
            <Link className="text-sm hover:text-primary hover:pb-1 hover:border-b-2 border-primary transition-all" to={"/"}>
              Homepage
            </Link>
            <Link className="text-sm hover:text-primary hover:pb-1 hover:border-b-2 border-primary transition-all" to={"/community"}>
              Community
            </Link>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <button onClick={() => setInputActive(true)}>
            <input disabled={inputActive} type="text" placeholder="Search" className="bg-background px-4 py-2 rounded-xl placeholder:text-sm outline-none" />
          </button>

          <Link to={"/Portofolio"} className="flex items-center gap-2">
            <FaChartPie />
            <h1 className="hover:text-primary hover:pb-1 hover:border-b-2 border-primary transition-all">Portofolio</h1>
          </Link>
          <Link className="flex items-center gap-2" to={"/watchlist"}>
            <FaStar />
            <h1 className="hover:text-primary hover:pb-1 hover:border-b-2 border-primary transition-all">Watchlist</h1>
          </Link>

          {user ? (
            <button onClick={handleLogout} className=" hover:bg-green-950 transition-all cursor-pointer bg-primary px-8 py-2 rounded-md font-bold">
              Logout
            </button>
          ) : (
            <Link to={"/login"} className="bg-primary px-8 py-2 rounded-md font-bold">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden flex flex-col gap-4 pt-4 border-t border-background">
          <button
            onClick={() => {
              setInputActive(true);
              setMobileMenuOpen(false);
            }}
            className="w-full"
          >
            <input disabled={inputActive} type="text" placeholder="Search" className="w-full bg-background px-4 py-2 rounded-xl placeholder:text-sm outline-none" />
          </button>

          <Link className="text-sm py-2" to={"/"} onClick={() => setMobileMenuOpen(false)}>
            Homepage
          </Link>
          <Link className="text-sm py-2" to={"/community"} onClick={() => setMobileMenuOpen(false)}>
            Community
          </Link>

          <Link to={"/Portofolio"} className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
            <FaChartPie />
            <h1>Portofolio</h1>
          </Link>
          <Link className="flex items-center gap-2 py-2" to={"/watchlist"} onClick={() => setMobileMenuOpen(false)}>
            <FaStar />
            <h1>Watchlist</h1>
          </Link>

          {user ? (
            <button onClick={handleLogout} className="cursor-pointer bg-primary px-8 py-2 rounded-md font-bold w-full">
              Logout
            </button>
          ) : (
            <Link to={"/login"} className="bg-primary px-8 py-2 rounded-md font-bold text-center" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
