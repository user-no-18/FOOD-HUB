import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
name:'user',
initialState:{
    userData:null,
    city:null,
    state:null,
    address:null
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
    }
}

})
export const {setUserData,setCity,setState,setAddress}=userSlice.actions
export default userSlice.reducer