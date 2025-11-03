import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FiPlus } from "react-icons/fi";
import { TbReceipt2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../Redux/user.slice";

function CommonNav() {
  const { city, userData, pendingOrdersCount } = useSelector(
    (state) => state.user
  );
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(setUserData(null));
    navigate("/login");
  };

  if (!userData) return null;

  return (
    <>
      {/* USER NAV */}
      {userData.role === "user" && (
        <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-50 via-white to-orange-50 backdrop-blur-lg shadow-md z-[9999] border-b border-orange-100">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 h-16 sm:h-18 max-w-7xl mx-auto">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg sm:text-xl">V</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Vingo
              </h1>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center w-full max-w-xl mx-6 lg:mx-8 bg-white rounded-2xl shadow-sm border border-orange-200 px-4 py-2.5 gap-3 hover:shadow-md transition-shadow duration-200">
              <FaLocationDot className="text-orange-500 text-lg flex-shrink-0" />
              <span className="text-sm text-gray-600 border-r border-gray-200 pr-3 truncate w-28 flex-shrink-0">
                {city || "searching..."}
              </span>
              <IoIosSearch className="text-orange-500 text-xl flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for food or restaurant..."
                className="w-full outline-none text-gray-700 text-sm placeholder:text-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Search Toggle */}
              <button
                className="md:hidden w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors duration-200"
                onClick={() => setShowSearch(!showSearch)}
              >
                {showSearch ? (
                  <RxCross2 className="text-xl" />
                ) : (
                  <IoIosSearch className="text-xl" />
                )}
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowInfo((p) => !p)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  {userData?.fullName?.[0]?.toUpperCase() || "?"}
                </button>

                {showInfo && (
                  <div className="absolute right-0 top-14 w-48 bg-white shadow-2xl rounded-2xl border border-orange-100 p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-2 py-1.5 border-b border-orange-100">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {userData?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData?.email || "User"}
                      </p>
                    </div>
                    <button
                      className="px-2 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors duration-150 font-medium"
                      onClick={() => {
                        navigate("/my-carts");
                        setShowInfo(false);
                      }}
                    >
                      🛒 My Carts
                    </button>
                    <button
                      className="px-2 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors duration-150 font-medium"
                      onClick={() => {
                        navigate("/my-orders");
                        setShowInfo(false);
                      }}
                    >
                      📦 My Orders
                    </button>
                    <button
                      className="px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 font-medium"
                      onClick={handleLogOut}
                    >
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <div className="md:hidden bg-white border-t border-orange-100 px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 bg-orange-50 rounded-2xl px-4 py-2.5 border border-orange-200">
                <FaLocationDot className="text-orange-500 text-base flex-shrink-0" />
                <span className="text-xs text-gray-600 border-r border-gray-300 pr-3 truncate max-w-[80px] flex-shrink-0">
                  {city || "searching..."}
                </span>
                <IoIosSearch className="text-orange-500 text-lg flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search food..."
                  className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder:text-gray-400"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
          )}
        </nav>
      )}

      {/* OWNER NAV */}
      {userData.role === "owner" && (
        <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-50 via-white to-orange-50 backdrop-blur-lg shadow-md z-[9999] border-b border-orange-100">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-18 max-w-7xl mx-auto">
            {/* Logo */}
            <div
              onClick={() => navigate("/owner-dashboard")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg sm:text-xl">F</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Food-HuB
              </h1>
            </div>

            {/* Owner Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Add Food Item */}
              <button
                onClick={() => navigate("/additem")}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <FiPlus size={18} />
                <span>Add Food Item</span>
              </button>
              <button
                onClick={() => navigate("/additem")}
                className="md:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <FiPlus size={20} />
              </button>

              {/* Pending Orders */}
              <button
                onClick={() => navigate("/my-orders")}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-medium text-sm border border-orange-200 hover:bg-orange-100 transition-all duration-200 relative"
              >
                <TbReceipt2 size={20} />
                <span>My Orders</span>
                {pendingOrdersCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[22px] h-[22px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/my-orders")}
                className="md:hidden relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-all duration-200"
              >
                <TbReceipt2 size={20} />
                {pendingOrdersCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowInfo((p) => !p)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  {userData?.fullName?.[0]?.toUpperCase() || "?"}
                </button>

                {showInfo && (
                  <div className="absolute right-0 top-14 w-48 bg-white shadow-2xl rounded-2xl border border-orange-100 p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-2 py-1.5 border-b border-orange-100">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {userData?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">Owner</p>
                    </div>
                    <button
                      className="px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 font-medium"
                      onClick={handleLogOut}
                    >
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

export default CommonNav;