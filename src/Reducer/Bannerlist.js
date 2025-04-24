import { createSlice } from "@reduxjs/toolkit";
import { GetBannerEn, GetBannerRu, GetBannerTj } from "../Api/Bannerapi";

const initialState = {
  bannerTj: [],
  bannerRu: [],
  bannerEn: [],
};

export const BannerSlicer = createSlice({
  name: "BannerSlicer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetBannerTj.fulfilled, (state, action) => {
      state.bannerTj = action.payload;
    });
    builder.addCase(GetBannerRu.fulfilled, (state, action) => {
      state.bannerRu = action.payload;
    });
    builder.addCase(GetBannerEn.fulfilled, (state, action) => {
      state.bannerEn = action.payload;
    });
  },
});

export default BannerSlicer.reducer;
