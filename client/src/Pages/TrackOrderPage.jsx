import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useParams } from "react-router-dom";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking"; 

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/get-order-by-id/${orderId}`,
          { withCredentials: true }
        );
        setOrder(res.data.order);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="bg-white shadow-md rounded-xl w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          🧾 Order Tracking
        </h2>

        <div className="mb-4 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>
          <p>
            <span className="font-semibold">Payment Method:</span>{" "}
            {order.paymentMethod}
          </p>
          <p>
            <span className="font-semibold">Total Amount:</span> ₹
            {order.totalAmount}
          </p>
          <p>
            <span className="font-semibold">Delivery Address:</span>{" "}
            {order.address?.text}
          </p>
        </div>

        <hr className="my-4" />

        {order.shopOrders?.map((shopOrder, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-200"
          >
            <p className="font-semibold text-gray-800">
              🏪 Shop: {shopOrder.shop?.name || "N/A"}
            </p>

            <div className="mt-2">
              <h4 className="font-medium text-gray-700 mb-1">🛍️ Items:</h4>
              {shopOrder.shopOrderItems?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm border-b border-gray-200 py-1"
                >
                  <p>{item.name}</p>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm">
              <p>
                <span className="font-semibold">Delivery Boy:</span>{" "}
                {shopOrder.assignedDeliveryBoy?.fullName || "Not Assigned"}
              </p>
              <p>
                <span className="font-semibold">Contact:</span>{" "}
                {shopOrder.assignedDeliveryBoy?.mobile || "N/A"}
              </p>
            </div>

           
            {shopOrder.assignedDeliveryBoy && (
              <div className="mt-4">
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation: {
                      lat: shopOrder.assignedDeliveryBoy.location
                        ?.coordinates?.[1],
                      lng: shopOrder.assignedDeliveryBoy.location
                        ?.coordinates?.[0], 
                    },
                    deliveryAddress: {
                      
                      latitude: order.address?.latitude,
                      longitude: order.address?.longitude,
                    },
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrderPage;
