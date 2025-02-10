import { createAsyncThunk } from "@reduxjs/toolkit";
import { SimulationResponse } from "@/src/models/studentSimulationModels/SimulationModel";
import { ErrorMessage } from "../../models/StudentModel";
import { endPoints } from "@/src/services/apiUrls";
import {
  DecisionResponse,
  SubmitSimulationRequest,
} from "@/src/models/studentSimulationModels/SubmitSimulation";
import {
  DecisioSimulationResponse,
  HandleDecisionSimulationRequest,
  HandleSpecificDecisionSimulationRequest,
} from "@/src/models/studentSimulationModels/SimulationDecisionModel";
const baseUrl = process.env.NEXT_PUBLIC_SHODH_BASE_URL;

const { HANDLE_DECISION_SIMULATION, START_SIMULATION, SUBMIT_SIMULATION } =
  endPoints.studentSimulation;

export const startSimulationStudent = createAsyncThunk<
  SimulationResponse,
  void,
  { rejectValue: ErrorMessage }
>("studentSimulation/startSimulationStudent", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${baseUrl}${START_SIMULATION}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
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
});

export const submitSimulationStudent = createAsyncThunk<
  DecisionResponse,
  SubmitSimulationRequest,
  { rejectValue: ErrorMessage }
>(
  "studentSimulation/submitSimulationStudent",
  async (requestBody, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}${SUBMIT_SIMULATION}`, {
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

export const handleSimulationDecision = createAsyncThunk<
  DecisioSimulationResponse,
  HandleDecisionSimulationRequest | HandleSpecificDecisionSimulationRequest,
  { rejectValue: ErrorMessage }
>(
  "studentSimulation/handleSimulationDecision",
  async (requestBody, thunkAPI) => {
    try {
      let finalRequestBody: HandleDecisionSimulationRequest | HandleSpecificDecisionSimulationRequest;

      if (requestBody.action === "discuss_specific") {
        finalRequestBody = requestBody as HandleSpecificDecisionSimulationRequest;
      } else {
        finalRequestBody = requestBody;
      }

      const response = await fetch(`${baseUrl}${HANDLE_DECISION_SIMULATION}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(finalRequestBody),
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
