import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { MdTrendingUp, MdHistory, MdAttachMoney, MdDeliveryDining } from "react-icons/md";

const DeliveryboyDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch assignments/orders for delivery boy
        const { data } = await axios.get(`${serverUrl}/order/get-delivery-boy-assignments`, {
            headers: { Authorization: localStorage.getItem("token") },
        });
        
        if (data.orders) {
            setHistory(data.orders);
            processStats(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch delivery history", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "delivery") {
      fetchHistory();
    }
  }, [user]);

  const processStats = (orders) => {
    const dailyStats = {};
    
    orders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyStats[date]) {
            dailyStats[date] = { name: date, orders: 0, earnings: 0 };
        }
        dailyStats[date].orders += 1;
        // Assuming a fixed delivery fee or percentage, or extracting it from order if available
        // Here simplified as 50 per order for visualization if not present
        dailyStats[date].earnings += order.deliveryFee || 50; 
    });

    // Convert to array and sort (logic can be improved for correct day ordering)
    setStats(Object.values(dailyStats));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <CommonNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MdDeliveryDining className="text-[#ff4d2d]" />
            Delivery Dashboard
        </h1>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Delivered</h3>
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MdHistory /></span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{history.filter(o => o.status === 'delivered').length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
                    <span className="p-2 bg-green-50 text-green-600 rounded-lg"><MdAttachMoney /></span>
                </div>
                {/* Mock calculation based on orders */}
                <p className="text-3xl font-bold text-gray-900">₹{history.filter(o => o.status === 'delivered').length * 50}</p> 
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                    <span className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MdTrendingUp /></span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{history.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Analysis</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                cursor={{fill: '#f9fafb'}}
                            />
                            <Legend wrapperStyle={{paddingTop: '20px'}} />
                            <Bar dataKey="orders" name="Orders" fill="#ff4d2d" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="earnings" name="Earnings (₹)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent List Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[30rem] overflow-hidden flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent History</h3>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-center text-gray-500 py-10">Loading...</p>
                    ) : history.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No orders found.</p>
                    ) : (
                        <div className="space-y-4">
                            {history.slice(0, 10).map((order) => (
                                <div key={order._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{formatDate(order.createdAt)}</span>
                                        <span className="font-semibold text-gray-700">₹{order.totalAmount?.toFixed(0)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryboyDashboard;