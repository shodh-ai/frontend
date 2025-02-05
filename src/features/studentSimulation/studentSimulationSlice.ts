
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startSimulationStudent, submitSimulationStudent } from "./studentSimulationThunks";
import { SimulationResponse } from "@/src/models/studentSimulationModels/SimulationModel";
import { DecisionResponse } from "@/src/models/studentSimulationModels/SubmitSimulation";



interface SimulationState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  SimulationStartData: SimulationResponse | null;
  SimulationSubmitData: DecisionResponse | null;
  
}

const initialState: SimulationState = {
  status: "idle",
  error: null,
  SimulationStartData:null,
  SimulationSubmitData:null,
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
      })
      .addCase(submitSimulationStudent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitSimulationStudent.fulfilled, (state, action: PayloadAction<DecisionResponse>) => {
        state.status = "succeeded";
        state.SimulationSubmitData = action.payload;
        if (state.SimulationStartData) {
          state.SimulationStartData.metrics = action.payload.state.current_metrics;
        
      }
      console.log("sagar", state.SimulationStartData?.metrics);
      })
      .addCase(submitSimulationStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.error.message || "Something went wrong";
      });
  },
});

export default StudentSimulationSlice.reducer;
