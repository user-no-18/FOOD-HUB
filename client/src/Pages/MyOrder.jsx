import React from 'react'
import { useSelector } from 'react-redux'

const MyOrder = () => {
    const {cartItems} = useSelector(state=>state.user)
  return (
    <div>
     
    </div>
  )
}

export default MyOrder
