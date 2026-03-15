import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MdArrowBack,
  MdDeliveryDining,
  MdAttachMoney,
  MdTrendingUp,
  MdAccessTime,
} from "react-icons/md";
import { FaBox, FaRupeeSign, FaMotorcycle } from "react-icons/fa";
import CommonNav from "../components/CommonNav";

const DeliveryBoyDashboardPage = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/delivery-analytics`,
        { withCredentials: true }
      );
      setAnalytics(res.data.analytics);
      setDeliveryHistory(res.data.deliveryHistory);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <MdArrowBack className="text-xl" />
            <span className="font-medium">Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Delivery Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your performance and earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaRupeeSign className="text-green-600 text-xl" />
              </div>
              <MdTrendingUp className="text-green-500 text-2xl" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ₹{analytics?.totalEarnings || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-blue-600 text-xl" />
              </div>
              <MdDeliveryDining className="text-blue-500 text-2xl" />
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Total Deliveries
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {analytics?.totalDeliveries || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MdAttachMoney className="text-orange-600 text-2xl" />
              </div>
              <MdAccessTime className="text-orange-500 text-2xl" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Today's Earnings</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ₹{analytics?.todayEarnings || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaMotorcycle className="text-purple-600 text-xl" />
              </div>
              <MdAccessTime className="text-purple-500 text-2xl" />
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Today's Deliveries
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {analytics?.todayDeliveries || 0}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Deliveries Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              24-Hour Delivery Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.hourlyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="deliveries"
                  fill="#3b82f6"
                  name="Deliveries"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              24-Hour Earnings Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.hourlyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Earnings (₹)"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Delivery History
          </h3>

          {deliveryHistory.length === 0 ? (
            <div className="text-center py-12">
              <FaBox className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">No delivery history yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Shop
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Items
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Subtotal
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Earnings
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Delivered At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map((delivery) => (
                    <tr
                      key={delivery._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-gray-900">
                          #{delivery.orderId.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {delivery.shopName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {delivery.customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {delivery.customerMobile}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">
                          {delivery.items} items
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{delivery.subtotal}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-green-600">
                          ₹{delivery.deliveryFee}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs text-gray-500">
                          {formatDate(delivery.deliveredAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboardPage;