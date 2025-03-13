import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPoints } from "@/src/services/apiUrls";
import Cookies from "js-cookie";
import { KnowledgeDataApiResponse } from "@/src/models/studentTeachingModel/KnowledgeGraphData";
import { TeachingVisualizationResponse } from "@/src/models/studentTeachingModel/TeachingVisualizationData";
import { UpdateTimeStampResponse } from "@/src/models/studentTeachingModel/TimeStampModel";

const baseUrl = process.env.NEXT_PUBLIC_SHODH_BACKEND_URL;
const { GET_ALL_TOPICS_BY_MODULE , GET_TEACHING_VISUALIZATION, UPDATE_TIMESTAMP} = endPoints.studentTeaching;

export const getKnowledegeGrpahData = createAsyncThunk<
  KnowledgeDataApiResponse,
  {moduleId:number, courseId:number}
 
>("studentTeaching/getKnowledegeGrpahData", async ({moduleId, courseId}, thunkAPI) => {
  try {
    const token = JSON.parse(Cookies.get("token") ?? "{}");
    const response = await fetch(`${baseUrl}${GET_ALL_TOPICS_BY_MODULE}?moduleId=${moduleId}&courseId=${courseId}`, {
      method: "GET",
      headers: {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const parsedResponse = await response.json();
      return thunkAPI.rejectWithValue({ error: parsedResponse.message });
    }
    const data  = await response.json();
    return data;
  } catch (error: unknown) {
    const errorMessage =
      (error as Error).message || "An unexpected error occurred";
    return thunkAPI.rejectWithValue({ error: errorMessage });
  }
});


export const getTeachingVisualization = createAsyncThunk<
  TeachingVisualizationResponse,
  {topicId:number}
 
>("studentTeaching/getTeachingVisualization", async ({topicId}, thunkAPI) => {
  try {
    const token = JSON.parse(Cookies.get("token") ?? "{}");
    const response = await fetch(`${baseUrl}${GET_TEACHING_VISUALIZATION}/${topicId}`, {
      method: "GET",
      headers: {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const parsedResponse = await response.json();
      return thunkAPI.rejectWithValue({ error: parsedResponse.message });
    }
    const data  = await response.json();
    return data;
  } catch (error: unknown) {
    const errorMessage =
      (error as Error).message || "An unexpected error occurred";
    return thunkAPI.rejectWithValue({ error: errorMessage });
  }
});



export const updateTimeStamp = createAsyncThunk<
  UpdateTimeStampResponse,
  {studentId:number ,topicId:number, timestamp:number}
 
>("studentTeaching/updateTimeStamp", async ({studentId=2 , topicId=3,timestamp=156}, thunkAPI) => {
  try {
    const token = JSON.parse(Cookies.get("token") ?? "{}");
    const response = await fetch(`${baseUrl}${UPDATE_TIMESTAMP}?studentId=${studentId}&topicId=${topicId}&timestamp=${timestamp}`, {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const parsedResponse = await response.json();
      return thunkAPI.rejectWithValue({ error: parsedResponse.message });
    }
    return response.json();
  } catch (error: unknown) {
    const errorMessage =
      (error as Error).message || "An unexpected error occurred";
    return thunkAPI.rejectWithValue({ error: errorMessage });
  }
});
