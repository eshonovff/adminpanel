import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';

export const GetColleaguesTj = createAsyncThunk(
  "ColleaguesSlicer/GetColleaguesTj", 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Colleague/colleagueWithIcons?language=Tj");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти ҳамкорон: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetColleaguesRu = createAsyncThunk(
  "ColleaguesSlicer/GetColleaguesRu",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Colleague/colleagueWithIcons?language=Ru");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти ҳамкорон: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetColleaguesEn = createAsyncThunk(
  "ColleaguesSlicer/GetColleaguesEn", 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Colleague/colleagueWithIcons?language=En");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти ҳамкорон: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteColleagues = createAsyncThunk(
  "ColleaguesSlicer/DeleteColleagues",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.delete(`api/Colleague?id=${id}`);
      toast.success("Ҳамкор бомуваффақият нест карда шуд!");
      dispatch(GetColleaguesTj());
      dispatch(GetColleaguesRu());
      dispatch(GetColleaguesEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нест кардани ҳамкор: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PutColleagues = createAsyncThunk(
  "ColleaguesSlicer/PutColleagues",
  async (putColleagues, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.put(`api/Colleague`, putColleagues);
      toast.success("Маълумоти ҳамкор бомуваффақият нав карда шуд!");
      dispatch(GetColleaguesTj());
      dispatch(GetColleaguesRu());
      dispatch(GetColleaguesEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нав кардани маълумоти ҳамкор: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PostColleagues = createAsyncThunk(
  "ColleaguesSlicer/PostColleagues",
  async (Colleagues, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post(`api/Colleague`, Colleagues);
      toast.success("Ҳамкор бомуваффақият илова карда шуд!");
      dispatch(GetColleaguesTj());
      dispatch(GetColleaguesRu());
      dispatch(GetColleaguesEn());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми илова кардани ҳамкор: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);