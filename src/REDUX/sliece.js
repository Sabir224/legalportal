// screenSlice.js
import { createSlice } from '@reduxjs/toolkit';

const screenSlice = createSlice({
  name: 'screen',
  initialState: {
    value: 0, // current screen
    clientEmail: '',
    Caseinfo: null,
    FormCDetails: null,
    FormHDetails: null,
    LitigationFormH: null,
    CloseType: '',
    history: [], // screen history stack
    adminWidgetState: {
      // Add admin widget state
      selectedChat: null,
      showCaseSheet: false,
      isProfile: true,
      adminData: null,
      profilePicBase64: null,
      selectedRole: null,
      editableFields: false,
      showLFA: false, // Add this
      selectedCase: null, // Add this to store the case for LFA
      navigationLevel: 1, // 1=Profile, 2=CaseSheet, 3=LFA
    },
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
        console.log('🔄 Redux: Going back from screen', state.value, 'to screen', state.value);
      }
    },
    clientEmail: (state, action) => {
      state.clientEmail = action.payload;
    },
    Caseinfo: (state, action) => {
      state.Caseinfo = action.payload;
    },
    FormCDetails: (state, action) => {
      state.FormCDetails = action.payload;
    },
    FormHDetails: (state, action) => {
      state.FormHDetails = action.payload;
    },
    LitigationFormH: (state, action) => {
      state.LitigationFormH = action.payload;
    },
    setCaseOpen: (state, action) => {
      state.isCaseOpen = !!action.payload;
    },
    CloseType: (state, action) => {
      state.CloseType = action.payload;
    },
    // New reducers for admin widget state
    setAdminWidgetState: (state, action) => {
      state.adminWidgetState = { ...state.adminWidgetState, ...action.payload };
    },
    setSelectedChat: (state, action) => {
      state.adminWidgetState.selectedChat = action.payload;
    },
    setShowCaseSheet: (state, action) => {
      state.adminWidgetState.showCaseSheet = action.payload;
    },
    resetAdminWidget: (state) => {
      state.adminWidgetState = {
        selectedChat: null,
        showCaseSheet: false,
        isProfile: true,
        adminData: null,
        profilePicBase64: null,
        selectedRole: null,
        editableFields: false,
      };
    },
  },
});

export const {
  screenChange,
  setCaseOpen,
  goBackScreen,
  clientEmail,
  FormCDetails,
  FormHDetails,
  LitigationFormH,
  Caseinfo,
  CloseType,
  setAdminWidgetState,
  setSelectedChat,
  setShowCaseSheet,
  resetAdminWidget,
} = screenSlice.actions;
export default screenSlice.reducer;
