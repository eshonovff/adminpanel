import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';

//  get Banner
export const GetBannerTj = createAsyncThunk(
  "BannerSlicer/GetBannerTj",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Banner?language=Tj");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани баннер: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetBannerRu = createAsyncThunk(
  "BannerSlicer/GetBannerRu",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Banner?language=Ru");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани баннер: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetBannerEn = createAsyncThunk(
  "BannerSlicer/GetBannerEn",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Banner?language=En");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани баннер: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//    delete banner
export const DeleteBanner = createAsyncThunk(
  "BannerSlicer/DeleteBanner",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.delete(`api/Banner/${id}`);
      toast.success("Баннер успешно удален!");
      dispatch(GetBannerTj());
      dispatch(GetBannerRu());
      dispatch(GetBannerEn());
      return data.data;
    } catch (error) {
      toast.error("Ошибка при удалении баннера: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//    post banner
export const PostBanner = createAsyncThunk(
  "BannerSlicer/PostBanner",
  async (banner, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post(`api/Banner`, banner);
      toast.success("Баннер успешно добавлен!");
      dispatch(GetBannerTj());
      dispatch(GetBannerRu());
      dispatch(GetBannerEn());
      return data.data;
    } catch (error) {
      toast.error("Ошибка при добавлении баннера: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// put banner 
export const PutBanner = createAsyncThunk(
  "BannerSlicer/PutBanner",
  async (putbanner, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.put(`api/Banner`, putbanner);
      toast.success("Баннер успешно обновлен!");
      dispatch(GetBannerTj());
      dispatch(GetBannerRu());
      dispatch(GetBannerEn());
      return data.data;
    } catch (error) {
      toast.error("Ошибка при обновлении баннера: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);