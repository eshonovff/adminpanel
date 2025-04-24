import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';

export const GetChooseUsTj = createAsyncThunk(
  "ChooseSlicer/GetChooseUsTj",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/ChooseUs?language=Tj");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумот: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetChooseUsRu = createAsyncThunk(
  "ChooseSlicer/GetChooseUsRu",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/ChooseUs?language=Ru");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумот: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetChooseUsEn = createAsyncThunk(
  "ChooseSlicer/GetChooseUsEn",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/ChooseUs?language=En");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумот: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteChooseUs = createAsyncThunk(
  "ChooseSlicer/DeleteChooseUs",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.delete(`api/ChooseUs/${id}`);
      toast.success("Элемент успешно удален!");
      dispatch(GetChooseUsTj());
      dispatch(GetChooseUsRu());
      dispatch(GetChooseUsEn());
      return data.data;
    } catch (error) {
      toast.error("Ошибка при удалении: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PutChooseUs = createAsyncThunk(
  "ChooseSlicer/PutChooseUs",
  async (putchoose, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.put(`api/ChooseUs/`, putchoose);
      toast.success("Данные успешно обновлены!");
      dispatch(GetChooseUsTj());
      dispatch(GetChooseUsRu());
      dispatch(GetChooseUsEn());
      return data.data;
    } catch (error) {
      toast.error("Ошибка при обновлении: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PostChooseUs = createAsyncThunk(
  "ChooseSlicer/PostChooseUs",
  async (choose, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post(`api/ChooseUs`, choose);
      toast.success("Элемент успешно добавлен!");
      dispatch(GetChooseUsTj());
      dispatch(GetChooseUsRu());
      dispatch(GetChooseUsEn());
      return data.data;
    } catch (error) {
      toast.error("Ошибка при добавлении: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);