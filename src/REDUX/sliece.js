import { createSlice } from '@reduxjs/toolkit';

const screenSlice = createSlice({
  name: 'screen',
  initialState: {
    value: 0,
  },
  reducers: {
    screenChange: (state, action) => {
      state.value = action.payload; // Update the state with the new value
    },
  },
});
export const { screenChange } = screenSlice.actions;
export default screenSlice.reducer;
