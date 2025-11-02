import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace, MdDeliveryDining } from "react-icons/md";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaCrosshairs,
  FaMobileAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setMapAddress, setMapLocation } from "../Redux/map.slice";
import { serverUrl } from "../App";
import axios from "axios";
import { setMyOrders } from "../Redux/user.slice";
const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      map.setView([location.latitude, location.longitude], 16, {
        animate: true,
      });
    }
  }, [location, map]);

  return null;
};
const Checkout = () => {
  const { location, mapAddress } = useSelector((state) => state.map);
  const [addressInput, setAddressInput] = useState("");
  const [method, setMethod] = useState("online");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, myOrders } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0
  );
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;
  const onDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();
    dispatch(
      setMapLocation({ latitude: position.lat, longitude: position.lng })
    );
    getAddressbyLating(position.lat, position.lng);
  };
  const getAddressbyLating = async (latitude, longitude) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${
          import.meta.env.VITE_GEOAPIFY_API_KEY
        }`
      );
      dispatch(setMapAddress(res?.data?.results[0]?.address_line2));
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      dispatch(setMapLocation({ latitude, longitude }));
      getAddressbyLating(latitude, longitude);
    });
  };
  const getLatLngByAddress = async () => {
    try {
      console.log(" calling api :");
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setMapLocation({ latitude: lat, longitude: lon }));
      const addressLine2 =
        result.data?.features?.[0]?.properties?.address_line2 || "";
      dispatch(setMapAddress(addressLine2));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setAddressInput(mapAddress);
  }, [mapAddress]);

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          address: {
            text: addressInput,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          paymentMethod: method,
          cartItems: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image, // ✅ Ensure image is included
            shop: item.shop,
            foodType: item.foodType,
          })),
          subtotal,
        },
        { withCredentials: true }
      );

      dispatch(setMyOrders([...myOrders, res.data]));

      navigate("/order-page");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("Order failed!");
    }
  };
  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <MdKeyboardBackspace className="w-[25px] h-[25px] text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <FaMapMarkerAlt className="text-[#ff4d2d]" /> Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter your delivery address"
            />
            <button
              onClick={getLatLngByAddress}
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center"
            >
              <FaSearch />
            </button>
            <button
              onClick={getCurrentLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
              title="Use my current location"
            >
              <FaCrosshairs />
            </button>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className="h-full w-full"
                center={[
                  location?.latitude || 22.5726,
                  location?.longitude || 88.3639,
                ]}
                zoom={13}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[
                    location?.latitude || 22.5726,
                    location?.longitude || 88.3639,
                  ]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>
        {/* //payment method */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* COD */}
            <button
              type="button"
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                method === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash on Delivery</p>
                <p className="text-xs text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </button>

            {/* UPI + Card */}
            <button
              type="button"
              onClick={() => setMethod("online")}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                method === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileAlt className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPI / Credit / Debit Card
                </p>
                <p className="text-xs text-gray-500">Pay securely online</p>
              </div>
            </button>
          </div>
        </section>
        {/* Order Summary */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Order Summary
          </h2>
          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            {cartItems.map((it) => (
              <div
                key={it.id}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {it.name} × {it.quantity}
                </span>
                <span>₹{(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="border-gray-200 my-2" />
            <div className="flex justify-between font-medium text-gray-800">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </section>
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold"
          // onClick={handlePlaceOrder}
        >
          {method === "cod" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
