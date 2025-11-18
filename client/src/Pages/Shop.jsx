import React from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useEffect } from "react";
import axios from "axios";

const Shop = () => {
    const { shopId } = useParams();
  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true }
      );
       console.log(result.data)
    } catch (error) {
 console.log(error)
    }
  };

  useEffect(()=>{
    handleShop()
  },[shopId])
  return <div>visibkle</div>;
};

export default Shop;
