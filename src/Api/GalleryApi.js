import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';

export const GetGallery = createAsyncThunk(
  "GallerySlicer/GetGallery", 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Gallery");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти галерея: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteGallery = createAsyncThunk(
  "GallerySlicer/DeleteGallery",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.delete(`api/Gallery/${id}`);
      toast.success("Тасвири галерея бомуваффақият нест карда шуд!");
      dispatch(GetGallery());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нест кардани тасвири галерея: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const PostGallery = createAsyncThunk(
  "GallerySlicer/PostGallery",
  async (gallery, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post(`api/Gallery`, gallery);
      toast.success("Тасвири галерея бомуваффақият илова карда шуд!");
      dispatch(GetGallery());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми илова кардани тасвири галерея: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);