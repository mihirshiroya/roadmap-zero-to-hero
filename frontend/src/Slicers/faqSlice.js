import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/axios';

export const fetchFAQs = createAsyncThunk(
  'faq/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/faqs');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch FAQs');
    }
  }
);

const faqSlice = createSlice({
  name: 'faq',
  initialState: {
    faqTopics: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqTopics = action.payload;
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default faqSlice.reducer;
