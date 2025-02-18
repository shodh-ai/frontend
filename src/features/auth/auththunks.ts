import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPoints } from "@/src/services/apiUrls";
import Cookies from "js-cookie"
import { LoginWithPasswordRequestBody, LoginWithPasswordResponse } from "@/src/models/authModel";
import { setUser } from "./authSlice";

const baseUrl = process.env.NEXT_PUBLIC_SHODH_BACKEND_URL;
const {LOGIN_WITH_EMAIL_PASSWORD} = endPoints.auth;

export const loginwithPassword = createAsyncThunk<
  LoginWithPasswordResponse,
   LoginWithPasswordRequestBody
>(
  "auth/loginwithPassword",
  async (requestBody, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}${LOGIN_WITH_EMAIL_PASSWORD}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        return thunkAPI.rejectWithValue({ error: parsedResponse.message });
      }

    //   const data = await response.json();
      const {token, data:{userDetails}} = await response.json();

      thunkAPI.dispatch(setUser({
        userData:userDetails,
        isLoggedIn:true,
      }));

      if(typeof window !== "undefined"){
        Cookies.set('token', JSON.stringify(token), {expires:7})
      }

      localStorage.setItem('student', JSON.stringify(userDetails));
      return userDetails;
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || "An unexpected error occurred";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);