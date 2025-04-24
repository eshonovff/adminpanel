import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import toast from 'react-hot-toast';

//  get request
export const GetZayavki = createAsyncThunk(
  "ZayavkiSlicer/GetZayavki",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get("api/Request");
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ дар гирифтани маълумоти дархостҳо: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  delete request
export const DeleteRequest = createAsyncThunk(
  "ZayavkiSlicer/DeleteRequest",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.delete(`api/Request/${id}`);
      toast.success("Дархост бомуваффақият нест карда шуд!");
      dispatch(GetZayavki());
      return data.data;
    } catch (error) {
      toast.error("Хатогӣ ҳангоми нест кардани дархост: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  aproved 
export const ApprovedRequest = createAsyncThunk(
  "ZayavkiSlicer/ApprovedRequest",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axiosRequest.post(`/api/Request/add-to-approved/${id}`);
      toast.success("Дархост бомуваффақият тасдиқ карда шуд!");
      dispatch(GetZayavki());
    } catch (error) {
      toast.error("Хатогӣ ҳангоми тасдиқи дархост: " + (error.response?.data?.message || error.message));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);