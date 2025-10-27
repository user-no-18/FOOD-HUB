import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setCity, setUserData,setState,setAddress } from '../Redux/user.slice'
import axios from 'axios'
import { setMapAddress, setMapLocation } from '../Redux/map.slice'
function useGetCity() {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      dispatch(setMapLocation({ latitude, longitude }))
      const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)
      dispatch(setCity(res?.data?.results[0]?.city))
      dispatch(setState(res?.data?.results[0]?.state))
      dispatch(setAddress(res?.data?.results[0]?.address_line1||res?.data?.results[0]?.address_line2))
      dispatch(setMapAddress(res?.data?.results[0]?.address_line2))
     
    })
  }, [userData])
}

export default useGetCity