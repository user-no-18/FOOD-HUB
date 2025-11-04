import React, { useEffect } from "react";
import CommonNav from "./CommonNav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

const DeliveryBoyDashboard = () => {
  const { userData, city } = useSelector((state) => state.user);
  const [assignments, setAssignments] = React.useState([]);
  
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
  
  useEffect(() => {
    getAssignments();
  }, [userData]);
  
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

        {/* Available Orders Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Orders</h2>
          
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
                        {assignment.items.length} items | ₹{assignment.subtotal}
                      </p>
                    </div>
                    
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 md:mt-4 rounded-md text-sm transition-colors duration-200 self-start sm:self-auto whitespace-nowrap">
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
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;