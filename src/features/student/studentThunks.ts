import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPoints } from "../../services/apiUrls";
import { StudentData } from "./StudentModel"; // Import the StudentData type
import { GetStudentDashboardParams, ErrorMessage } from './StudentModel'; // Import other types

const baseUrl = process.env.NEXT_PUBLIC_SHODH_BASE_URL;

const { GET_STUDENT_DASHBOARD } = endPoints.student;

export const getStudentDashboard = createAsyncThunk<
  StudentData, 
  GetStudentDashboardParams, 
  { rejectValue: ErrorMessage } 
>(
  "student/getStudentDashboard",
  async ({ student_id }: GetStudentDashboardParams, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}${GET_STUDENT_DASHBOARD}/${student_id}`, {
        method: "GET",
        headers: {
          "Content-Type":"application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        return thunkAPI.rejectWithValue({ error: parsedResponse.message });
      }

      const { data } = await response.json();
      return data; // The data should match the StudentData interface
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || "An unexpected error occurred";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);
