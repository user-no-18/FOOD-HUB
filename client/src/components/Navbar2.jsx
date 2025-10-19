import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { TbReceipt2 } from "react-icons/tb";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from '../App';
import { setUserData } from '../Redux/user.slice';
// import {useGetShop} from '../Redux/owner.slice';
function Nav() {
  const { userData, pendingOrdersCount } = useSelector(state => state.user);
  // const {shopData} = useSelector(state => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(setUserData(null));
    navigate("/login");
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6]">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-2 text-[#ff4d2d]">Food-HuB</h1>

      {/* Owner Controls */}
      <div className="flex items-center gap-[20px]">
        {/* Add Food Item */}
        <button
          onClick={() => navigate("/additem")}
          className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
        >
          <FiPlus size={16} />
          <span className="text-sm font-medium">Add Food Item</span>
        </button>
        <button
          onClick={() => navigate("/additem")}
          className="flex md:hidden items-center justify-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
        >
          <FiPlus size={18} />
        </button>

        {/* Pending Orders */}
        <div
          className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium"
          onClick={() => navigate("/pending-orders")}
        >
          <TbReceipt2 className="w-[22px] h-[22px]" />
          <span className="text-sm">My Orders</span>
          <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
            {pendingOrdersCount}
          </span>
        </div>
        <div
          className="flex md:hidden items-center justify-center relative p-2 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
          onClick={() => navigate("/pending-orders")}
        >
          <TbReceipt2 className="w-[22px] h-[22px]" />
          <span className="absolute -right-1 -top-1 text-[10px] font-bold text-white bg-[#ff4d2d] rounded-full px-[4px] py-[0px]">
            {pendingOrdersCount}
          </span>
        </div>

        {/* Profile */}
        <div className="relative overflow-visible">
          <div
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
            onClick={() => setShowInfo(prev => !prev)}
          >
            {userData?.fullName?.slice(0, 1)}
          </div>

          {showInfo && (
            <div className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
              <div className="text-[17px] font-semibold">{userData?.fullName}</div>
              <div
                className="text-[#ff4d2d] font-semibold cursor-pointer"
                onClick={handleLogOut}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
