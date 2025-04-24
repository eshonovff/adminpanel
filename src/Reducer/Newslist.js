import { createSlice } from "@reduxjs/toolkit";
import { GetNewsEn, GetNewsRu, GetNewsTj } from "../Api/NewsApi";



const initialState = {
    newsTj: [],
    newsRu: [],
    newsEn: [],
  loading: false
};

export const NewsSlicer = createSlice({
  name: "NewsSlicer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetNewsTj.fulfilled, (state, action) => {
      state.newsTj = action.payload;
      state.loading = false;
    });
    builder.addCase(GetNewsRu.fulfilled, (state, action) => {
      state.newsRu = action.payload;
      state.loading = false;
    });
    builder.addCase(GetNewsEn.fulfilled, (state, action) => {
      state.newsEn = action.payload;
      state.loading = false;
    });
  },
});

export default NewsSlicer.reducer;