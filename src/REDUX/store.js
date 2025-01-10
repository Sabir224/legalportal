import { configureStore } from '@reduxjs/toolkit';
import screenReducer from './sliece'; // Import the reducer

const store = configureStore({
  reducer: {
    screen: screenReducer, // Use the correct slice name
  },
});

export default store;
