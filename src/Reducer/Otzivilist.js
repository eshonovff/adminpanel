import { createSlice } from "@reduxjs/toolkit";
import { GetOtzivi, getVideoReview } from "../Api/Otziviapi";

const initialState = {
    data:[],
    videoReview:[],
    
  };


  export const OtziviSlicer = createSlice({
    name: "OtziviSlicer",
    initialState,
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder.addCase(GetOtzivi.fulfilled, (state, action) => {
        state.data = action.payload;
      });
      builder.addCase(getVideoReview.fulfilled, (state, action) => {
        state.videoReview = action.payload;
      });
  
    },
  });
  export default OtziviSlicer.reducer; 