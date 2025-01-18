import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  // ... add the slice reducers here
  
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
