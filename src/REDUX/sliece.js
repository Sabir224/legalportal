import { createSlice } from "@reduxjs/toolkit";

const screenSlice = createSlice({
  name: "screen",
  initialState: {
    value: 0, // current screen
    clientEmail: "",
    Caseinfo: null,
    history: [], // screen history stack
  },
  reducers: {
    screenChange: (state, action) => {
      if (state.value !== action.payload) {
        state.history.push(state.value); // store current before changing
        state.value = action.payload; // update to new screen
      }
    },
    goBackScreen: (state) => {
      if (state.history.length > 0) {
        state.value = state.history.pop(); // set value to previous screen
      }
    },
    clientEmail: (state, action) => {
      state.clientEmail = action.payload;
    },
    Caseinfo: (state, action) => {
      state.Caseinfo = action.payload;
    },
  },
});

export const { screenChange, goBackScreen, clientEmail, Caseinfo } =
  screenSlice.actions;
export default screenSlice.reducer;
