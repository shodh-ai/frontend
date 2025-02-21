import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../features/student/studentSlice";
import studentSimulationReducer from "../features/studentSimulation/studentSimulationSlice";
import StudentDoubtReducer from "../features/StudentDoubts/DoubtSlice";
import authReducer from "../features/auth/authSlice";
import studentTeachingReducer from "../features/studentTeaching/studentTeachingSlice";
const rootReducer = combineReducers({
  student: studentReducer,
  studentSimulation: studentSimulationReducer,
  StudentDoubt: StudentDoubtReducer,
  auth:authReducer,
  studentTeaching:studentTeachingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
