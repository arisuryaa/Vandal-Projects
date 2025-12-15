import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";

const OpenNavbar = ({
  text,
  setText,
  resultSearch,
  dataTrending,
  setInputActive,
  mode = "search", // "search" | "add"
  onAddCoin,
}) => {
  const modalRef = useRef();
  const [confirmAdd, setConfirmAdd] = useState(false);

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

  const notify = (text) => {
    toast(text);
  };

  const handleConfirmYes = (coin) => {
    setInputActive(false);
    onAddCoin?.(coin);
    setText("");
  };

  const handleCoinClick = (coin) => {
    if (mode === "add") {
      notify(
        ({ closeToast }) => (
          <div className="flex flex-col gap-3 px-1 py-2 capitalize">
            <p>{`Yakin menambah ${coin.id} ke portofolio?`}</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleConfirmYes(coin);
                  closeToast(); // tutup toast
                }}
                className="bg-primary cursor-pointer hover:bg-green-800 transition-all text-black px-6 text-sm py-1 rounded-sm hover:text-white"
              >
                Yes
              </button>

              <button
                onClick={closeToast} // ← INI KUNCINYA
                className="bg-slate-500 px-6 text-sm py-1 rounded-sm"
              >
                No
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
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
        <Wrapper key={id} {...wrapperProps} className="flex justify-between items-center hover:bg-gray-200 w-full rounded-lg px-2 sm:px-3 py-2 cursor-pointer transition-colors">
          <div className="flex gap-2 items-center flex-1 min-w-0">
            <img src={image} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0" alt={name} />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <h1 className="capitalize font-semibold text-sm sm:text-base truncate">{name}</h1>
                <h1 className="text-[9px] sm:text-[10px] text-white text-center bg-gray-400 px-1 py-0.5 sm:py-1 rounded-md whitespace-nowrap flex-shrink-0"># {rank}</h1>
              </div>
              <h1 className="text-xs opacity-70 uppercase">{symbol}</h1>
            </div>
          </div>
          {price && (
            <div className="flex flex-col gap-0.5 sm:gap-1 items-end ml-2 flex-shrink-0">
              <h1 className="font-semibold text-xs sm:text-sm whitespace-nowrap">$ {price.toLocaleString("en-US")}</h1>
              <h1 className={`text-xs sm:text-sm ${change < 0 ? "text-red-500" : "text-green-500"}`}>{change.toFixed(1)} %</h1>
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

      {/* Modal box - Responsive */}
      <div className="fixed inset-0 flex justify-center items-center z-[998] px-4 sm:px-6 py-4 sm:py-0">
        <div
          ref={modalRef}
          className="bg-white text-black w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-3xl max-h-[90vh] sm:max-h-[85vh] md:max-h-[80%] px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-lg overflow-y-auto shadow-2xl"
        >
          {/* Search Input */}
          <div className="flex justify-between items-center gap-2 border-b pb-3 mb-3">
            <CiSearch className="text-lg sm:text-xl flex-shrink-0" />
            <input type="text" autoFocus className="w-full px-2 sm:px-3 py-1 outline-none text-sm sm:text-base" placeholder="Search coin..." value={text} onChange={(e) => setText(e.target.value)} />
            <button className="cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors" onClick={() => setInputActive(false)}>
              <IoIosClose className="text-2xl sm:text-3xl" />
            </button>
          </div>

          {/* Coin List */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <h1 className="text-xs sm:text-sm opacity-80 font-semibold">{mode === "add" ? "Search Your Coin" : "Trending Crypto"}</h1>

            <div className="flex flex-col gap-1">
              {resultSearch?.data?.coins?.length > 0 ? renderCoinList(resultSearch.data.coins) : dataTrending?.data?.slice(0, 4) && renderCoinList(dataTrending.data.slice(0, 4))}
            </div>

            {/* Empty State (Optional) */}
            {text && !resultSearch?.data?.coins?.length && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No coins found for "{text}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenNavbar;
