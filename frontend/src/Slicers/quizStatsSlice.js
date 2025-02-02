import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/axios';

export const fetchQuizStats = createAsyncThunk(
  'quizStats/fetchStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth; // Changed from getToken to token
      const response = await api.get('/quiz-stats', {
        headers: {
          Authorization: `Bearer ${token}` // Simplified token access
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
);

export const updateQuizStats = createAsyncThunk(
  'quizStats/updateStats',
  async ({ correctAnswers, totalQuestions }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/quiz-stats/update', {
        correctAnswers,
        totalQuestions
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const quizStatsSlice = createSlice({
  name: 'quizStats',
  initialState: {
    attempts: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizStats.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchQuizStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateQuizStats.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
  }
});

export default quizStatsSlice.reducer; 