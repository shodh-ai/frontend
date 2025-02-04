import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPoints } from "../../services/apiUrls";
import {
  DoubtRequest,
  DoubtResponse,
  AskDoubtResponse,
  AskDoubtRequest,
} from "../../models/DoubtModel";

const baseUrl = process.env.NEXT_PUBLIC_SHODH_BASE_URL;

const { HANDLE_STUDENTS_DOUBTS, ASK_DOUBT } = endPoints.doubts;

export const submitDoubt = createAsyncThunk<
  DoubtResponse,
  DoubtRequest,
  { rejectValue: string }
>("doubt/submit", async (requestData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}${HANDLE_STUDENTS_DOUBTS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Data:", errorData); // Log the error data
      throw new Error(errorData.message || "Something went wrong");
    }

    const data: DoubtResponse = await response.json();

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to submit doubt");
  }
});

export const askDoubt = createAsyncThunk<
  AskDoubtResponse,
  AskDoubtRequest,
  { rejectValue: string }
>("doubt/ask", async (requestData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}${ASK_DOUBT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    const data: AskDoubtResponse = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to ask doubt");
  }
});
