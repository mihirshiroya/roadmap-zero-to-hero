import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/axios';

export const fetchTimelineData = createAsyncThunk(
  'analytics/fetchTimeline',
  async (roadmapId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get(`/progress/timeline?roadmapId=${roadmapId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch timeline data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCompletionHistory = createAsyncThunk(
  'analytics/fetchCompletionHistory',
  async (roadmapId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get(
        `/progress/history${roadmapId ? `?roadmapId=${roadmapId}` : ''}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Fetch error');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    timelineData: [],
    completionHistory: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimelineData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimelineData.fulfilled, (state, action) => {
        state.loading = false;
        state.timelineData = action.payload;
      })
      .addCase(fetchTimelineData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompletionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.completionHistory = action.payload;
      })
      .addCase(fetchCompletionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default analyticsSlice.reducer;
