import React, { useEffect, useState } from "react";
import { FaStore, FaPhoneAlt } from "react-icons/fa";
import { MdDeliveryDining, MdPayment, MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import socket from "../socket";
import { updateOrderStatus } from "../Redux/user.slice";
import RatingRequestModal from "./RatingRequestModal";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [deliveredItems, setDeliveredItems] = useState([]);

  useEffect(() => {
    const handleOrderUpdate = (updateData) => {
      if (updateData.orderId === data._id) {
        dispatch(
          updateOrderStatus({
            orderId: updateData.orderId,
            shopId: updateData.shopId,
            status: updateData.status,
            shopOrder: updateData.shopOrder,
          })
        );

        if (Notification.permission === "granted") {
          new Notification("Order Status Updated", {
            body: `Your order is now ${updateData.status}`,
            icon: "/vite.svg",
          });
        }
      }
    };

    const handleOrderDelivered = (deliveryData) => {
      if (deliveryData.orderId === data._id) {
        const shopOrder = data.shopOrders?.find(
          (so) => so.shop._id === deliveryData.shopId
        );

        if (shopOrder && shopOrder.shopOrderItems) {
          const items = shopOrder.shopOrderItems.map((item) => ({
            _id: item.item?._id || item.item,
            name: item.name,
            image: item.image,
          }));

          setDeliveredItems(items);
          setTimeout(() => setShowRatingModal(true), 2000);
        }

        if (Notification.permission === "granted") {
          new Notification("🎉 Order Delivered!", {
            body: "Please rate your experience",
            icon: "/vite.svg",
          });
        }
      }
    };

    socket.on("update-order", handleOrderUpdate);
    socket.on("order-delivered", handleOrderDelivered);

    return () => {
      socket.off("update-order", handleOrderUpdate);
      socket.off("order-delivered", handleOrderDelivered);
    };
  }, [data._id, data.shopOrders, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      ready: "bg-teal-100 text-teal-800 border-teal-300",
      "out-for-delivery": "bg-orange-100 text-orange-800 border-orange-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return map[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusDot = (status) => {
    const map = {
      pending: "bg-yellow-400",
      confirmed: "bg-blue-400",
      preparing: "bg-purple-400",
      ready: "bg-teal-400",
      "out-for-delivery": "bg-orange-400",
      delivered: "bg-green-400",
      cancelled: "bg-red-400",
    };
    return map[status?.toLowerCase()] || "bg-gray-400";
  };

  const getStatusStep = (status) => {
    const steps = ["pending", "confirmed", "preparing", "out-for-delivery", "delivered"];
    return steps.indexOf(status);
  };

  const steps = ["Placed", "Confirmed", "Preparing", "On the way", "Delivered"];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-5 hover:shadow-lg transition-shadow duration-300">
        <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] px-5 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-80">Order ID</p>
              <p className="text-base font-bold tracking-wide">
                #{data._id.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs opacity-75 mt-0.5 flex items-center gap-1">
                <MdDeliveryDining className="text-sm" />
                {formatDate(data.createdAt)}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1.5 justify-end">
                <MdPayment className="text-sm opacity-80" />
                <p className="text-xs font-medium opacity-90">
                  {data.paymentMethod?.toUpperCase()}
                </p>
              </div>
              <p className="text-lg font-bold">₹{data.totalAmount?.toFixed(2)}</p>
              <p className="text-xs opacity-75">
                {data.shopOrders?.length} shop{data.shopOrders?.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {data.shopOrders?.map((shopOrder, shopIndex) => {
            const currentStep = getStatusStep(shopOrder.status);
            const isDelivered = shopOrder.status === "delivered";
            const isCancelled = shopOrder.status === "cancelled";
            const isOutForDelivery = shopOrder.status === "out-for-delivery";

            return (
              <div key={shopIndex} className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <FaStore className="text-[#ff4d2d] text-sm" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {shopOrder.shop?.name || "Shop"}
                      </p>
                      {shopOrder.owner?.mobile && (
                        <a
                          href={`tel:${shopOrder.owner.mobile}`}
                          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition mt-0.5"
                        >
                          <FaPhoneAlt className="text-[10px]" />
                          {shopOrder.owner.mobile}
                        </a>
                      )}
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      shopOrder.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${getStatusDot(shopOrder.status)}`}
                    />
                    {shopOrder.status?.replace("-", " ").toUpperCase() || "PENDING"}
                  </span>
                </div>

                {!isCancelled && (
                  <div className="flex items-center gap-0 w-full">
                    {steps.map((step, i) => {
                      const active = i <= currentStep;
                      const isLast = i === steps.length - 1;
                      return (
                        <React.Fragment key={i}>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                                active
                                  ? "bg-[#ff4d2d] text-white shadow-md shadow-orange-200"
                                  : "bg-gray-100 text-gray-400 border border-gray-200"
                              }`}
                            >
                              {active ? "✓" : i + 1}
                            </div>
                            <p
                              className={`text-[9px] mt-1 font-medium text-center leading-tight ${
                                active ? "text-[#ff4d2d]" : "text-gray-400"
                              }`}
                              style={{ width: 42 }}
                            >
                              {step}
                            </p>
                          </div>
                          {!isLast && (
                            <div
                              className={`h-0.5 flex-1 mx-0.5 mb-3 rounded-full transition-all duration-300 ${
                                i < currentStep ? "bg-[#ff4d2d]" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-2">
                  {shopOrder.shopOrderItems?.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">🍽️</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-bold text-[#ff4d2d] text-sm flex-shrink-0">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-1">
                  <p className="text-xs text-gray-500">
                    Subtotal for {shopOrder.shop?.name}
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    ₹{shopOrder.subtotal?.toFixed(2)}
                  </p>
                </div>

                <div>
                  {isDelivered ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                      <p className="text-green-700 font-semibold text-sm">
                        ✓ Delivered from {shopOrder.shop?.name}
                      </p>
                      <p className="text-green-600 text-xs mt-0.5">
                        Thank you for your order!
                      </p>
                    </div>
                  ) : isCancelled ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                      <p className="text-red-700 font-semibold text-sm">
                        ✗ Cancelled — {shopOrder.shop?.name}
                      </p>
                      <p className="text-red-500 text-xs mt-0.5">
                        This shop order was cancelled
                      </p>
                    </div>
                  ) : isOutForDelivery ? (
                    <button
                      onClick={() => navigate(`/track-order/${data._id}`)}
                      className="w-full bg-[#ff4d2d] hover:bg-[#ff3814] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg text-sm"
                    >
                      <MdLocationOn className="text-base" />
                      Live Track — {shopOrder.shop?.name}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/track-order/${data._id}`)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm"
                    >
                      <MdLocationOn className="text-base text-[#ff4d2d]" />
                      Track Order — {shopOrder.shop?.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex justify-between items-center">
          <p className="text-sm text-gray-500 font-medium">Grand Total</p>
          <p className="text-lg font-extrabold text-gray-900">
            ₹{data.totalAmount?.toFixed(2)}
          </p>
        </div>
      </div>

      {showRatingModal && deliveredItems.length > 0 && (
        <RatingRequestModal
          items={deliveredItems}
          orderId={data._id}
          onClose={() => setShowRatingModal(false)}
          onRatingComplete={() => {
            console.log("All ratings completed");
          }}
        />
      )}
    </>
  );
};

export default UserOrderCard;