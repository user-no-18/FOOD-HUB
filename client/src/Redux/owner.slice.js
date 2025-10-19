import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    shopData: null,
  },
  reducers: {
    setShopData: (state, action) => {
      state.shopData = action.payload;
    },
  },
});
export const { setShopData } = ownerSlice.actions;
export default ownerSlice.reducer;
