import axios from "axios";
import react, { useEffect } from "react";
import { serverUrl } from "../App";
import { setShopData } from "../Redux/owner.slice.js";
import { useDispatch } from "react-redux";
function useGetShop() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/my-shop`, {
          withCredentials: true,
        });

        dispatch(setShopData(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShop();
  }, []);
}

export default useGetShop;
