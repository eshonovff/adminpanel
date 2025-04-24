import { createSlice } from "@reduxjs/toolkit";

import { GetCourseEn, GetCourseRu, GetCourseTj } from "../Api/CourseApi";

const initialState = {
    courseTj: [],
    courseRu: [],
    courseEn: [],
  loading: false
};

export const CourseSlicer = createSlice({
  name: "CourseSlicer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetCourseTj.fulfilled, (state, action) => {
      state.courseTj = action.payload;
      state.loading = false;
    });
    builder.addCase(GetCourseRu.fulfilled, (state, action) => {
      state.courseRu = action.payload;
      state.loading = false;
    });
    builder.addCase(GetCourseEn.fulfilled, (state, action) => {
      state.courseEn = action.payload;
      state.loading = false;
    });
  },
});

export default CourseSlicer.reducer;