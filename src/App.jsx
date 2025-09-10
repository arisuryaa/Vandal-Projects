import React from "react";
import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import Navbar from "./components/layout/Navbar";
const App = () => {
  return (
    <Navbar>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
      </Routes>
    </Navbar>
  );
};

export default App;
