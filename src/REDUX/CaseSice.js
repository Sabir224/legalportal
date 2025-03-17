import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiEndPoint } from "../Main/Pages/Component/utils/utlis";
export const assignCase = createAsyncThunk(
  "cases/assignCase",
  async ({ caseId, users, permissionList }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ApiEndPoint}assign`, {
        caseId,
        users,
        permissionList, // Sending permissions list from frontend
      });

      if (!response.data || !response.data.case) {
        throw new Error("Invalid API response: Missing case data");
      }

      return response.data;
    } catch (error) {
      console.error("Server Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Server error occurred"
      );
    }
  }
);

const caseSlice = createSlice({
  name: "cases",
  initialState: { cases: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignCase.fulfilled, (state, action) => {
        state.loading = false;

        // Check API structure
        const newCase = action.payload?.case || action.payload?.data;

        if (!newCase || !newCase._id) {
          state.error = "Invalid case data received";
          return;
        }

        // Check if case exists and update, otherwise add new case
        const existingIndex = state.cases.findIndex(
          (c) => c._id === newCase._id
        );

        if (existingIndex !== -1) {
          state.cases[existingIndex] = newCase;
        } else {
          state.cases.push(newCase);
        }
      })
      .addCase(assignCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default caseSlice.reducer;
