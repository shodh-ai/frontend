import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../features/student/studentSlice";
import studentSimulationReducer from "../features/studentSimulation/studentSimulationSlice";
import StudentDoubtReducer from "../features/StudentDoubts/DoubtSlice";
import authReducer from "../features/auth/authSlice";
const rootReducer = combineReducers({
  student: studentReducer,
  studentSimulation: studentSimulationReducer,
  StudentDoubt: StudentDoubtReducer,
  auth:authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
