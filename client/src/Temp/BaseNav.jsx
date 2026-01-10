import React, { useState } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

const ModernNavbar = () => {
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock data - replace with your Redux state
  const [cartItemsCount] = useState(3); // Replace with actual cart count from Redux
  const [isLoggedIn] = useState(false); // Replace with userData from Redux
  const [userName] = useState("John"); // Replace with userData.fullName

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* NAVBAR CONTAINER - White background with shadow */}
      <nav className="relative z-50 w-full bg-white shadow-md">
        {/* Main Navbar Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* LEFT SECTION - Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center group">
                <div className="relative">
                  {/* Logo Circle Background */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  {/* Decorative Ring */}
                  <div className="absolute inset-0 w-12 h-12 border-2 border-orange-400 rounded-full animate-ping opacity-20"></div>
                </div>
                {/* Logo Text */}
                <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  foco
                </span>
              </a>
            </div>

            {/* CENTER SECTION - Navigation Links (Desktop Only) */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="/" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <a 
                href="/menu" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 relative group"
              >
                Menu
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <a 
                href="/restaurants" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 relative group"
              >
                Restaurants
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <a 
                href="/about" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <a 
                href="/contact" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* RIGHT SECTION - Icons & Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Search Icon Button */}
              <button 
                className="p-2.5 rounded-full hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all duration-200 hover:shadow-md"
                aria-label="Search"
              >
                <Search size={22} strokeWidth={2} />
              </button>

              {/* Cart Icon with Badge */}
              <button 
                className="relative p-2.5 rounded-full hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all duration-200 hover:shadow-md"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} strokeWidth={2} />
                {/* Red Notification Badge */}
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Conditional Rendering: Show Sign In/Login OR User Profile */}
              {!isLoggedIn ? (
                <>
                  {/* Sign In Button - Outlined */}
                  <button className="px-5 py-2.5 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-all duration-200 hover:shadow-md hover:scale-105">
                    Sign In
                  </button>

                  {/* Login Button - Filled */}
                  <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105">
                    Login
                  </button>
                </>
              ) : (
                /* User Profile Button */
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-full hover:border-orange-500 hover:shadow-md transition-all duration-200">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0)}
                  </div>
                  {/* User Name */}
                  <span className="font-medium text-gray-700">{userName}</span>
                </button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Cart Icon */}
              <button 
                className="relative p-2 rounded-full hover:bg-orange-50 text-gray-700"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-3xl border-t border-gray-100 z-40">
            <div className="px-4 py-6 space-y-4">
              
              {/* Mobile Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search food, restaurants..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Mobile Navigation Links */}
              <a href="/" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg font-medium transition-colors">
                Home
              </a>
              <a href="/menu" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg font-medium transition-colors">
                Menu
              </a>
              <a href="/restaurants" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg font-medium transition-colors">
                Restaurants
              </a>
              <a href="/about" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg font-medium transition-colors">
                About
              </a>
              <a href="/contact" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg font-medium transition-colors">
                Contact
              </a>

              {/* Mobile Auth Buttons */}
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <button className="w-full px-5 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-colors">
                    Sign In
                  </button>
                  <button className="w-full px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transition-all">
                    Login
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userName}</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION - This demonstrates the navbar is NOT hiding content */}
      <div className="relative pt-12 pb-20 overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0 -z-10">
          {/* Large Orange Circle - Top Right */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-red-400/20 rounded-full blur-3xl"></div>
          
          {/* Medium Red Circle - Bottom Left */}
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-red-400/30 to-orange-400/20 rounded-full blur-3xl"></div>
          
          {/* Small Yellow Circle - Top Left */}
          <div className="absolute top-40 left-20 w-48 h-48 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
              Delicious Food,
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Delivered Fast
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Order from your favorite restaurants and get it delivered to your doorstep in minutes
            </p>

            <div className="flex justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-200 hover:scale-105">
                Order Now
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-orange-500 hover:shadow-lg transition-all duration-200">
                Browse Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernNavbar;