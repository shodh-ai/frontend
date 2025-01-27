import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../features/student/studentSlice";
const rootReducer = combineReducers({
  // ... add the slice reducers here
  student:studentReducer,
  
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
