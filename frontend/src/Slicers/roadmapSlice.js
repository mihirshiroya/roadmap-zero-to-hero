import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';
import { createSelector } from 'reselect';

export const fetchRoadmaps = createAsyncThunk(
  'roadmaps/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/roadmaps');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch roadmaps'
      );
    }
  }
);

export const fetchRoadmapById = createAsyncThunk(
  'roadmaps/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roadmaps/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCheckpointProgress = createAsyncThunk(
  'roadmaps/updateProgress',
  async ({ roadmapId, stepId, checkpointId, completed }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/roadmaps/${roadmapId}/progress`, {
        stepId,
        checkpointId,
        completed
      });
      return { ...response.data, roadmapId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const roadmapsSlice = createSlice({
  name: 'roadmaps',
  initialState: {
    roadmaps: [],
    currentRoadmap: null,
    activeRoadmapId: null,
    loading: false,
    error: null
  },
  reducers: {
    updateProgressOptimistic: (state, action) => {
      const { roadmapId, progress } = action.payload;
      
      // Update current roadmap
      if (state.currentRoadmap?._id === roadmapId) {
        state.currentRoadmap.progress = progress;
      }
      
      // Update roadmaps list
      state.roadmaps = state.roadmaps.map(roadmap => 
        roadmap._id === roadmapId 
          ? { ...roadmap, progress } 
          : roadmap
      );
    },
    setActiveRoadmap: (state, action) => {
      state.activeRoadmapId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmaps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmaps = action.payload;
        state.error = null;
      })
      .addCase(fetchRoadmaps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch roadmaps';
      })
      .addCase(fetchRoadmapById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmapById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoadmap = action.payload;
      })
      .addCase(fetchRoadmapById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch roadmap';
      })
      .addCase(updateCheckpointProgress.fulfilled, (state, action) => {
        const { roadmapId, progress } = action.payload;
        
        state.roadmaps = state.roadmaps.map(roadmap => {
          if (roadmap._id === roadmapId) {
            return {
              ...roadmap,
              progress: {
                ...roadmap.progress,
                completedCount: progress.completedCount,
                completedCheckpoints: progress.completedCheckpoints,
                percentage: Math.round(
                  (progress.completedCount / roadmap.progress.totalCheckpoints) * 100
                )
              }
            };
          }
          return roadmap;
        });

        if (state.currentRoadmap?._id === roadmapId) {
          state.currentRoadmap.progress = {
            ...state.currentRoadmap.progress,
            ...progress,
            percentage: Math.round(
              (progress.completedCount / state.currentRoadmap.progress.totalCheckpoints) * 100
            )
          };
        }
      });
  }
});

export default roadmapsSlice.reducer;

export const selectRoadmapById = createSelector(
  [state => state.roadmaps.roadmaps, (_, id) => id],
  (roadmaps, id) => roadmaps.find(r => r._id === id)
);

export const selectRoadmapProgress = createSelector(
  [selectRoadmapById],
  roadmap => roadmap?.progress || { percentage: 0 }
);

export const { updateProgressOptimistic, setActiveRoadmap } = roadmapsSlice.actions;
