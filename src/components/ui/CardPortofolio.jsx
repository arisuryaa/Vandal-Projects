import React from "react";

const CardPortofolio = ({ title, description, style }) => {
  return (
    <div className={`${style} flex flex-col gap-2 px-3 py-4 border border-background rounded-xl`}>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-white opacity-50">{description}</p>
    </div>
  );
};

export default CardPortofolio;
