import { createSlice } from "@reduxjs/toolkit";

import { GetGallery } from "../Api/GalleryApi";

const initialState = {
    gallery: [],
  
  loading: false
};

export const GallerySlicer = createSlice({
  name: "GallerySlicer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetGallery.fulfilled, (state, action) => {
      state.gallery = action.payload;
      state.loading = false;
    });

  },
});

export default GallerySlicer.reducer;