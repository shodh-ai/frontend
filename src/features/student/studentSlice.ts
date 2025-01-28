
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStudentDashboard , getStudentAllLeadershipScore } from "./studentThunks";
import { SemesterScore } from "../../models/StudentModel";
import { LeaderShipScoreAll } from "@/src/models/LeadershipModel";


interface StudentState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  SemesterScoreData: SemesterScore[] | null;
  LeaderShipScoreData: LeaderShipScoreAll[]; // Updated type to match the array structure
}

const initialState: StudentState = {
  status: "idle",
  error: null,
  SemesterScoreData: [],
  LeaderShipScoreData: [], // Initialize as an empty array
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
      .addCase(getStudentDashboard.fulfilled, (state, action: PayloadAction<SemesterScore[]>) => {
        state.status = "succeeded";
        state.SemesterScoreData = action.payload;
      })
      .addCase(getStudentDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.error.message || "Something went wrong";
      })
      .addCase(getStudentAllLeadershipScore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStudentAllLeadershipScore.fulfilled, (state, action: PayloadAction<LeaderShipScoreAll[]>) => {
        state.status = "succeeded";
        state.LeaderShipScoreData = action.payload;
      })
      .addCase(getStudentAllLeadershipScore.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.error.message || "Something went wrong";
      });
  },
});

export default StudentSlice.reducer;
