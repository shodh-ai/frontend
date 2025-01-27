import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPoints } from "../../services/apiUrls";

const baseUrl = process.env.NEXT_PUBLIC_SHODH_BASE_URL;

interface GetStudentDashboardParams {
  student_id: number;
}


interface ErrorMessage{
  error:string,
}


const {GET_STUDENT_DASHBOARD} = endPoints.student;

export const getStudentDashboard = createAsyncThunk< ErrorMessage,GetStudentDashboardParams>(
  "student/getStudentDashboard",
  async ({student_id}: GetStudentDashboardParams , thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}${GET_STUDENT_DASHBOARD}/${student_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        return thunkAPI.rejectWithValue(parsedResponse.message);
      }

      const {data} = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
