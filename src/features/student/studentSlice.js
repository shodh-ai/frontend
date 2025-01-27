import { createSlice } from "@reduxjs/toolkit";
import { getStudentDashboard } from "./studentThunks";

const StudentSlice = createSlice({
    name:"student",
    initialState:{
        status:"idle",
        error:null,
        StudentData:[],
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getStudentDashboard.pending , (state)=>{
            state.status = "loading";
        })
        .addCase(getStudentDashboard.fulfilled, (state, action)=>{
            state.status = "succeeded";
            state.StudentData = action.payload;
        })
        .addCase(getStudentDashboard.rejected, (state,action)=>{
            state.status = "failed";
            state.error = action.error.message;
        });
    }
});

export default StudentSlice.reducer;