
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startSimulationStudent } from "./studentSimulationThunks";
import { SimulationResponse } from "@/src/models/studentSimulationModels/SimulationModel";



interface SimulationState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  SimulationStartData: SimulationResponse | null;
  
}

const initialState: SimulationState = {
  status: "idle",
  error: null,
  SimulationStartData:null,
};

const StudentSimulationSlice = createSlice({
  name: "studentSimulation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startSimulationStudent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(startSimulationStudent.fulfilled, (state, action: PayloadAction<SimulationResponse>) => {
        state.status = "succeeded";
        state.SimulationStartData = action.payload;
      })
      .addCase(startSimulationStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.error.message || "Something went wrong";
      });
  },
});

export default StudentSimulationSlice.reducer;
