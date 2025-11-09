import React from "react";
import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/authPages/LoginPage";
import RegisterPage from "./pages/authPages/RegisterPage";
import WatchlistPage from "./pages/WatchlistPage";
import CommunityPage from "./pages/CommunityPage";
import PortofolioPage from "./pages/PortofolioPage";
import AddCoinPages from "./pages/AddCoinPages";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/Portofolio" element={<PortofolioPage />} />
        <Route path="/AddCoin/:id" element={<AddCoinPages />} />
      </Routes>
    </>
  );
};

export default App;
