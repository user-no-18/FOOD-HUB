import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice";
import ownerReducer from "./owner.slice";
import mapSlice from "./map.slice";
const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerReducer,
    map: mapSlice,
  },
});

export default store;
