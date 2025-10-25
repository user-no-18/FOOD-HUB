import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { serverUrl } from "../App";
import { setItemsInMyCity } from "../Redux/user.slice";

export default function useGetItemByCity() {
  const dispatch = useDispatch();
  const currentCity = useSelector((state) => state.user.city);
  const refreshCounter = useSelector((state) => state.user.refreshCounter);

  useEffect(() => {
    if (!currentCity) return;

    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true }
        );
        dispatch(setItemsInMyCity(result.data));
        console.log("Items in my city:", result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, [currentCity, refreshCounter, dispatch]); // refreshCounter triggers re-fetch
}