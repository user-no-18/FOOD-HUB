import { useEffect } from 'react';
import socket from '../socket';

/**
 * Hook to send delivery boy location updates to server
 * @param {Object} userData - User data object
 * @param {number} intervalMs - Update interval in milliseconds (default: 5000)
 */
export const useDeliveryBoyLocationTracker = (userData, intervalMs = 5000) => {
  useEffect(() => {
    if (!userData || userData.role !== 'deliveryBoy') return;

    let intervalId;
    let lastUpdate = 0;
    const minUpdateInterval = 2000;

    const sendLocation = (latitude, longitude) => {
      const now = Date.now();
      if (now - lastUpdate < minUpdateInterval) return;
      if (!socket.connected) return; // don't queue up updates while offline
      lastUpdate = now;
      socket.emit('update-location', { userId: userData._id, latitude, longitude });
    };

    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      sendLocation(latitude, longitude);
    };

    const handleError = (error) => {
      if (error.code === 3) return; // timeout — normal, will retry
      console.error('Geolocation error:', error.code, error.message);
    };

    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    // get initial position
    navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    });

    // then poll every intervalMs
    intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 3000,
      });
    }, intervalMs);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userData, intervalMs]);
};

export default useDeliveryBoyLocationTracker;