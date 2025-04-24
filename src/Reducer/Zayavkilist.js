import { createSlice } from "@reduxjs/toolkit";
import { GetZayavki } from "../Api/zayavkiapi";


const initialState = {
  data: [],
};

export const ZayavkiSlicer = createSlice({
  name: "ZayavkiSlicer",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(GetZayavki.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  
  },
});
export default ZayavkiSlicer.reducer; 