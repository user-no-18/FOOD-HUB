import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice";
import ownerReducer from "./owner.slice";
const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerReducer,
  },
});

export default store;
