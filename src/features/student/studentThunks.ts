import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPoints } from "../../services/apiUrls";
import { SemesterScore , GetStudentDashboardParams, ErrorMessage} from "../../models/StudentModel"; 
import { LeaderShipScoreAll } from "@/src/models/LeadershipModel";
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_SHODH_BACKEND_URL;

const { GET_STUDENT_DASHBOARD , GET_ALL_STUDENT_LEADERSHIP_SCORE } = endPoints.student;

const token  = JSON.parse(Cookies.get("token") ?? "{}");

export const getStudentDashboard = createAsyncThunk<
SemesterScore[], 
  GetStudentDashboardParams, 
  { rejectValue: ErrorMessage } 
>(
  "student/getStudentDashboard",
  async ({ student_id }: GetStudentDashboardParams, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}${GET_STUDENT_DASHBOARD}/${student_id}`, {
        method: "GET",
        headers: {
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        return thunkAPI.rejectWithValue({ error: parsedResponse.message });
      }

      const { data  : {semester_score} } = await response.json();
      return semester_score; 
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || "An unexpected error occurred";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);


export const getStudentAllLeadershipScore = createAsyncThunk<
LeaderShipScoreAll[], 
void,
  { rejectValue: ErrorMessage } 
>(
  "student/getStudentAllLeadershipScore",
  async (_, thunkAPI) => {
    try {
      // const token  = JSON.parse(Cookies.get("token") ?? "{}");
      const response = await fetch(`${baseUrl}${GET_ALL_STUDENT_LEADERSHIP_SCORE}`, {
        method: "GET",
        headers: {
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        return thunkAPI.rejectWithValue({ error: parsedResponse.message });
      }

      const { data } = await response.json();
      return data; 
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || "An unexpected error occurred";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);
