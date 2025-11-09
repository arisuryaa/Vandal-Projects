import React from "react";
import Navbar from "../components/layout/Navbar";
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedPages/ProtectPage";

const CommunityPage = () => {
  const user = useSelector((state) => state.dataUser);
  console.log(user);
  return (
    <ProtectedRoute>
      <>
        <Navbar />
        <h1>Community ni bos</h1>
      </>
    </ProtectedRoute>
  );
};

export default CommunityPage;
