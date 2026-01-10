import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { motion } from "framer-motion";
import { 
  MdArrowBack, 
  MdPayment, 
  MdLocationOn, 
  MdStorefront, 
  MdPerson, 
  MdPhone, 
  MdReceipt,
  MdAccessTime
} from "react-icons/md";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/get-order-by-id/${orderId}`,
          { withCredentials: true }
        );
        setOrder(res.data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) return <div className="text-center mt-20">Order not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* --- Top Navigation Bar --- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            <MdArrowBack className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                Processing
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {order._id}</p>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="text-lg font-bold text-slate-900">₹{order.totalAmount?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* --- Main Dashboard Content --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Order Summary (Sticky on Desktop) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                <MdReceipt className="text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Summary</h2>
              </div>
              
              <div className="p-5 space-y-6">
                {/* Address */}
                <div className="flex gap-3">
                  <div className="mt-1 min-w-[24px]">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <MdLocationOn />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Delivery Location</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {order.address?.text || "No address provided"}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Payment */}
                <div className="flex gap-3">
                  <div className="mt-1 min-w-[24px]">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <MdPayment />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Payment Method</p>
                    <p className="text-sm font-medium text-slate-700">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Mobile Total (Visible only on mobile if hidden in header) */}
                <div className="sm:hidden pt-4 border-t border-slate-100">
                   <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">Total</span>
                      <span className="text-xl font-bold text-slate-900">₹{order.totalAmount}</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Shop Orders & Live Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {order.shopOrders?.map((shopOrder, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
              >
                {/* Shop Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <MdStorefront className="text-xl text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{shopOrder.shop?.name || "Unknown Shop"}</h3>
                      <p className="text-xs text-slate-500">Order Segment #{index + 1}</p>
                    </div>
                  </div>
                  {shopOrder.assignedDeliveryBoy ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      On the way
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      Preparing
                    </span>
                  )}
                </div>

                {/* Content Grid */}
                <div className="p-6 grid gap-6">
                  
                  {/* Items List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                      {shopOrder.shopOrderItems?.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            <span className="text-slate-700 font-medium">{item.name}</span>
                          </div>
                          <span className="text-slate-900 font-semibold">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Partner Card */}
                  {shopOrder.assignedDeliveryBoy && (
                     <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <MdPerson className="text-2xl text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Delivery Partner</p>
                            <p className="font-bold text-slate-800">{shopOrder.assignedDeliveryBoy.fullName}</p>
                          </div>
                        </div>
                        {shopOrder.assignedDeliveryBoy.mobile && (
                          <a 
                            href={`tel:${shopOrder.assignedDeliveryBoy.mobile}`}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                          >
                            <MdPhone />
                            {shopOrder.assignedDeliveryBoy.mobile}
                          </a>
                        )}
                     </div>
                  )}

                  {/* Live Map */}
                  {shopOrder.assignedDeliveryBoy && (
                    <div className="relative w-full h-80 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                      <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-white/90 backdrop-blur rounded-md shadow-sm text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1">
                        <MdAccessTime className="text-orange-500"/> Live Tracking
                      </div>
                      <DeliveryBoyTracking
                        data={{
                          deliveryBoyLocation: {
                            lat: shopOrder.assignedDeliveryBoy.location?.coordinates?.[1],
                            lng: shopOrder.assignedDeliveryBoy.location?.coordinates?.[0],
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
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackOrderPage;