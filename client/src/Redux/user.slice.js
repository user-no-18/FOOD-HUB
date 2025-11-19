import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    address: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    refreshCounter: 0,
    cartItems: [],
    totalAmount: 0,
    myOrders:[],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    
    triggerItemsRefresh: (state) => {
      state.refreshCounter += 1;
    },
    addToCartItems: (state, action) => {
      const cartItem = action.payload;
      const existing = state.cartItems.find((i) => i.id === cartItem.id);
      if (existing) {
        existing.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    deleteFromCartItems: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.id !== id);
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existing = state.cartItems.find((i) => i.id === id);
      if (existing) {
        existing.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    clearCart: (state) => {
  state.cartItems = [];
  state.totalAmount = 0;
},

  },
});
export const {
  setUserData,
  setCity,
  setState,
  setAddress,
  setShopInMyCity,
  setItemsInMyCity,
  triggerItemsRefresh,
  addToCartItems,
  updateCartItemQuantity,
  deleteFromCartItems,
  setMyOrders,
  clearCart,
} = userSlice.actions;
export default userSlice.reducer;
