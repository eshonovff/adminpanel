import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';
    
export const GetCourseTj = createAsyncThunk(
  "CourseSlicer/GetCourseTj", 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Course?language=Tj");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти курсҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetCourseRu = createAsyncThunk(
  "CourseSlicer/GetCourseRu",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Course?language=Ru");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти курсҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetCourseEn = createAsyncThunk(
  "CourseSlicer/GetCourseEn", 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Course?language=En");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти курсҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteCourse = createAsyncThunk(
  "CourseSlicer/DeleteCourse",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.delete(`/api/Course/${id}`);
      toast.success("Курс бомуваффақият нест карда шуд!");
      dispatch(GetCourseTj());
      dispatch(GetCourseRu());
      dispatch(GetCourseEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нест кардани курс: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PutCourse = createAsyncThunk(
  "CourseSlicer/PutCourse",
  async (putCourse, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.put(`api/Course`, putCourse);
      toast.success("Маълумоти курс бомуваффақият нав карда шуд!");
      dispatch(GetCourseTj());
      dispatch(GetCourseRu());
      dispatch(GetCourseEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нав кардани маълумоти курс: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PostCourse = createAsyncThunk(
  "CourseSlicer/PostCourse",
  async (Course, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post(`api/Course`, Course);
      toast.success("Курс бомуваффақият илова карда шуд!");
      dispatch(GetCourseTj());
      dispatch(GetCourseRu());
      dispatch(GetCourseEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми илова кардани курс: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);