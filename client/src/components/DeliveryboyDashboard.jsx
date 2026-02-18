import React, { useEffect, useState } from "react";
import CommonNav from "./CommonNav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import socket from "../socket";
import useDeliveryBoyLocationTracker from "../Hooks/useDeliveryBoyLocationTracker";

const DeliveryBoyDashboard = () => {
  const { userData, city } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);

  // 🚀 Track delivery boy location in real-time (updates every 3 seconds)
  useDeliveryBoyLocationTracker(userData, 3000);

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
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/order/get-current-order`, {
        withCredentials: true,
      });
      console.log("Current Order:", res.data);

      if (res.data.success) {
        setCurrentOrder(res.data);
      } else {
        setCurrentOrder(null);
      }
    } catch (error) {
      console.error("Error fetching current order:", error);
      setCurrentOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {},
        { withCredentials: true },
      );
      await getCurrentOrder();
      await getAssignments();
      console.log("Accept Order Response:", res.data);
    } catch (error) {
      console.error("Error accepting order:", error);
      alert(error.response?.data?.message || "Failed to accept order");
    }
  };

  const sendOtp = async () => {
    try {
      console.log("📧 Sending OTP...");
      console.log("Order ID:", currentOrder.orderId);
      console.log(
        "Shop ID:",
        currentOrder.shopOrder?.shop,
      );

      const res = await axios.post(
        `${serverUrl}/api/order/send-otp`,
        {
          orderId: currentOrder.orderId,
          shopId:currentOrder.shopOrder?.shop,
        },
        { withCredentials: true },
      );

      console.log("OTP sent:", res.data);
      setShowOtp(true);
      setOtp("");
      alert("OTP sent to customer!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      console.error("Error response:", error.response?.data);
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      console.log("🔐 Verifying OTP...");
      console.log("Order ID:", currentOrder.orderId);
      console.log(
        "Shop ID:",
        currentOrder.shopOrder?.shop?._id || currentOrder.shopOrder?.shop,
      );
      console.log("OTP:", otp);

      const res = await axios.post(
        `${serverUrl}/api/order/verify-otp`,
        {
          orderId: currentOrder.orderId,
          shopId:
            currentOrder.shopOrder?.shop?._id || currentOrder.shopOrder?.shop,
          otp,
        },
        { withCredentials: true },
      );

      console.log("✅ OTP verified:", res.data);
      setShowOtp(false);
      setOtp("");
      await getCurrentOrder();
      alert("Order delivered ");
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      console.error("Error response:", error.response?.data);
      alert(
        error.response?.data?.message || "Invalid OTP or verification failed",
      );
    }
  };

  useEffect(() => {
    if (userData) {
      getAssignments();
      getCurrentOrder();
    }
  }, [userData]);

  useEffect(() => {
    if (!userData || userData.role !== "deliveryBoy") return;

    const handleNewAssignment = (assignmentData) => {
      console.log("New assignment received:", assignmentData);

      if (!assignmentData || !assignmentData.id) {
        console.error("Invalid assignment data");
        return;
      }

      const isDuplicate = assignments.some((a) => a.id === assignmentData.id);

      if (!isDuplicate) {
        setAssignments((prev) => [assignmentData, ...prev]);
      }

      if (Notification.permission === "granted") {
        new Notification("🚴 New Delivery Assignment!", {
          body: `${assignmentData.shopName} - ₹${assignmentData.subtotal}`,
          icon: "/vite.svg",
          tag: assignmentData.id,
        });
      }

      const audio = new Audio("/notification.mp3");
      audio.play().catch((err) => console.log("Audio play failed:", err));
    };

    socket.on("new-assignment", handleNewAssignment);

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("new-assignment", handleNewAssignment);
    };
  }, [userData, assignments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonNav />

      <div className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full w-fit">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Active • Tracking</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : !currentOrder ? (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Available Orders
              {assignments.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({assignments.length} available)
                </span>
              )}
            </h2>

            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white border-2 border-gray-300 rounded-lg p-4 sm:p-5 hover:border-orange-400 transition-colors"
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
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md text-sm transition-colors duration-200 self-start sm:self-auto whitespace-nowrap"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-base font-medium">
                  No assignments available at the moment.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  You'll be notified when new orders are available
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-md border border-orange-100">
            <h2 className="text-lg font-bold mb-3">Current Order</h2>

            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                Shop ID: {currentOrder?.shopOrder?.shop || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder?.deliveryAddress?.text || "Address not available"}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder?.shopOrder?.shopOrderItems?.length || 0} items | ₹
                {currentOrder?.shopOrder?.subtotal || 0}
              </p>
            </div>

            {currentOrder?.deliveryAddress &&
              currentOrder?.deliveryBoyLocation && (
                <DeliveryBoyTracking data={currentOrder} />
              )}

            {!showOtp ? (
              <button
                onClick={sendOtp}
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-green-600 active:scale-95 transition-all duration-200"
              >
                Mark As Delivered
              </button>
            ) : (
              <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                <p className="text-sm font-semibold m-2">
                  Enter OTP sent to
                  <span className="text-xl font-bold text-rose-500 m-2">
                    {currentOrder?.user?.fullName || "Customer"}
                  </span>
                </p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={4}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-3"
                />
                <div className="flex gap-4">
                  <button
                    onClick={verifyOtp}
                    disabled={otp.length !== 4}
                    className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-green-600 active:scale-95 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Submit OTP
                  </button>
                  <button
                    onClick={() => {
                      setShowOtp(false);
                      setOtp("");
                    }}
                    className="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-gray-600 active:scale-95 transition-all duration-200"
                  >
                    Cancel
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