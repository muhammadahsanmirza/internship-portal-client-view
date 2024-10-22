import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import { loadState, saveState } from '../../utils/localstorage';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: persistedState, // Set the initial state from localStorage
});

// Subscribe to store updates and save state to localStorage
store.subscribe(() => {
  saveState({
    user: store.getState().user, // Save only the user slice, you can add others if needed
  });
});
