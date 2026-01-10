import React from 'react'
import FoodHeroSection from './Base'
import ModernNavbar from './BaseNav'

const BaseHome = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Fixed/Absolute Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <ModernNavbar />
      </div>
      
      {/* Hero with top padding to account for navbar */}
      <div className="pt-20">
        <FoodHeroSection />
      </div>
    </div>
  )
}

export default BaseHome