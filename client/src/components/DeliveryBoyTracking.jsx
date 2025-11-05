import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const DeliveryBoyTracking = ({ data }) => {
  const deliveryBoyLat = data.deliveryBoyLocation?.lat;
  const deliveryBoyLng = data.deliveryBoyLocation?.lng;
  const customerLat = data.deliveryAddress?.latitude;
  const customerLng = data.deliveryAddress?.longitude;
  if (!deliveryBoyLat || !deliveryBoyLng || !customerLat || !customerLng) {
    return (
      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md mt-3 flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">📍 Location data not available</p>
      </div>
    );
  }
  const path = [
    [deliveryBoyLat, deliveryBoyLng],
    [customerLat, customerLng],
  ];

  const center = [
    (deliveryBoyLat + customerLat) / 2,
    (deliveryBoyLng + customerLng) / 2,
  ];
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md mt-3">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[deliveryBoyLat, deliveryBoyLng]}
          icon={deliveryBoyIcon}
        >
          <Popup>Delivery Boy</Popup>
        </Marker>

        <Marker position={[customerLat, customerLng]} icon={customerIcon}>
          <Popup>Your Address</Popup>
        </Marker>

        <Polyline positions={path} />
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
