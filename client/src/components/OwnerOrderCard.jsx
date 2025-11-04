import React from "react";
import { MdPhone, MdLocationOn, MdStore } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyOrders } from "../Redux/user.slice";
import { useState } from "react";

const OwnerOrderCard = ({ data }) => {
  const dispatch = useDispatch();
  const [availableBoy, setAvailableBoy] = useState([]);
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      "out-for-delivery": "bg-blue-100 text-blue-800 border-blue-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      statusColors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  const handleStatusChange = async (orderId, shopId, status) => {
    try {
      const res = await axios.patch(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );

      // Refresh orders after successful update
      if (res.data.success) {
        const updatedOrders = await axios.get(
          `${serverUrl}/api/order/get-orders`,
          { withCredentials: true }
        );
        dispatch(setMyOrders(updatedOrders.data));
        setAvailableBoy(res.data.availableBoys);
        console.log(availableBoy);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to update status!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">Order ID</p>
            <p className="text-lg font-bold">
              #{data._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs opacity-80 mt-1">
              {formatDate(data.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <FaMoneyBillWave />
              <p className="text-sm font-medium">
                {data.paymentMethod?.toUpperCase()}
              </p>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                data.shopOrder?.status
              )}`}
            >
              {data.shopOrder?.status?.toUpperCase() || "PENDING"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Customer Details
        </h3>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900">
            {data.user?.fullName}
          </h2>
          <p className="text-sm text-gray-600">{data.user?.email}</p>
          <a
            href={`tel:${data.user?.mobile}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition w-fit"
          >
            <MdPhone /> <span>{data.user?.mobile}</span>
          </a>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <MdLocationOn className="text-red-500" /> Delivery Address
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {data?.address?.text}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Coordinates: {data?.address?.latitude?.toFixed(6)},{" "}
          {data?.address?.longitude?.toFixed(6)}
        </p>
      </div>

      <div className="px-6 py-4">
        {data.shopOrder && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <MdStore className="text-[#ff4d2d] text-xl" />
              <h3 className="text-lg font-bold text-gray-900">
                {data.shopOrder.shop?.name}
              </h3>
            </div>

            <div className="space-y-2">
              {data.shopOrder.shopOrderItems?.map((orderItem, index) => {
                const itemData = orderItem.item;
                const itemName =
                  itemData?.name || orderItem.name || "Unknown Item";
                const itemPrice = itemData?.price || orderItem.price || 0;
                const itemImage = itemData?.image;
                const itemQuantity = orderItem.quantity || 1;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    {itemImage ? (
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{itemName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600">
                          Qty:{" "}
                          <span className="font-medium">{itemQuantity}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Price:{" "}
                          <span className="font-medium">₹{itemPrice}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-[#ff4d2d] text-lg">
                        ₹{(itemPrice * itemQuantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
              <p className="text-lg font-bold text-gray-900">Order Total</p>
              <p className="text-2xl font-bold text-[#ff4d2d]">
                ₹{data.shopOrder.subtotal?.toFixed(2) || "0.00"}
              </p>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              Current Status : {data.shopOrder?.status}
            </h3>
            <div className="pt-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Order Status
              </label>
              <select
                value={data.shopOrder?.status || "pending"}
                onChange={(e) => {
                  handleStatusChange(
                    data._id,
                    data.shopOrder.shop._id,
                    e.target.value
                  );
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium cursor-pointer transition"
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {data.shopOrder?.status === "out-for-delivery" && (
              <div className="mt-4 p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-orange-500">🚴</span>
                  Available Delivery Boys:
                </h4>

                {availableBoy?.length > 0 ? (
                  <div className="space-y-2">
                    {availableBoy.map((b, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100 hover:border-orange-300 transition"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {b.fullName}
                          </p>
                          <p className="text-sm text-gray-600">{b.mobile}</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                    <span>Waiting for delivery boy to accept...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerOrderCard;
