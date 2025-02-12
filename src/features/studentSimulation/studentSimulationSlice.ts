
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startSimulationStudent, submitSimulationStudent , handleSimulationDecision, handleSimulationDecisionSpecific} from "./studentSimulationThunks";
import { SimulationResponse } from "@/src/models/studentSimulationModels/SimulationModel";
import { DecisionResponse } from "@/src/models/studentSimulationModels/SubmitSimulation";
import { DecisioSimulationResponse } from "@/src/models/studentSimulationModels/SimulationDecisionModel";



interface SimulationState {
  status: "idle" | "loading" | "succeeded" | "failed";
  submitStatus:"idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  SimulationStartData: SimulationResponse | null;
  SimulationSubmitData: DecisionResponse | null;
  SimulationSpecificDecisionResponse : DecisionResponse | null;
  SimulationDecisionResponse: DecisioSimulationResponse | null;
  
}

const initialState: SimulationState = {
  status: "idle",
  submitStatus:"idle",
  error: null,
  SimulationStartData:null,
  SimulationSubmitData:null,
  SimulationSpecificDecisionResponse:null,
  SimulationDecisionResponse: null,
};

const StudentSimulationSlice = createSlice({
  name: "studentSimulation",
  initialState,
  reducers: {
    setSubmitdataRespoonse : (state)=>{
      state.SimulationSubmitData  = null;
    }
  },
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
        state.submitStatus = "loading";
      })
      .addCase(submitSimulationStudent.fulfilled, (state, action: PayloadAction<DecisionResponse>) => {
        state.submitStatus = "succeeded";
        state.SimulationSubmitData = action.payload;
        if (state.SimulationStartData) {
          state.SimulationStartData.metrics = action.payload.metrics;
        
      }
      })
      .addCase(submitSimulationStudent.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error =  action.error.message || "Something went wrong";
      })
      .addCase(handleSimulationDecisionSpecific.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleSimulationDecisionSpecific.fulfilled, (state, action: PayloadAction<DecisionResponse>) => {
        state.status = "succeeded";
        state.SimulationSpecificDecisionResponse = action.payload;
        state.SimulationSubmitData = action.payload;
        if(state.SimulationStartData){
          state.SimulationStartData.metrics = action.payload.metrics;
        }
        
      })
      .addCase(handleSimulationDecisionSpecific.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.error.message || "Something went wrong";
      })
      .addCase(handleSimulationDecision.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleSimulationDecision.fulfilled, (state, action: PayloadAction<DecisioSimulationResponse>) => {
        state.status = "succeeded";
        state.SimulationDecisionResponse = action.payload;
        if(state.SimulationStartData){
          state.SimulationStartData.message = action.payload.message;
          state.SimulationStartData.challenge.department = action.payload.next_challenge.department;
          state.SimulationStartData.challenge.situation = action.payload.next_challenge.situation;
          state.SimulationStartData.metrics = action.payload.metrics;
          // state.SimulationStartData.state.current_week = action.payload.state.current_week;
          state.SimulationStartData.state = action.payload.state;
        }

      })
      .addCase(handleSimulationDecision.rejected, (state, action) => {
        state.status = "failed";
        state.error =  action.error.message || "Something went wrong";
      })
  },
});
export const{setSubmitdataRespoonse} = StudentSimulationSlice.actions;
export default StudentSimulationSlice.reducer;
