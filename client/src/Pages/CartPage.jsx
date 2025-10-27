import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
const CartPage = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-[800px]">
        <div className="flex items-center gap-[20px] mb-6">
          <div className="" onClick={() => navigate("/")}>
            <MdKeyboardBackspace className="w-[25px] h-[25px] text-[#ff4d2d]" />
          </div>
          <h1 className="text-2xl font-bold  text-start">Your Cart</h1>
        </div>
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">
            Your cart is empty.
          </p>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <CartItem data={item} key={index} />
              ))}
            </div>

            {/* Total Amount Section */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow border flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-800">
                Total Amount
              </h1>
              <span className="text-xl font-bold text-[#ff4d2d]">
                ₹{totalAmount}
              </span>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/checkout")}
                className="bg-[#ff4d2d] text-white px-3 py-3 rounded-xl font-semibold hover:bg-orange-600 transition cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
