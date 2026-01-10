import React from "react";
import { IoLocationOutline } from "react-icons/io5";

const ShopCard = ({ shop }) => {
  return (
    <div className="w-full max-w-[250px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
      {/* Image Section */}
      <div className="w-full aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2">
        {/* Shop Name */}
        <h2 className="font-semibold text-gray-900 text-base truncate">
          {shop.name}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <IoLocationOutline className="text-orange-500 text-base flex-shrink-0" />
          <p className="text-sm truncate">
            {shop.city}, {shop.state}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;