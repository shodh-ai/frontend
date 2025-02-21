import { KnowledgeDataApiResponse, TopicData } from "@/src/models/studentTeachingModel/KnowledgeGraphData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getKnowledegeGrpahData } from "./studentTeachingThunks";
interface StudentTeachingState{
    status: "idle" | "loading" | "succeeded" | "failed";
    error:string | null;
    TopicsData: TopicData[] | null;
}

const initialState : StudentTeachingState = {
    status:"idle",
    error:null,
    TopicsData: null,
}
const StudentTeachingSlice = createSlice({
    name:"studentTeaching",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getKnowledegeGrpahData.pending, (state)=>{
            state.status ="loading";
        })
        .addCase(getKnowledegeGrpahData.fulfilled, (state, action: PayloadAction<KnowledgeDataApiResponse>)=>{
            state.status = "succeeded";
            state.TopicsData = action.payload.data;
        })
        .addCase(getKnowledegeGrpahData.rejected, (state, action)=>{
            state.status = "failed";
            state.error= action.error.message || "Something went wrong";
        })
    }
})

export default StudentTeachingSlice.reducer;