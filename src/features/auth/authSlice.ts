import { UserDataInterface } from "@/src/models/authModel";
import { createSlice } from "@reduxjs/toolkit";
import { loginwithPassword } from "./auththunks";
interface authState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isLoggedIn: boolean;
  userData: UserDataInterface | null;
}

const initialState: authState = {
  status: "idle",
  error: null,
  isLoggedIn: false,
  userData:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("student") ?? "{}")
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload.userData;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    setLogout: (state) => {
      state.userData = initialState.userData;
      state.isLoggedIn = false;
      localStorage.removeItem("student");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginwithPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginwithPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(loginwithPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});
export const { setUser, setLogout } = authSlice.actions;
export default authSlice.reducer;
