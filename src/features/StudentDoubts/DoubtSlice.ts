import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { submitDoubt, askDoubt } from './DoubtThunk'; 
import { DoubtResponse, AskDoubtResponse } from "@/src/models/DoubtModel"; 


interface DoubtState {
  submitDoubt: {
    loading: boolean;
    data?: DoubtResponse;
    error?: string;
  };
  askDoubt: {
    loading: boolean;
    data?: AskDoubtResponse;
    error?: string;
  };
}

const initialState: DoubtState = {
  submitDoubt: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  askDoubt: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const DoubtSlice = createSlice({
  name: 'StudentDoubt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  
    builder
      .addCase(submitDoubt.pending, (state) => {
        state.submitDoubt.loading = true;
        state.submitDoubt.error = undefined;
      })
      .addCase(submitDoubt.fulfilled, (state, action: PayloadAction<DoubtResponse>) => {
        state.submitDoubt.loading = false;
        state.submitDoubt.data = action.payload;
        state.submitDoubt.error = undefined;
      })
      .addCase(submitDoubt.rejected, (state, action) => {
        state.submitDoubt.loading = false;
        state.submitDoubt.error = action.payload as string;
      });

   
    builder
      .addCase(askDoubt.pending, (state) => {
        state.askDoubt.loading = true;
        state.askDoubt.error = undefined;
      })
      .addCase(askDoubt.fulfilled, (state, action: PayloadAction<AskDoubtResponse>) => {
        state.askDoubt.loading = false;
        state.askDoubt.data = action.payload;
        state.askDoubt.error = undefined;
      })
      .addCase(askDoubt.rejected, (state, action) => {
        state.askDoubt.loading = false;
        state.askDoubt.error = action.payload as string;
      });
  },
});

export default DoubtSlice.reducer;
