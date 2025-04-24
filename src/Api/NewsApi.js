import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';

export const GetNewsTj = createAsyncThunk(
  "NewsSlicer/GetNewsTj", 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/News?language=Tj");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти хабарҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetNewsRu = createAsyncThunk(
  "NewsSlicer/GetNewsRu",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/News?language=Ru");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти хабарҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetNewsEn = createAsyncThunk(
  "NewsSlicer/GetNewsEn", 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/News?language=En");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти хабарҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteNews = createAsyncThunk(
  "NewsSlicer/DeleteNews",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.delete(`api/News?id=${id}`);
      toast.success("Хабар бомуваффақият нест карда шуд!");
      dispatch(GetNewsTj());
      dispatch(GetNewsRu());
      dispatch(GetNewsEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нест кардани хабар: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PutNews = createAsyncThunk(
  "NewsSlicer/PutNews",
  async (putNews, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.put(`api/News`, putNews);
      toast.success("Маълумоти хабар бомуваффақият нав карда шуд!");
      dispatch(GetNewsTj());
      dispatch(GetNewsRu());
      dispatch(GetNewsEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нав кардани маълумоти хабар: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PostNews = createAsyncThunk(
  "NewsSlicer/PostNews",
  async (News, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post(`api/News`, News);
      toast.success("Хабар бомуваффақият илова карда шуд!");
      dispatch(GetNewsTj());
      dispatch(GetNewsRu());
      dispatch(GetNewsEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми илова кардани хабар: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);