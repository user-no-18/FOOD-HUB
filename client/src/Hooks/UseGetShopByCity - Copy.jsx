import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShopInMyCity } from "../Redux/user.slice";
import { serverUrl } from "../App";

export default function useGetShopByCity() {
  const dispatch = useDispatch();
  const currentCity = useSelector((state) => state.user.city);

  useEffect(() => {
    if (!currentCity) return;

    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-shop-by-city/${currentCity}`,
          { withCredentials: true }
        );
        dispatch(setShopInMyCity(result.data));
        console.log("Shops in my city:", result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShop();
  }, [currentCity]);
}
