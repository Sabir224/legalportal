import { createSlice } from '@reduxjs/toolkit';

const screenSlice = createSlice({
  name: 'screen',
  initialState: {
    value: 0,
    clientEmail: '',
    Caseinfo: null,
  },
  reducers: {
    screenChange: (state, action) => {
      state.value = action.payload; // Update the state with the new value
    },
    clientEmail: (state, action) => {
      state.clientEmail = action.payload; // Update the state with the new value
    }, Caseinfo: (state, action) => {
      state.Caseinfo = action.payload; // Update the state with the new value
    },
  },
});
export const { screenChange, clientEmail, Caseinfo } = screenSlice.actions;
export default screenSlice.reducer;
