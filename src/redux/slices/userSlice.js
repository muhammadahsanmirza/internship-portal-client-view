import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  role: null,
  context: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.role = action.payload.role;
      state.context = action.payload.context;
    },

    clearUserDetails: (state) => {
      state.role = null;
      state.context = null;
    }
  }, 
});

// Export actions
export const { setUserDetails, clearUserDetails } = userSlice.actions;

const selectUserState = (state) => state.user;

// Memoized selector to get user details (role and context)
export const selectUserDetails = createSelector(
  [selectUserState],
  (user) => ({
    role: user.role,
    context: user.context,
  })
);

export default userSlice.reducer;
