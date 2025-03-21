import { KnowledgeDataApiResponse, TopicData } from "@/src/models/studentTeachingModel/KnowledgeGraphData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getKnowledegeGrpahData, getTeachingVisualization } from "./studentTeachingThunks";
import { HierarchicalData, TeachingVisualizationResponse} from "@/src/models/studentTeachingModel/TeachingVisualizationData";
import { act } from "react";
interface StudentTeachingState{
    status: "idle" | "loading" | "succeeded" | "failed";
    error:string | null;
    TopicsData: TopicData[] | null;
    TeachingVisualData: HierarchicalData | null;
    CurrentTopicId:number | null;
}

const initialState : StudentTeachingState = {
    status:"idle",
    error:null,
    TopicsData: null,
    TeachingVisualData: null,
    CurrentTopicId:null,
}
const StudentTeachingSlice = createSlice({
    name:"studentTeaching",
    initialState,
    reducers:{
        setTeachingTopic : (state, action)=>{
            state.CurrentTopicId = action.payload.topic_id;
        },
        setCurrentTopicId : (state, action: PayloadAction<number>)=>{
            state.CurrentTopicId = action.payload;
        }
    },
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
        .addCase(getTeachingVisualization.pending, (state)=>{
            state.status ="loading";
        })
        .addCase(getTeachingVisualization.fulfilled, (state, action: PayloadAction<TeachingVisualizationResponse>)=>{
            state.status = "succeeded";
            state.TeachingVisualData = action.payload.data;
        })
        .addCase(getTeachingVisualization.rejected, (state, action)=>{
            state.status = "failed";
            state.error= action.error.message || "Something went wrong";
        })
    }
})

export  const {setTeachingTopic, setCurrentTopicId} = StudentTeachingSlice.actions;

export default StudentTeachingSlice.reducer;