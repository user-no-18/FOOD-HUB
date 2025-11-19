import React from "react";
import { useSelector } from "react-redux";

import DeliveryBoyDashboard from "../components/DeliveryboyDashboard";
import OwnerDashboard from "../components/ownerDashboard";
import UserDashboard from "../components/userDashboard";

function Home() {
  const { userData } = useSelector((state) => state.user);
  return (
    <div className="w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]">
      {userData?.role == "user" && <UserDashboard />}
      {userData?.role == "owner" && <OwnerDashboard />}
      {userData?.role == "deliveryBoy" && <DeliveryBoyDashboard />}
      {/* I need to add home page for no login users */}
    </div>
  );
}

export default Home;
