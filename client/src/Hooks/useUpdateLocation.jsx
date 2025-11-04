import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      const result = await axios.post(
        `${serverUrl}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true }
      );
      console.log(result.data);
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      await updateLocation(latitude, longitude);
    });
  }, [userData]);
}

export default useUpdateLocation;
