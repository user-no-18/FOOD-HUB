import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import { MdKeyboardBackspace } from "react-icons/md";
import OwnerOrdersDemo from "../components/OwnerOrderCard";

const MyOrderCard = () => {
  const { userData, myOrders } = useSelector((state) => state.user); // Changed from myOrder to myOrders
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4"> {/* Fixed opening quote */}
      <div className="w-full max-w-[800px] p-4">
        <div
          className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
          onClick={() => navigate("/")}
        >
          <MdKeyboardBackspace className="w-[25px] h-[25px] text-[#ff4d2d]" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        
        {/* Check if myOrders exists and has items */}
        {myOrders && myOrders.length > 0 ? (
          myOrders.map((order, index) =>
            userData?.role === "user" ? (
              <UserOrderCard key={order._id || index} data={order} />
            ) : userData?.role === "owner" ? (
              <OwnerOrdersDemo key={order._id || index} data={order} />
            ) : null
          )
        ) : (
          <p className="text-gray-600 text-center mt-8">No orders yet</p>
        )}
      </div>
    </div>
  );
};

export default MyOrderCard;