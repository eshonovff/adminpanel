import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';

//  get with pagination
export const GetOtzivi = createAsyncThunk(
  "OtziviSlicer/GetOtzivi",
  async (params = { pageSize: 100, pageIndex: 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get(
        `/api/Feedback?language=Tj&pageSize=${params.pageSize}&pageIndex=${params.pageIndex}`
      );
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти тақризҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//    delete Otzivi
export const DeleteOtzivi = createAsyncThunk(
  "OtziviSlicer/DeleteOtzivi",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axiosRequest.delete(`api/Feedback/${id}`);
      toast.success("Тақриз бомуваффақият нест карда шуд!");
      dispatch(GetOtzivi());
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нест кардани тақриз: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  adit
export const EditOtzivi = createAsyncThunk(
  "OtziviSlicer/EditOtzivi",
  async (Otziv, { dispatch, rejectWithValue }) => {
    console.log(Otziv);

    const form = new FormData();
    form.append("id", Otziv.id);
    form.append("textTj", Otziv.textTj);
    form.append("textRu", Otziv.textRu);
    form.append("textEn", Otziv.textEn);
    form.append("grade", Otziv.grade);
    form.append("approved", Otziv.approved);
    try {
      const { data } = await axiosRequest.put(`api/Feedback/id`, Otziv);
      toast.success("Маълумоти тақриз бомуваффақият нав карда шуд!");
      dispatch(GetOtzivi());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нав кардани маълумоти тақриз: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  get video review
export const getVideoReview = createAsyncThunk(
  "OtziviSlicer/getVideoReview",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/VideoReview?language=Tj");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани тақризҳои видеоӣ: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  delete video review
export const DeleteVideoReview = createAsyncThunk(
  "OtziviSlicer/DeleteVideoReview",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axiosRequest.delete(`api/VideoReview?id=${id}`);
      toast.success("Тақризи видеоӣ бомуваффақият нест карда шуд!");
      dispatch(getVideoReview());
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нест кардани тақризи видеоӣ: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  add video review
export const postVideoReview = createAsyncThunk(
  "OtziviSlicer/postVideoReview",
  async (addVideo, { dispatch, rejectWithValue }) => {
    console.log(addVideo);

    try {
      const { data } = await axiosRequest.post(`api/VideoReview`, addVideo);
      toast.success("Тақризи видеоӣ бомуваффақият илова карда шуд!");
      dispatch(getVideoReview());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми илова кардани тақризи видеоӣ: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);