import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../Redux/user.slice"; 
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


function Nav() {
  const { city, userData } = useSelector((state) => state.user);
  const [showSearch, setShowSearch] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(setUserData(null));
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[70px] bg-white/95 backdrop-blur-md shadow-md flex items-center justify-between px-6 md:px-12 z-[9999]">
      {/* Mobile Search Box */}
      {showSearch && userData?.role === "user" && (
        <div className="absolute top-[75px] left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] bg-white shadow-2xl rounded-xl flex items-center px-4 py-2 gap-3 md:hidden">
          <div className="flex items-center gap-2 border-r border-gray-300 pr-3 text-gray-600">
            <FaLocationDot className="text-[#ff4d2d] text-xl" />
            <span className="truncate">{city || "searching..."}</span>
          </div>
          <div className="flex items-center w-full gap-2">
            <IoIosSearch className="text-[#ff4d2d] text-xl" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full outline-none text-gray-700 text-sm"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl md:text-3xl font-bold text-[#ff4d2d] cursor-pointer select-none"
      >
        Vingo
      </h1>

      {/* Desktop Search Box */}
      {userData?.role === "user" && (
        <div className="hidden md:flex items-center w-[40%] max-w-[500px] bg-white rounded-xl shadow-lg px-4 py-2 gap-3 border border-gray-100">
          <FaLocationDot className="text-[#ff4d2d] text-xl" />
          <span className="truncate text-gray-600 border-r border-gray-300 pr-3 w-[30%]">
            {city || "searching..."}
          </span>
          <IoIosSearch className="text-[#ff4d2d] text-xl" />
          <input
            type="text"
            placeholder="Search food, dish, or restaurant..."
            className="w-full outline-none text-gray-700 text-sm"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Mobile Search Toggle */}
        {userData?.role === "user" &&
          (!showSearch ? (
            <IoIosSearch
              className="text-[#ff4d2d] text-2xl md:hidden cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          ) : (
            <RxCross2
              className="text-[#ff4d2d] text-2xl md:hidden cursor-pointer"
              onClick={() => setShowSearch(false)}
            />
          ))}

        {/* Profile Icon */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white font-semibold text-lg shadow-lg cursor-pointer"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {userData?.fullName?.[0]?.toUpperCase() || "?"}
          </div>

          {showInfo && (
            <div className="absolute right-0 top-[55px] w-[180px] bg-white shadow-xl rounded-lg p-4 flex flex-col gap-3 border border-gray-100">
              <span className="font-semibold text-gray-800">
                {userData?.fullName}
              </span>
              {userData?.role === "user" && (
                <button
                  className="text-[#ff4d2d] text-sm font-semibold hover:underline text-left"
                  onClick={() => navigate("/my-orders")}
                >
                  My Orders
                </button>
              )}
              <button
                className="text-[#ff4d2d] text-sm font-semibold hover:underline text-left"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default Nav;
