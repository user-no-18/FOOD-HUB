import React, { useEffect, useState } from "react";
import CommonNav from "./CommonNav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

const DeliveryBoyDashboard = () => {
  const { userData, city } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtp, setShowOtp] = useState(false);
  const getAssignments = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      console.log("Assignments:", res.data);
      setAssignments(res.data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-current-order`, {
        withCredentials: true,
      });
      console.log("Current Order:", res.data);
      setCurrentOrder(res.data);
    } catch (error) {
      console.error("Error fetching current order:", error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {
          withCredentials: true,
        }
      );
      await getCurrentOrder();
      console.log("Accept Order Response:", res.data);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
  }, [userData]);

  const handleSendOTP = () => {
    setShowOtp(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonNav />

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back,{" "}
                <span className="text-red-500">
                  {userData?.fullName || "Delivery Partner"}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {city ? (
                  <>
                    📍 Current Location:{" "}
                    <span className="font-medium text-gray-700">{city}</span>
                  </>
                ) : (
                  "🔍 Searching for location..."
                )}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full w-fit">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Active</span>
            </div>
          </div>
        </div>
        {!currentOrder && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Available Orders
            </h2>

            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white border-2 border-gray-300 rounded-lg p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                          {assignment.shopName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Delivery Address:</span>{" "}
                          {assignment.orderAddress.text}
                        </p>
                        <p className="text-sm text-gray-500">
                          {assignment.items.length} items | ₹
                          {assignment.subtotal}
                        </p>
                      </div>

                      <button
                        onClick={() => acceptOrder(assignment.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 md:mt-4 rounded-md text-sm transition-colors duration-200 self-start sm:self-auto whitespace-nowrap"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-base">
                  No assignments available at the moment.
                </p>
              </div>
            )}
          </div>
        )}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-bold mb-3">Current Order</h2>

            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                Shop ID : {currentOrder?.shopOrder?.shop}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder.deliveryAddress.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder.shopOrder.shopOrderItems.length} items |{" "}
                {currentOrder.shopOrder.subtotal}
              </p>
            </div>
            <DeliveryBoyTracking data={currentOrder} />
            {!showOtp ? (
  <button
    onClick={handleSendOTP}
    className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow 
    hover:bg-green-600 active:scale-95 transition-all duration-200"
  >
    Mark As Delivered
  </button>
) : (
  <div className="mt-4 p-4 border rounded-xl bg-gray-50">
    <p className="text-sm font-semibold m-2">
      Enter OTP sent to
      <span className="text-xl font-bold text-rose-500 m-2">
        {currentOrder.user.fullName}
      </span>
    </p>
    <input
      type="text"
      placeholder="Enter OTP"
      className="w-full border border-gray-300 rounded-lg p-2 mb-3"
    />
    <div className="flex gap-4">
      <button
        className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow
        hover:bg-green-600 active:scale-95 transition-all duration-200"
      >
        Submit OTP
      </button>
    </div>
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
