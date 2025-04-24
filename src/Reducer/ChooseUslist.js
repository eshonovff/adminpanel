import { createSlice } from "@reduxjs/toolkit";
import { GetChooseUsEn, GetChooseUsRu, GetChooseUsTj } from "../Api/ChooseUs";

const initialState = {
  chooseTj: [],
  chooseRu: [],
  chooseEn: [],
  loading: false
};

export const ChooseSlicer = createSlice({
  name: "ChooseSlicer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetChooseUsTj.fulfilled, (state, action) => {
      state.chooseTj = action.payload;
      state.loading = false;
    });
    builder.addCase(GetChooseUsRu.fulfilled, (state, action) => {
      state.chooseRu = action.payload;
      state.loading = false;
    });
    builder.addCase(GetChooseUsEn.fulfilled, (state, action) => {
      state.chooseEn = action.payload;
      state.loading = false;
    });
  },
});

export default ChooseSlicer.reducer;