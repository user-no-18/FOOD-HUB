import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaUtensils, 
  FaPen, 
  FaPlus, 
  FaStore, 
  FaMapMarkerAlt, 
  FaCalendarAlt 
} from "react-icons/fa";
import OwnerItemcard from "./OwnerItemcard";
import CommonNav from "./CommonNav";

const OwnerDashboard = () => {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  // --- Components ---

  const EmptyState = ({ title, description, btnText, onClick, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-gray-200 border-dashed rounded-xl w-full">
      <div className="bg-orange-50 p-4 rounded-full mb-4">
        <Icon className="text-orange-500 w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6 text-sm">{description}</p>
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm text-sm"
      >
        <FaPlus className="text-xs" /> {btnText}
      </button>
    </div>
  );

  const ShopHeaderCard = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        {/* Shop Image */}
        <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100 shrink-0">
          <img
            src={shopData.image || "https://via.placeholder.com/300"}
            alt={shopData.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Shop Content */}
        <div className="p-6  flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {shopData.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <FaMapMarkerAlt className="text-orange-500" />
                  <span>{shopData.address}, {shopData.city}, {shopData.state}</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/editshop")}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              >
                <FaPen className="text-xs" /> Edit Details
              </button>
            </div>
          </div>

          <div className="lg:mt-6 sm:mt-64 flex flex-wrap gap-4 pt-6 border-t border-gray-100 text-xs text-gray-400 ">
            <div className="flex items-center gap-1">
              <FaCalendarAlt /> Created: {new Date(shopData.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt /> Updated: {new Date(shopData.updatedAt).toLocaleDateString()}
            </div>
            {/* Mobile Edit Button */}
            <button
                onClick={() => navigate("/editshop")}
                className="ml-auto sm:hidden text-orange-600 font-medium hover:underline"
            >
              Edit Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* State 1: No Shop Created */}
        {!shopData ? (
          <div className="max-w-2xl mx-auto mt-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaStore className="text-orange-600 w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Setup Your Restaurant</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Join our platform to manage your menu, track orders, and reach new customers. It only takes a few minutes.
              </p>
              <button
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform active:scale-95"
                onClick={() => navigate("/editshop")}
              >
                Create Restaurant Profile
              </button>
            </div>
          </div>
        ) : (
          /* State 2 & 3: Shop Exists */
          <div className="fade-in">
            {/* 1. Header Section */}
            <div className="mb-6">
               <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
            </div>
            
            <ShopHeaderCard />

            {/* 2. Menu Management Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Menu Items</h2>
                <p className="text-sm text-gray-500">Manage your food catalog</p>
              </div>
              
              {shopData.items?.length > 0 && (
                <button
                  onClick={() => navigate("/additem")}
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
                >
                  <FaPlus /> Add New Item
                </button>
              )}
            </div>

            {/* 3. Items Grid Content */}
            {(!shopData.items || shopData.items.length === 0) ? (
              <EmptyState 
                title="Your menu is empty"
                description="Start adding delicious items to your menu so customers can order."
                btnText="Add First Item"
                icon={FaUtensils}
                onClick={() => navigate("/additem")}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shopData.items.map((item) => (
                  // Assuming OwnerItemcard can handle being in a grid cell
                  // Ensure OwnerItemcard has w-full class
                  <div key={item._id} className="w-full"> 
                    <OwnerItemcard data={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;