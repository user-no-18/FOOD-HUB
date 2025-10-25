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

  // If no user logged in, return nothing
  if (!userData) return null;

  return (
    <>
      {/* ---------------- USER NAV ---------------- */}
      {userData.role === "user" && (
        <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-[9999]">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-12 h-[64px] max-w-screen-2xl mx-auto">
            {/* Logo */}
            <h1
              onClick={() => navigate("/")}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ff4d2d] cursor-pointer select-none flex-shrink-0"
            >
              Vingo
            </h1>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center w-[45%] max-w-[520px] bg-white rounded-xl border border-gray-200 shadow-sm px-3 lg:px-4 py-2 gap-2 lg:gap-3 mx-4">
              <FaLocationDot className="text-[#ff4d2d] text-base lg:text-lg flex-shrink-0" />
              <span className="truncate text-gray-600 border-r border-gray-300 pr-2 lg:pr-3 text-xs lg:text-sm w-[30%] flex-shrink-0">
                {city || "searching..."}
              </span>
              <IoIosSearch className="text-[#ff4d2d] text-base lg:text-lg flex-shrink-0" />
              <input
                type="text"
                placeholder="Search food or restaurant..."
                className="w-full outline-none text-gray-700 text-xs lg:text-sm min-w-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-shrink-0">
              {/* Mobile Search Toggle */}
              {!showSearch ? (
                <IoIosSearch
                  className="text-[#ff4d2d] text-xl sm:text-2xl md:hidden cursor-pointer"
                  onClick={() => setShowSearch(true)}
                />
              ) : (
                <RxCross2
                  className="text-[#ff4d2d] text-xl sm:text-2xl md:hidden cursor-pointer"
                  onClick={() => setShowSearch(false)}
                />
              )}

              {/* Profile */}
              <div className="relative">
                <div
                  onClick={() => setShowInfo((p) => !p)}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white font-semibold text-base sm:text-lg shadow-md cursor-pointer"
                >
                  {userData?.fullName?.[0]?.toUpperCase() || "?"}
                </div>

                {showInfo && (
                  <div className="absolute right-0 top-[45px] sm:top-[50px] w-[160px] sm:w-[170px] bg-white shadow-lg rounded-lg border border-gray-100 p-2 sm:p-3 flex flex-col gap-2">
                    <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                      {userData?.fullName}
                    </span>
                    <button
                      className="text-[#ff4d2d] text-xs sm:text-sm font-semibold hover:underline text-left"
                      onClick={() => {
                        navigate("/my-orders");
                        setShowInfo(false);
                      }}
                    >
                      My Orders
                    </button>
                    <button
                      className="text-[#ff4d2d] text-xs sm:text-sm font-semibold hover:underline text-left"
                      onClick={handleLogOut}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <div className="w-full bg-white shadow-lg rounded-b-xl px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 md:hidden border-t border-gray-100">
              <FaLocationDot className="text-[#ff4d2d] text-base sm:text-lg flex-shrink-0" />
              <span className="truncate text-gray-600 border-r border-gray-300 pr-2 text-xs sm:text-sm max-w-[80px] sm:max-w-[100px] flex-shrink-0">
                {city || "searching..."}
              </span>
              <IoIosSearch className="text-[#ff4d2d] text-base sm:text-lg flex-shrink-0" />
              <input
                type="text"
                placeholder="Search delicious food..."
                className="w-full outline-none text-gray-700 text-xs sm:text-sm min-w-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          )}
        </nav>
      )}

      {/* ---------------- OWNER NAV ---------------- */}
      {userData.role === "owner" && (
        <div className="w-full h-[64px] sm:h-[70px] md:h-[80px] flex items-center justify-between md:justify-center gap-[20px] sm:gap-[30px] px-[15px] sm:px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] shadow-sm">
          {/* Logo */}
          <h1
            className="text-xl sm:text-2xl font-bold text-[#ff4d2d] cursor-pointer flex-shrink-0"
            onClick={() => navigate("/owner-dashboard")}
          >
            Food-HuB
          </h1>

          {/* Owner Controls */}
          <div className="flex items-center gap-[15px] sm:gap-[20px] flex-shrink-0">
            {/* Add Food Item */}
            <button
              onClick={() => navigate("/additem")}
              className="hidden md:flex items-center gap-1 px-3 py-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] hover:bg-[#ff4d2d]/20 transition-colors"
            >
              <FiPlus size={16} />
              <span className="text-sm font-medium whitespace-nowrap">Add Food Item</span>
            </button>
            <button
              onClick={() => navigate("/additem")}
              className="flex md:hidden items-center justify-center w-9 h-9 sm:w-10 sm:h-10 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] hover:bg-[#ff4d2d]/20 transition-colors"
            >
              <FiPlus size={18} />
            </button>

            {/* Pending Orders */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20 transition-colors"
              onClick={() => navigate("/pending-orders")}
            >
              <TbReceipt2 className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]" />
              <span className="text-sm whitespace-nowrap">My Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <div
              className="flex md:hidden items-center justify-center relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer hover:bg-[#ff4d2d]/20 transition-colors"
              onClick={() => navigate("/pending-orders")}
            >
              <TbReceipt2 className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -right-1 -top-1 text-[10px] font-bold text-white bg-[#ff4d2d] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                  {pendingOrdersCount}
                </span>
              )}
            </div>

            {/* Profile */}
            <div className="relative overflow-visible">
              <div
                className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-base sm:text-[18px] shadow-xl font-semibold cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => setShowInfo((p) => !p)}
              >
                {userData?.fullName?.[0]?.toUpperCase() || "?"}
              </div>

              {showInfo && (
                <div className="fixed top-[70px] sm:top-[75px] md:top-[85px] right-[10px] sm:right-[15px] md:right-[10%] lg:right-[25%] w-[160px] sm:w-[180px] bg-white shadow-2xl rounded-xl p-[15px] sm:p-[20px] flex flex-col gap-[10px] z-[9999] border border-gray-100">
                  <div className="text-[15px] sm:text-[17px] font-semibold truncate">
                    {userData?.fullName}
                  </div>
                  <div
                    className="text-[#ff4d2d] text-sm sm:text-base font-semibold cursor-pointer hover:underline"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommonNav;