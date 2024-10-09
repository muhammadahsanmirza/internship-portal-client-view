import { createSlice } from '@reduxjs/toolkit';

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

// Selector to get user details (role and context)
export const selectUserDetails = (state) => ({
  role: state.user.role,
  context: state.user.context,
});

export default userSlice.reducer;
