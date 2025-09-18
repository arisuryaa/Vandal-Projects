import React from "react";
import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import Navbar from "./components/layout/Navbar";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/authPages/LoginPage";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default App;
