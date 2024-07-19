// store.js
import { configureStore } from '@reduxjs/toolkit';
import studentViewReducer from '../features/studenDashboard/studentDashboardSlice.js';

export const store = configureStore({
  reducer: {
    studentView: studentViewReducer, // Assign the reducer to a key
  },
});
