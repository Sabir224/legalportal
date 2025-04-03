import { createSlice } from '@reduxjs/toolkit';

const trackPath = createSlice({
  name: 'trackPath',
  initialState: {
    value: [],
  },
  reducers: {
    trackPath: (state, action) => {
      state.value = action.payload; // Update the state with the new value
    },
  },
});
export const { trackpath } = trackPath.actions;
export default trackPath.reducer;
