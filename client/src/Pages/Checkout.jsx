import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaMapMarkerAlt, FaSearch, FaCrosshairs } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setMapAddress, setMapLocation } from "../Redux/map.slice";
import axios from 'axios'

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      map.setView([location.latitude, location.longitude], 16, { animate: true });
    }
  }, [location, map]);

  return null;
};

const Checkout = () => {
  const { location, mapAddress } = useSelector((state) => state.map);
  const [addressInput , setAddressInput]  = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const onDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();
    dispatch(setMapLocation({ latitude: position.lat, longitude: position.lng }));
    getAddressbyLating(position.lat, position.lng)
  };
  const getAddressbyLating = async(latitude,longitude)=>{
    try {
      const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)
      dispatch(setMapAddress(res?.data?.results[0]?.address_line2))
      
    } catch (error) {
      console.log(error)
    }
  }
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
     console.log(" calling api :")
        const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)
        const {lat,lon} = result.data.features[0].properties
        dispatch(setMapLocation({latitude:lat,longitude:lon}))
        const addressLine2 = result.data?.features?.[0]?.properties?.address_line2 || "";
dispatch(setMapAddress(addressLine2));
    } catch (error) {
        console.log(error)
    }
}
useEffect(()=>{setAddressInput(mapAddress)},[mapAddress])
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
              onChange={(e)=>setAddressInput(e.target.value)}
              
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter your delivery address"
            />
            <button onClick={getLatLngByAddress}
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center"
            >
              <FaSearch />
            </button>
            <button onClick={getCurrentLocation}
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
                center={[location?.latitude || 22.5726, location?.longitude || 88.3639]}
                zoom={13}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location?.latitude || 22.5726, location?.longitude || 88.3639]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
