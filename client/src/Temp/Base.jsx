import React, { useState } from "react";
import { ShoppingBag, Star, Clock } from "lucide-react";

const FoodHeroSection = () => {
  // Quantity state for order selector
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 24.30;

  // Quantity handlers
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Calculate total price
  const totalPrice = (quantity * pricePerItem).toFixed(2);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-white">
      
      {/* BACKGROUND CURVED SHAPE - Dark Gray Dashboard */}
      <div className="absolute top-0 right-0 w-1/2 h-full z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          style={{
            clipPath: "ellipse(80% 100% at 100% 50%)",
            borderRadius: "0 0 0 200px"
          }}
        ></div>
        
        {/* Decorative Circles on Dark Background */}
        <div className="absolute top-20 right-40 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* TWO-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN - Text Content & Order Section */}
          <div className="space-y-8 animate-fadeIn">
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Order your
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  favourite
                </span>
                <br />
                Foods
              </h1>
              
              {/* Subtext Paragraph */}
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Discover delicious meals from your favorite restaurants. 
                Fast delivery, fresh ingredients, and unforgettable flavors 
                delivered right to your doorstep.
              </p>
            </div>

            {/* ORDER CARD - Price, Quantity, Buy Button */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md border border-gray-100">
              
              {/* Price Display */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Total order</p>
                <p className="text-4xl font-bold text-gray-900">
                  ${totalPrice}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700 font-medium">Quantity</span>
                
                <div className="flex items-center space-x-4 bg-gray-100 rounded-full px-2 py-1">
                  {/* Minus Button */}
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-orange-500 hover:text-white transition-all duration-200 font-bold shadow-sm hover:shadow-md"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  
                  {/* Quantity Display */}
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>
                  
                  {/* Plus Button */}
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-orange-500 hover:text-white transition-all duration-200 font-bold shadow-sm hover:shadow-md"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buy Now Button */}
              <button className="w-full bg-black text-white rounded-full py-4 px-6 flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all duration-200 hover:shadow-xl group">
                <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg">Buy Now</span>
              </button>
            </div>

            {/* MINI FOOD CATEGORY CARDS - Bottom Section */}
            <div className="flex gap-4 pt-4">
              
              {/* Burger Card */}
              <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-2xl">🍔</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 text-center">Burger</p>
                <p className="text-xs text-gray-500 text-center mt-1">125+ items</p>
              </div>

              {/* Cake Card */}
              <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-2xl">🍰</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 text-center">Cake</p>
                <p className="text-xs text-gray-500 text-center mt-1">80+ items</p>
              </div>

              {/* Salad Card */}
              <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-2xl">🥗</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 text-center">Salad</p>
                <p className="text-xs text-gray-500 text-center mt-1">60+ items</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Food Image with Badges */}
          <div className="relative h-[600px] lg:h-[700px] flex items-center justify-center">
            
            {/* Main Food Bowl Image Container */}
            <div className="relative z-20 animate-float">
              
              {/* Food Image - Replace src with your actual image */}
              <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl"></div>
                
                {/* Replace this placeholder with actual food bowl image */}
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"
                  alt="Delicious Food Bowl"
                  className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl"
                />
                
                {/* Decorative Ring Around Food */}
                <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
              </div>

              {/* RATING BADGE - Top Right */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center space-x-2 border border-gray-100 z-30 animate-fadeIn">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="font-bold text-gray-900 text-lg">4.7</span>
              </div>

              {/* DELIVERY TIME BADGE - Bottom Left */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-xl px-5 py-3 flex items-center space-x-2 z-30 animate-fadeIn animation-delay-200">
                <Clock size={20} />
                <span className="font-bold text-lg">10–18 mins</span>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute top-20 right-10 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-32 left-10 w-20 h-20 bg-red-400/20 rounded-full blur-xl animate-pulse animation-delay-500"></div>
          </div>
        </div>
      </div>

      {/* CUSTOM ANIMATIONS CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
};

export default FoodHeroSection;