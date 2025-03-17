import { configureStore } from "@reduxjs/toolkit";
import screenReducer from "./sliece"; // Import the reducer
import caseReaducer from "./CaseSice";

const store = configureStore({
  reducer: {
    screen: screenReducer, // Use the correct slice name
    cases: caseReaducer,
  },
});

export default store;
