import axios from "axios";
import react, { useEffect } from "react";
import { serverUrl } from "../App";
import { setMyOrders } from "../Redux/user.slice";
import { useDispatch, useSelector } from "react-redux";
function useGetMyOrders() {
  const {userData} =  useSelector((state) => state.user)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOrders = async () => {
      
      try {
        const result = await axios.get(`${serverUrl}/api/order/get-orders`, {
          withCredentials: true,
        });
       
        dispatch(setMyOrders(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, [userData]);
}

export default useGetMyOrders;
