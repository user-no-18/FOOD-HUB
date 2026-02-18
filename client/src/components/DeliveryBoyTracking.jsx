import React, { useEffect, useState } from "react";
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
  useMap,
} from "react-leaflet";
import socket from "../socket";

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

// Component to update map view when delivery boy moves
const UpdateMapView = ({ deliveryBoyPosition }) => {
  const map = useMap();
  
  useEffect(() => {
    if (deliveryBoyPosition.lat && deliveryBoyPosition.lng) {
      // Pan to delivery boy's new position
      map.panTo([deliveryBoyPosition.lat, deliveryBoyPosition.lng], {
        animate: true,
        duration: 1,
      });
    }
  }, [deliveryBoyPosition, map]);
  
  return null;
};

const DeliveryBoyTracking = ({ data }) => {
  // State for real-time delivery boy location
  const [deliveryBoyPosition, setDeliveryBoyPosition] = useState({
    lat: data.deliveryBoyLocation?.lat,
    lng: data.deliveryBoyLocation?.lng,
  });

  const customerLat = data.deliveryAddress?.latitude;
  const customerLng = data.deliveryAddress?.longitude;

  // Listen for real-time location updates from socket
  useEffect(() => {
    console.log('\n🎧 DeliveryBoyTracking Component Mounted');
    console.log('   Socket connected:', socket.connected);
    console.log('   Socket ID:', socket.id);
    console.log('   Initial delivery boy position:', deliveryBoyPosition);
    
    const handleLocationUpdate = (updateData) => {
      console.log('\n📍 ✅ DeliveryBoyTracking received location update!');
      console.log('   Order ID:', updateData.orderId);
      console.log('   New Location:', updateData.location);
      
      // Update delivery boy position
      if (updateData.location) {
        const newPosition = {
          lat: updateData.location.latitude,
          lng: updateData.location.longitude,
        };
        
        setDeliveryBoyPosition(newPosition);
        console.log('✅ Map position updated to:', newPosition);
      }
    };

    // Subscribe to location updates
    socket.on("deliveryboy-location-update", handleLocationUpdate);
    
    console.log('✅ Event listener attached for "deliveryboy-location-update"');

    // Test: Emit a test message to verify socket is working
    socket.emit('test-from-customer', { message: 'Customer is listening!' });

    // Cleanup on unmount
    return () => {
      console.log('🧹 DeliveryBoyTracking: Cleaning up location update listener');
      socket.off("deliveryboy-location-update", handleLocationUpdate);
    };
  }, []);

  if (!deliveryBoyPosition.lat || !deliveryBoyPosition.lng || !customerLat || !customerLng) {
    return (
      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md mt-3 flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500 mb-2">📍 Location data not available</p>
        <p className="text-xs text-gray-400">
          Delivery: {deliveryBoyPosition.lat}, {deliveryBoyPosition.lng}
        </p>
        <p className="text-xs text-gray-400">
          Customer: {customerLat}, {customerLng}
        </p>
      </div>
    );
  }

  const path = [
    [deliveryBoyPosition.lat, deliveryBoyPosition.lng],
    [customerLat, customerLng],
  ];

  const center = [
    (deliveryBoyPosition.lat + customerLat) / 2,
    (deliveryBoyPosition.lng + customerLng) / 2,
  ];

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md mt-3 relative">
      {/* Live indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-gray-700">
          Live Tracking • {deliveryBoyPosition.lat.toFixed(6)}, {deliveryBoyPosition.lng.toFixed(6)}
        </span>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Auto-update map view when delivery boy moves */}
        <UpdateMapView deliveryBoyPosition={deliveryBoyPosition} />

        {/* Delivery Boy Marker */}
        <Marker
          position={[deliveryBoyPosition.lat, deliveryBoyPosition.lng]}
          icon={deliveryBoyIcon}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Delivery Partner</p>
              <p className="text-xs text-gray-600">On the way!</p>
              <p className="text-xs text-gray-400 mt-1">
                {deliveryBoyPosition.lat.toFixed(4)}, {deliveryBoyPosition.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Customer Marker */}
        <Marker position={[customerLat, customerLng]} icon={customerIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Your Address</p>
              <p className="text-xs text-gray-600">Delivery destination</p>
            </div>
          </Popup>
        </Marker>

        {/* Route Line */}
        <Polyline 
          positions={path} 
          color="#FF6B4D"
          weight={3}
          opacity={0.7}
        />
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;