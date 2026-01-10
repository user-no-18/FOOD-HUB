import axios from 'axios';
import React from 'react';
import { serverUrl } from '../App';
import { setShopData } from '../Redux/owner.slice';
import { triggerItemsRefresh } from '../Redux/user.slice';
import { FaPen, FaTrashAlt, FaTag, FaCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OwnerItemcard = ({ data }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        // Optional: Add a window.confirm here for safety
        if(!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const result = await axios.delete(
                `${serverUrl}/api/item/delete-item/${data._id}`,
                { withCredentials: true }
            );
            dispatch(setShopData(result.data.shop));
            dispatch(triggerItemsRefresh());
        } catch (error) {
            console.error(error);
        }
    };

    // Helper to determine badge color based on food type
    const isVeg = data.foodType?.toLowerCase() === 'veg';
    const typeColor = isVeg ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';

    return (
        <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full w-full">
            
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img 
                    src={data.image} 
                    alt={data.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Price Tag Overlay */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100">
                    ₹{data.price}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1" title={data.name}>
                        {data.name}
                    </h2>
                </div>

                {/* Tags / Metadata */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {/* Category Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        <FaTag size={10} />
                        {data.category}
                    </span>

                    {/* Food Type Badge (Veg/Non-Veg) */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${typeColor}`}>
                        <FaCircle size={8} />
                        {data.foodType}
                    </span>
                </div>
            </div>

            {/* Action Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                <button 
                    onClick={() => navigate(`/edititem/${data._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-orange-300 hover:text-orange-600 py-2 rounded-lg transition-colors"
                >
                    <FaPen size={12} /> Edit
                </button>
                
                <button 
                    onClick={handleDelete}
                    className="flex items-center justify-center p-2 text-gray-400 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete Item"
                >
                    <FaTrashAlt size={14} />
                </button>
            </div>
        </div>
    );
};

export default OwnerItemcard;