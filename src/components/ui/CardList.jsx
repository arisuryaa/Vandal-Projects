import React from "react";
import { Link } from "react-router";

const CardList = (props) => {
  return (
    <div className={`flex flex-col px-4 py-4 gap-4 border border-background rounded-xl ${props.className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1>{props.title}</h1>
        </div>
        <Link>View More</Link>
      </div>
      <div className="flex flex-col gap-2 justify-between h-full py-3">
        {props.data
          ? props.data.map((e) => {
              return (
                <Link props={e} key={e.item.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={e.item.small} className="w-4 h-4 rounded-full" alt="" />
                      <h1>{e.item.name}</h1>
                    </div>
                    <div className="flex gap-2 items-center">
                      <h1>${e.item.data.price.toFixed(3)}</h1>
                      <h1 className={e.item.data.price_change_percentage_24h.usd > 0 ? `text-sm text-green-500` : ` text-sm text-red-500`}>
                        {e.item.data.price_change_percentage_24h.usd.toFixed(1)} %
                      </h1>
                    </div>
                  </div>
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default CardList;
