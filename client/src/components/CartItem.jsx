import React from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteFromCartItems, updateCartItemQuantity } from "../Redux/user.slice";

const CartItem = ({data}) => {
    const dispatch = useDispatch()
    const handleIncrese = (id,quantity) => {
        dispatch(updateCartItemQuantity({id,quantity:quantity+1}))
    }
    const handleDecrease = (id,quantity) => {
        if(quantity===1) return
        dispatch(updateCartItemQuantity({id,quantity:quantity-1}))
    }
    const handleDelete = (id) => {
        dispatch(deleteFromCartItems(id))
        
    }
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt=""
          className="w-20 h-20 object-cover rounded-lg border"
        />

        <div>
          <h1 className="font-medium text-gray-800">{data.name}</h1>

          <p className="text-sm text-gray-500">
            {data.price} x {data.quantity}
          </p>

          
          <p className="font-bold text-gray-900">
            {data.price * data.quantity}
          </p>
        </div>
      </div>
 <div className="flex items-center gap-3">
        {/* Decrease */}
        <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition" onClick={() => handleDecrease(data.id, data.quantity)}>
          <FaMinus size={12} />
        </button>

        {/* Quantity */}
        <span className="font-semibold text-gray-800">{data.quantity}</span>

        {/* Increase */}
        <button className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition" onClick={() => handleIncrese(data.id, data.quantity)}>
          <FaPlus size={12} />
        </button>

        {/* Delete */}
        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => handleDelete(data.id)}>
          <FaTrash size={12} />
        </button>
      </div>
      
    </div>
  );
};

export default CartItem;
