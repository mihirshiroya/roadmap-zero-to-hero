import { createSlice } from '@reduxjs/toolkit';
import { useAuth } from '@clerk/clerk-react';

const initialState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    }
  }
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer; 