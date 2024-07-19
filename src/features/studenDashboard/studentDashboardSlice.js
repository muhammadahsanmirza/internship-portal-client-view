// studentDashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { currentView: 'Opportunities' };

export const studentViewSlice = createSlice({
  name: 'studentView',
  initialState,
  reducers: {
    setView: (state, action) => {
      state.currentView = action.payload.currentView; // Correctly set the payload
    },
  },
});

export const { setView } = studentViewSlice.actions;
export default studentViewSlice.reducer; // Correct export
