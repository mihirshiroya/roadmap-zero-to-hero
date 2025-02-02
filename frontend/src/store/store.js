import { configureStore } from '@reduxjs/toolkit';
import roadmapReducer from '../Slicers/roadmapSlice';
import quizStatsReducer from '../Slicers/quizStatsSlice';
import authReducer from '../Slicers/authSlice';

export const store = configureStore({
  reducer: {
    roadmaps: roadmapReducer,
    quizStats: quizStatsReducer,
    auth: authReducer,
    // ... other reducers
  },
});
