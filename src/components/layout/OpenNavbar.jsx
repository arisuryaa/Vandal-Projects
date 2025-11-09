import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";

const OpenNavbar = ({
  text,
  setText,
  resultSearch,
  dataTrending,
  setInputActive,
  mode = "search", // "search" | "add"
  onAddCoin, // fungsi yang dipanggil jika mode === "add"
}) => {
  const modalRef = useRef();

  // Disable scroll saat modal aktif
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Tutup modal jika klik di luar box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setInputActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setInputActive]);

  // handle klik coin
  const handleCoinClick = (coin) => {
    if (mode === "add") {
      const confirmAdd = window.confirm(`Tambahkan ${coin.id} ke portofolio kamu?`);
      if (confirmAdd && onAddCoin) {
        onAddCoin(coin);
        setInputActive(false);
        setText("");
      }
    }
  };

  const renderCoinList = (coins) => {
    return coins.map((e) => {
      const coinData = e.item || e;
      const id = coinData.id;
      const name = coinData.name || coinData.id;
      const symbol = coinData.symbol;
      const rank = coinData.market_cap_rank;
      const image = coinData.small || coinData.thumb;
      const price = coinData?.data?.price;
      const change = coinData?.data?.price_change_percentage_24h?.usd;

      // mode "add" pakai div, mode "search" pakai Link
      const Wrapper = mode === "search" ? Link : "div";
      const wrapperProps =
        mode === "search"
          ? {
              to: `/detail/${id}`,
              onClick: () => {
                setInputActive(false);
                setText("");
              },
            }
          : {
              onClick: () => handleCoinClick(coinData),
            };

      return (
        <Wrapper key={id} {...wrapperProps} className="flex justify-between items-center hover:bg-gray-200 w-full rounded-lg px-3 py-2 cursor-pointer">
          <div className="flex gap-2 items-center ">
            <img src={image} className="w-5 rounded-full h-5" alt={name} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="capitalize font-semibold">{name}</h1>
                <h1 className="text-[10px] text-white text-center bg-gray-400 px-1 py-1 rounded-md"># {rank}</h1>
              </div>
              <h1 className="text-xs opacity-70">{symbol}</h1>
            </div>
          </div>
          {price && (
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-sm">$ {price.toLocaleString("en-US")}</h1>
              <h1 className={change < 0 ? "text-sm text-red-500" : "text-sm text-green-500"}>{change.toFixed(1)} %</h1>
            </div>
          )}
        </Wrapper>
      );
    });
  };

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gray-800/50 z-[990]"></div>

      {/* Modal box */}
      <div className="fixed inset-0 flex justify-center items-center z-[998]">
        <div ref={modalRef} className="bg-white text-black w-[60%] max-h-[80%] px-4 py-4 rounded-lg overflow-y-auto">
          <div className="flex justify-between items-center">
            <CiSearch />
            <input type="text" autoFocus className="w-full px-3 py-1 outline-none" placeholder="Search coin..." value={text} onChange={(e) => setText(e.target.value)} />
            <button className="cursor-pointer" onClick={() => setInputActive(false)}>
              <IoIosClose />
            </button>
          </div>

          <div className="flex flex-col pt-3 gap-3">
            <h1 className="text-sm opacity-80 font-semibold">{mode === "add" ? "Search Your Coin" : "Trending Crypto"}</h1>

            {resultSearch?.data?.coins?.length > 0 ? renderCoinList(resultSearch.data.coins) : dataTrending?.data?.slice(0, 4) && renderCoinList(dataTrending.data.slice(0, 4))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenNavbar;
