import React, { useEffect } from "react";
import { FaStore, FaPhoneAlt } from "react-icons/fa";
import { MdDeliveryDining, MdPayment, MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import socket from "../socket";
import { updateOrderStatus } from "../Redux/user.slice";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOrderUpdate = (updateData) => {
      if (updateData.orderId === data._id) {
        dispatch(
          updateOrderStatus({
            orderId: updateData.orderId,
            shopId: updateData.shopId,
            status: updateData.status,
            shopOrder: updateData.shopOrder,
          }),
        );

        if (Notification.permission === "granted") {
          new Notification("Order Status Updated", {
            body: `Your order is now ${updateData.status}`,
            icon: "/vite.svg",
          });
        }
      }
    };

    socket.on("update-order", handleOrderUpdate);
    return () => {
      socket.off("update-order", handleOrderUpdate);
    };
  }, [data._id, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      preparing: "bg-purple-50 text-purple-700 border-purple-200",
      ready: "bg-teal-50 text-teal-700 border-teal-200",
      "out-for-delivery": "bg-orange-50 text-orange-700 border-orange-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      map[status?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  const getStatusDot = (status) => {
    const map = {
      pending: "bg-amber-500",
      confirmed: "bg-blue-500",
      preparing: "bg-purple-500",
      ready: "bg-teal-500",
      "out-for-delivery": "bg-orange-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return map[status?.toLowerCase()] || "bg-gray-500";
  };

  const getStatusStep = (status) => {
    const steps = [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
    ];
    return steps.indexOf(status);
  };

  const steps = ["Placed", "Confirmed", "Preparing", "On the way", "Delivered"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 transition-all duration-200 hover:shadow-md">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <MdDeliveryDining className="text-xl text-[#ff4d2d]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                Order #{data._id.slice(-8).toUpperCase()}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200 text-gray-600 font-medium">
                {data.paymentMethod?.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(data.createdAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{data.totalAmount?.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {data.shopOrders?.map((shopOrder, shopIndex) => {
          const currentStep = getStatusStep(shopOrder.status);
          const isDelivered = shopOrder.status === "delivered";
          const isCancelled = shopOrder.status === "cancelled";
          const isOutForDelivery = shopOrder.status === "out-for-delivery";

          return (
            <div key={shopIndex} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                    <FaStore className="text-sm" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {shopOrder.shop?.name || "Shop Name"}
                    </h3>
                    {shopOrder.owner?.mobile && (
                      <a
                        href={`tel:${shopOrder.owner.mobile}`}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#ff4d2d] transition-colors"
                      >
                        <FaPhoneAlt className="text-[10px]" />
                        <span>{shopOrder.owner.mobile}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  {!isDelivered && !isCancelled && (
                    <button
                      onClick={() => navigate(`/track-order/${data._id}`)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isOutForDelivery
                          ? "bg-[#ff4d2d] text-white hover:bg-[#e04328] shadow-sm shadow-orange-200"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <MdLocationOn
                        className={
                          isOutForDelivery ? "text-white" : "text-[#ff4d2d]"
                        }
                      />
                      {isOutForDelivery ? "Live Track" : "Track Order"}
                    </button>
                  )}

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                      shopOrder.status,
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${getStatusDot(shopOrder.status)}`}
                    />
                    {shopOrder.status?.replace("-", " ").toUpperCase() ||
                      "PENDING"}
                  </span>
                </div>
              </div>

              {!isCancelled && (
               <div className="flex items-center justify-between w-full relative">
  <div className="absolute top-1.5 left-0 w-full h-0.5 bg-gray-200 rounded-full" />
  <div
    className="absolute top-1.5 left-0 h-0.5 bg-[#ff4d2d] transition-all duration-500 rounded-full"
    style={{
      width: `${(currentStep / (steps.length - 1)) * 100}%`,
    }}
  />
  {steps.map((step, i) => {
    const active = i <= currentStep;
    return (
      <div
        key={i}
        className="flex flex-col items-center group relative z-10"
      >
        <div
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            active
              ? "bg-[#ff4d2d] border-[#ff4d2d] scale-125"
              : "bg-white border-gray-300"
          }`}
        />
        <span
          className={`absolute top-5 text-[10px] font-medium whitespace-nowrap transition-colors duration-300 ${
            active ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {step}
        </span>
      </div>
    );
  })}
</div>
              )}

              <div className="mt-8 space-y-3">
                {shopOrder.shopOrderItems?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          🍽️
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900 truncate pr-4">
                          {item.name}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.quantity} x ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end items-center gap-3">
                <span className="text-xs text-gray-500">Subtotal</span>
                <span className="text-sm font-bold text-gray-900">
                  ₹{shopOrder.subtotal?.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrderCard;
