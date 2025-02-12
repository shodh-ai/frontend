import { generateQuestionsBody } from "@/src/models/StudentAssessmentModel";
import { createAsyncThunk } from "@reduxjs/toolkit";
const baseUrl = process.env.NEXT_PUBLIC_SHODH_BACKEND_URL;

export const generateQuestions = createAsyncThunk<generateQuestionsBody, void>(
  "studentAssessment/generateQuestions",
  async (requestBody, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const parsedResponse = await response.json();
        return thunkAPI.rejectWithValue({ error: parsedResponse.message });
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || "An unexpected error occurred";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);
