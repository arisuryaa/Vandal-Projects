import React from "react";

const Card = (props) => {
  return (
    <div className={`flex justify-between gap-2 border border-background py-5 px-4 rounded-xl ${props.className}`}>
      <div className="flex flex-col gap-2  w-[60%]">
        <h1 className="text-base font-semibold">{props.title}</h1>
        <p className="text-sm text-white opacity-50">{props.description}</p>
      </div>
      <div className=" w-[35%] h-10">{props.chart}</div>
    </div>
  );
};

export default Card;
