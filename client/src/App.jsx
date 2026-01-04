import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import useGetCurrentUser from "./Hooks/UseGetCurrentUser";
import { useSelector } from "react-redux";
//Backend url 
export const serverUrl = "http://localhost:5000";

import { useNavigate } from "react-router-dom";
import useGetCity from "./Hooks/useGetCity";
import useGetShop from "./Hooks/useGetMyShop";
import CreateEditShop from "./Pages/CreateEditShop";
import AddItem from "./Pages/AddItem";
import EditItem from "./components/EditItem";
import useGetShopByCity from "./Hooks/UseGetShopByCity";
import useGetItemByCity from "./Hooks/UseGetItemsByCity";
import MyOrderCard from "./Pages/MyOrder";
import CartPage from "./Pages/CartPage";
import Checkout from "./Pages/Checkout";
import OrderPage from "./Pages/OrderPage";
import useGetMyOrders from "./Hooks/useGetMyOrders";
import useUpdateLocation from "./Hooks/useUpdateLocation";
import TrackOrderPage from "./Pages/TrackOrderPage";
import Shop from "./Pages/Shop";

const App = () => {
  const { userData } = useSelector((state) => state.user);

  useGetCurrentUser();
  useGetCity();
  useGetShop();
  useGetShopByCity();
  useGetItemByCity();
  useGetMyOrders();
  useUpdateLocation();
  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/editshop"
        element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/additem"
        element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/edititem/:itemId"
        element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrderCard /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/my-carts"
        element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/checkout"
        element={userData ? <Checkout /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/order-page"
        element={userData ? <OrderPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrderPage/> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/shop-items/:shopId"
        element={userData ? <Shop/> : <Navigate to={"/signin"} />}
      />
     
    </Routes>
  );
};

export default App;
