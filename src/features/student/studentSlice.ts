
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStudentDashboard } from "./studentThunks";
import { StudentData, StudentState } from "./StudentModel";


const initialState: StudentState = {
  status: "idle",
  error: null,
  StudentData: {} as StudentData,
};


const StudentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudentDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStudentDashboard.fulfilled, (state, action: PayloadAction<StudentData>) => {
        state.status = "succeeded";
        state.StudentData = action.payload;
      })
      .addCase(getStudentDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.error.message || "Something went wrong";
      });
  },
});

export default StudentSlice.reducer;
