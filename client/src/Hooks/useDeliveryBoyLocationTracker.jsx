import { useEffect } from 'react';
import socket from '../socket';

/**
 * Hook to send delivery boy location updates to server
 * @param {Object} userData - User data object
 * @param {number} intervalMs - Update interval in milliseconds (default: 5000)
 */
export const useDeliveryBoyLocationTracker = (userData, intervalMs = 5000) => {
  useEffect(() => {
    if (!userData || userData.role !== 'deliveryBoy') {
      return;
    }

    console.log('🚀 Starting location tracker for delivery boy:', userData.fullName);

    let intervalId;
    let lastUpdate = 0;
    const minUpdateInterval = 2000; // Minimum 2 seconds between updates

    const sendLocation = (latitude, longitude) => {
      const now = Date.now();
      
      // Prevent sending updates too frequently
      if (now - lastUpdate < minUpdateInterval) {
        return;
      }
      
      lastUpdate = now;
      
      console.log('📍 Sending location update:', { latitude, longitude });
      
      // Emit location to server
      socket.emit('update-location', {
        userId: userData._id,
        latitude,
        longitude
      });
    };

    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      sendLocation(latitude, longitude);
    };

    const handleError = (error) => {
      // Only log significant errors, ignore timeout errors from periodic checks
      if (error.code === 3) {
        // Timeout - this is normal, just skip this update
        console.log('⏱️ Location update timeout (normal - will retry)');
        return;
      }
      
      console.error('❌ Geolocation error:', error);
      
      if (error.code === 1) {
        console.error('📍 Location permission denied');
      } else if (error.code === 2) {
        console.error('📍 Location unavailable');
      }
    };

    // Single interval-based approach (more reliable than watchPosition)
    if (navigator.geolocation) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        updateLocation,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        }
      );

      // Then update at regular intervals
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          updateLocation,
          handleError,
          {
            enableHighAccuracy: false, // Use false for battery saving
            timeout: 5000,              // Shorter timeout for interval updates
            maximumAge: 3000            // Allow slightly cached positions
          }
        );
      }, intervalMs);
      
      console.log(`✅ Location tracker started (updates every ${intervalMs}ms)`);
    } else {
      console.error('❌ Geolocation not supported by this browser');
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('🛑 Location tracker stopped');
      }
    };
  }, [userData, intervalMs]);
};

export default useDeliveryBoyLocationTracker;