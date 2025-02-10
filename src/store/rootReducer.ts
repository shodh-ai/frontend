import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../features/student/studentSlice";
import studentSimulationReducer from "../features/studentSimulation/studentSimulationSlice"
const rootReducer = combineReducers({
  student:studentReducer,
  studentSimulation:studentSimulationReducer,  
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
