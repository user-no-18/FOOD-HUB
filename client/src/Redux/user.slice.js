import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
name:'user',
initialState:{
    userData:null,
    city:null,
    state:null,
    address:null,
    shopInMyCity:null,
    itemsInMyCity:null,
    refreshCounter: 0 // Add this
},
reducers:{
    setUserData:(state,action)=>{
        state.userData=action.payload
    },
    setCity:(state,action)=>{
        state.city=action.payload
    },
    setState:(state,action)=>{
        state.state=action.payload
    },
    setAddress:(state,action)=>{
        state.address=action.payload
    },
    setShopInMyCity:(state,action)=>{
        state.shopInMyCity=action.payload
    },
    setItemsInMyCity:(state,action)=>{
        state.itemsInMyCity=action.payload
    },
    // Add this action to trigger refresh
    triggerItemsRefresh:(state)=>{
        state.refreshCounter += 1
    }
}

})
export const {setUserData,setCity,setState,setAddress,setShopInMyCity,setItemsInMyCity,triggerItemsRefresh}=userSlice.actions
export default userSlice.reducer