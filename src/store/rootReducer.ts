import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../features/student/studentSlice";
import StudentDoubtReducer from "../features/StudentDoubts/DoubtSlice"
const rootReducer = combineReducers({
  student:studentReducer,
  StudentDoubt:StudentDoubtReducer
  
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
