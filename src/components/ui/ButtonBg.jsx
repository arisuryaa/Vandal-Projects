import React from "react";
import { Link } from "react-router";

const ButtonBg = ({ children, to }) => {
  return (
    <Link to={to} className="bg-slate-800 px-4 py-2 rounded-lg text-sm ">
      {children}
    </Link>
  );
};

export default ButtonBg;
