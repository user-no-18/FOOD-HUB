import React, { useEffect, useState, useRef } from "react";
import { FaLocationDot, FaCartShopping, FaUser } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FiPlus, FiLogOut } from "react-icons/fi";
import { TbReceipt2 } from "react-icons/tb";
import { MdRestaurantMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../Redux/user.slice";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchItems } from "../Redux/user.slice";

function CommonNav() {
  const { city, userData, pendingOrdersCount, searchItems } = useSelector(
    (state) => state.user
  );

  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(setUserData(null));
    navigate("/login");
  };

  const handleSearchItems = async () => {
    if (!query.trim()) {
      dispatch(setSearchItems([]));
      setShowSearchResults(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await axios.get(
        `${serverUrl}/api/item/search-item?query=${query}&city=${city}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data.items || []));
      setShowSearchResults(true);
    } catch (error) {
      console.log(error);
      dispatch(setSearchItems([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearchItems();
      } else {
        dispatch(setSearchItems([]));
        setShowSearchResults(false);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [query]);

  const handleItemClick = (itemId, shopId) => {
    setShowSearchResults(false);
    setQuery("");
    navigate(`/shop/${shopId}`); // Adjust route as needed
  };

  if (!userData) return null;

  // Search Results Dropdown Component
  const SearchResults = ({ isMobile = false }) => {
    if (!showSearchResults || !query.trim()) return null;

    return (
      <div
        className={`absolute ${
          isMobile ? "left-0 right-0 top-full" : "left-0 right-0 top-full"
        } mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
      >
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-3 text-sm">Searching...</p>
          </div>
        ) : searchItems && searchItems.length > 0 ? (
          <div className="p-2">
            {/* <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Found {searchItems.length} item{searchItems.length > 1 ? "s" : ""}
            </p> */}
            {searchItems.map((item) => (
              <div
                key={item._id}
                onClick={() => handleItemClick(item._id, item.shop._id)}
                className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-all duration-200 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={item.image || "/placeholder-food.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {item.shop?.name || "Unknown Shop"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-orange-600">
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <IoIosSearch className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No items found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* USER NAV */}
      {userData.role === "user" && (
        <nav className="fixed top-0 left-0 right-0 bg-[#FFFBF5] shadow-sm z-[9999] border-b border-gray-200 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16 h-20 max-w-[1400px] mx-auto">
            {/* Logo Section */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group min-w-fit"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <MdRestaurantMenu className="text-white text-2xl" />
              </div>
              <h1 className="hidden sm:block text-3xl tracking-tighter">
                <span className="font-story bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Food
                </span>
                <span className="font-funnel ml-1 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Hub
                </span>
              </h1>
            </div>

            {/* Desktop Search Bar with Results */}
            <div className="hidden lg:block w-full max-w-2xl mx-8 relative" ref={searchRef}>
              <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-200 px-5 py-3 gap-4 hover:shadow-md transition-all duration-200">
                <FaLocationDot className="text-orange-500 text-xl flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 border-r border-gray-300 pr-4 truncate min-w-[100px] flex-shrink-0">
                  {city || "Locating..."}
                </span>
                <IoIosSearch className="text-gray-400 text-2xl flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for delicious food..."
                  className="w-full outline-none text-gray-800 text-base placeholder:text-gray-400 bg-transparent font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.trim() && setShowSearchResults(true)}
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setShowSearchResults(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <RxCross2 className="text-xl" />
                  </button>
                )}
              </div>
              <SearchResults />
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => navigate("/my-carts")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-orange-50 transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <FaCartShopping className="text-xl text-orange-500" />
                <span>Cart</span>
              </button>

              <button
                onClick={() => navigate("/my-orders")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-orange-50 transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <TbReceipt2 className="text-xl text-orange-500" />
                <span>Orders</span>
              </button>

              {/* User Info Display */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {userData?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{userData?.email}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowInfo((p) => !p)}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                  >
                    {userData?.fullName?.[0]?.toUpperCase() || "U"}
                  </button>

                  {showInfo && (
                    <div className="absolute right-0 top-16 w-56 bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-2 py-2 border-b border-gray-200">
                        <p className="font-bold text-gray-900 text-base truncate">
                          {userData?.fullName}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {userData?.email || "User"}
                        </p>
                      </div>
                      <button
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 font-semibold"
                        onClick={handleLogOut}
                      >
                        <FiLogOut className="text-lg" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Right Section */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-all duration-200 shadow-sm"
                onClick={() => setShowSearch(!showSearch)}
              >
                {showSearch ? (
                  <RxCross2 className="text-2xl" />
                ) : (
                  <IoIosSearch className="text-2xl" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowInfo((p) => !p)}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-base shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  {userData?.fullName?.[0]?.toUpperCase() || "U"}
                </button>

                {showInfo && (
                  <div className="absolute right-0 top-14 w-52 bg-white shadow-2xl rounded-2xl border border-gray-200 p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-2 py-2 border-b border-gray-200">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {userData?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {userData?.email || "User"}
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 px-2 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-150 font-semibold"
                      onClick={() => {
                        navigate("/my-carts");
                        setShowInfo(false);
                      }}
                    >
                      <FaCartShopping className="text-orange-500" />
                      <span>My Cart</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-2 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-150 font-semibold"
                      onClick={() => {
                        navigate("/my-orders");
                        setShowInfo(false);
                      }}
                    >
                      <TbReceipt2 className="text-orange-500" />
                      <span>My Orders</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-2 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 font-semibold"
                      onClick={handleLogOut}
                    >
                      <FiLogOut />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar with Results */}
          {showSearch && (
            <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
              <div className="relative" ref={searchRef}>
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                  <FaLocationDot className="text-orange-500 text-lg flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700 border-r border-gray-300 pr-3 truncate max-w-[90px] flex-shrink-0">
                    {city || "Locating..."}
                  </span>
                  <IoIosSearch className="text-gray-400 text-xl flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search food..."
                    className="w-full outline-none text-sm bg-transparent text-gray-800 placeholder:text-gray-400 font-medium"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setShowSearchResults(true)}
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setShowSearchResults(false);
                      }}
                      className="text-gray-400"
                    >
                      <RxCross2 className="text-lg" />
                    </button>
                  )}
                </div>
                <SearchResults isMobile={true} />
              </div>
            </div>
          )}
        </nav>
      )}

      {/* OWNER NAV */}
      {userData.role === "owner" && (
        <nav className="fixed top-0 left-0 right-0 bg-[#FFFBF5] shadow-sm z-[9999] border-b border-gray-200 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16 h-20 max-w-[1400px] mx-auto">
            {/* Logo */}
            <div
              onClick={() => navigate("/owner-dashboard")}
              className="flex items-center gap-3 cursor-pointer group min-w-fit"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <MdRestaurantMenu className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                FoodHub
              </h1>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => navigate("/additem")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <FiPlus className="text-lg" />
                <span>Add Item</span>
              </button>

              <button
                onClick={() => navigate("/my-orders")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-orange-50 transition-all duration-200 border border-transparent hover:border-orange-200 relative"
              >
                <TbReceipt2 className="text-xl text-orange-500" />
                <span>Orders</span>
                {pendingOrdersCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[22px] h-[22px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              {/* User Info Display */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {userData?.fullName}
                  </p>
                  <p className="text-xs text-orange-600 font-semibold">Owner</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowInfo((p) => !p)}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                  >
                    {userData?.fullName?.[0]?.toUpperCase() || "O"}
                  </button>

                  {showInfo && (
                    <div className="absolute right-0 top-16 w-56 bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-2 py-2 border-b border-gray-200">
                        <p className="font-bold text-gray-900 text-base truncate">
                          {userData?.fullName}
                        </p>
                        <p className="text-sm text-orange-600 font-semibold">
                          Owner
                        </p>
                      </div>
                      <button
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 font-semibold"
                        onClick={handleLogOut}
                      >
                        <FiLogOut className="text-lg" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => navigate("/additem")}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <FiPlus className="text-xl" />
              </button>

              <button
                onClick={() => navigate("/my-orders")}
                className="relative w-11 h-11 rounded-xl bg-white border border-gray-200 text-orange-600 flex items-center justify-center hover:bg-orange-50 transition-all duration-200 shadow-sm"
              >
                <TbReceipt2 className="text-xl" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowInfo((p) => !p)}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-base shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  {userData?.fullName?.[0]?.toUpperCase() || "O"}
                </button>

                {showInfo && (
                  <div className="absolute right-0 top-14 w-52 bg-white shadow-2xl rounded-2xl border border-gray-200 p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-2 py-2 border-b border-gray-200">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {userData?.fullName}
                      </p>
                      <p className="text-xs text-orange-600 font-semibold">
                        Owner
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 px-2 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 font-semibold"
                      onClick={handleLogOut}
                    >
                      <FiLogOut />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* DELIVERY BOY NAV */}
      {userData.role === "deliveryBoy" && (
        <nav className="fixed top-0 left-0 right-0 bg-[#FFFBF5] shadow-sm z-[9999] border-b border-gray-200 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16 h-20 max-w-[1400px] mx-auto">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group min-w-fit"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <MdRestaurantMenu className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                FoodHub
              </h1>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => navigate("/my-orders")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-orange-50 transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <TbReceipt2 className="text-xl text-orange-500" />
                <span>My Deliveries</span>
              </button>

              {/* User Info Display */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {userData?.fullName}
                  </p>
                  <p className="text-xs text-orange-600 font-semibold">
                    Delivery Partner
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowInfo((p) => !p)}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                  >
                    {userData?.fullName?.[0]?.toUpperCase() || "D"}
                  </button>

                  {showInfo && (
                    <div className="absolute right-0 top-16 w-56 bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-2 py-2 border-b border-gray-200">
                        <p className="font-bold text-gray-900 text-base truncate">
                          {userData?.fullName}
                        </p>
                        <p className="text-sm text-orange-600 font-semibold">
                          Delivery Partner
                        </p>
                      </div>
                      <button
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 font-semibold"
                        onClick={handleLogOut}
                      >
                        <FiLogOut className="text-lg" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => navigate("/my-orders")}
                className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-orange-600 flex items-center justify-center hover:bg-orange-50 transition-all duration-200 shadow-sm"
              >
                <TbReceipt2 className="text-xl" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowInfo((p) => !p)}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-base shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  {userData?.fullName?.[0]?.toUpperCase() || "D"}
                </button>

                {showInfo && (
                  <div className="absolute right-0 top-14 w-52 bg-white shadow-2xl rounded-2xl border border-gray-200 p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-2 py-2 border-b border-gray-200">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {userData?.fullName}
                      </p>
                      <p className="text-xs text-orange-600 font-semibold">
                        Delivery Partner
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 px-2 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 font-semibold"
                      onClick={handleLogOut}
                    >
                      <FiLogOut />
                      <span>Log Out</span>
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