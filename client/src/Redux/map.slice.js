import { createSlice } from "@reduxjs/toolkit";
import { setAddress } from "./user.slice";

//This redux slice manages the map state, including location coordinates and address.

const mapSlice = createSlice({
  name: "map",
  initialState: {
    location: {
      latitude: null,
      longitude: null,
    },
    mapAddress: null,
  },
  reducers: {
    setMapLocation: (state, action) => {
      state.location.latitude = action.payload.latitude;
      state.location.longitude = action.payload.longitude;
    },
    setMapAddress: (state, action) => {
      state.mapAddress = action.payload;
    }
  },
});
export const { setMapLocation, setMapAddress } = mapSlice.actions;
export default mapSlice.reducer;