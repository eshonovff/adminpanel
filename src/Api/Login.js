import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import { destroyToken, saveToken } from "../Utils/token";
import toast from 'react-hot-toast';

export const Login = createAsyncThunk(
  "LoginSlice/Login",
  async ({ login, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post(
        `api/Account/login`,
        login,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.statusCode === 200) {
        saveToken(data.data); 
        toast.success("Успешная авторизация!");
        navigate("/"); 
      }

      return data.data; 
    } catch (error) {
      toast.error("Ошибка авторизации: " + (error.response?.data?.message || "Неверный логин или пароль"));
      console.error("Ошибка при входе:", error.message);
      return rejectWithValue(error.data?.data || "Ошибка авторизации");
    }
  }
);

export const LogOut = (navigate) => {
  try {
    destroyToken();
    toast.success("Вы успешно вышли из системы");
    navigate("/admin");
  } catch (error) {
    toast.error("Ошибка при выходе: " + error.message);
    console.log(error.message);
  }
};