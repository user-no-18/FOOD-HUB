import React from "react";

const ShopCard = ({ shop }) => {
  return (
    <div className="w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="w-full h-[170px] overflow-hidden">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h2 className="font-semibold text-gray-900 truncate">{shop.name}</h2>
        <p className="text-gray-600 text-sm">{shop.city}, {shop.state}</p>
      </div>
    </div>
  );
};

export default ShopCard;
