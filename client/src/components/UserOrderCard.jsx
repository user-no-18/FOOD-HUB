import React from "react";
import { FaStore, FaPhoneAlt } from "react-icons/fa";
import { MdDeliveryDining, MdPayment, MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      ready: "bg-green-100 text-green-800 border-green-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const handleTrackOrder = () => {
    navigate(`/track-order/${data._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] px-6 py-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">Order ID</p>
            <p className="text-lg font-bold">#{data._id.slice(-8).toUpperCase()}</p>
            <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
              <MdDeliveryDining className="text-base" />
              {formatDate(data.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <MdPayment />
              <p className="text-sm font-medium">{data.paymentMethod?.toUpperCase()}</p>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                data.shopOrders?.[0]?.status
              )}`}
            >
              {data.shopOrders?.[0]?.status?.toUpperCase() || "PENDING"}
            </span>
          </div>
        </div>
      </div>

      {/* Shop Orders Section */}
      <div className="p-6 space-y-4">
        {data.shopOrders?.map((shopOrder, shopIndex) => (
          <div key={shopIndex} className="space-y-3">
            {/* Shop Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaStore className="text-[#ff4d2d] text-lg" />
                <p className="font-semibold text-gray-900 text-lg">
                  {shopOrder.shop.name}
                </p>
              </div>
              {shopOrder.owner?.mobile && (
                <a
                  href={`tel:${shopOrder.owner.mobile}`}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  <FaPhoneAlt className="text-xs" />
                  {shopOrder.owner.mobile}
                </a>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {shopOrder.shopOrderItems?.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🍽️</span>
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500">
                          Qty: <span className="font-medium text-gray-700">{item.quantity}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: <span className="font-medium text-gray-700">₹{item.price}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#ff4d2d] text-lg">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shop Subtotal */}
            <div className="flex justify-end pt-2">
              <div className="text-right">
                <p className="text-sm text-gray-600">Shop Subtotal</p>
                <p className="font-semibold text-gray-900">₹{shopOrder.subtotal?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Delivery Address */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-700 leading-relaxed">{data.address?.text}</p>
          </div>
        </div>

        {/* Total Section + Track Order Button */}
        <div className="pt-4 border-t-2 border-gray-300">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-gray-900">Total Amount</p>
            <p className="text-2xl font-bold text-[#ff4d2d]">
              ₹{data.totalAmount?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Track Order Button / Status Messages */}
        <div className="pt-4">
          {data.shopOrders?.[0]?.status === "delivered" ? (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">✓ Order Delivered Successfully</p>
              <p className="text-green-600 text-sm mt-1">Thank you for your order!</p>
            </div>
          ) : data.shopOrders?.[0]?.status === "cancelled" ? (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
              <p className="text-red-800 font-semibold">✗ Order Cancelled</p>
              <p className="text-red-600 text-sm mt-1">This order has been cancelled</p>
            </div>
          ) : (
            <button
              onClick={handleTrackOrder}
              className="w-full bg-[#ff4d2d] hover:bg-[#ff3814] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
            >
              <MdLocationOn className="text-xl" />
              Track Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserOrderCard;
