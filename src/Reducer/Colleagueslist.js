import { createSlice } from "@reduxjs/toolkit";
import { GetChooseUsEn, GetChooseUsRu, GetChooseUsTj } from "../Api/ChooseUs";
import { GetColleaguesEn, GetColleaguesRu, GetColleaguesTj } from "../Api/Colleagues";

const initialState = {
    colleaguesTj: [],
    colleaguesRu: [],
    colleaguesEn: [],
  loading: false
};

export const ColleaguesSlicer = createSlice({
  name: "ColleaguesSlicer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetColleaguesTj.fulfilled, (state, action) => {
      state.colleaguesTj = action.payload;
      state.loading = false;
    });
    builder.addCase(GetColleaguesRu.fulfilled, (state, action) => {
      state.colleaguesRu = action.payload;
      state.loading = false;
    });
    builder.addCase(GetColleaguesEn.fulfilled, (state, action) => {
      state.colleaguesEn = action.payload;
      state.loading = false;
    });
  },
});

export default ColleaguesSlicer.reducer;