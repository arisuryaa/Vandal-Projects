import React from "react";

const Card = (props) => {
  return (
    <div className={`flex justify-between gap-5 border border-background py-5 px-4 rounded-xl ${props.className}`}>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">{props.title}</h1>
        <p className="text-sm text-white opacity-50">{props.description}</p>
      </div>
      <h1>Foto</h1>
    </div>
  );
};

export default Card;
