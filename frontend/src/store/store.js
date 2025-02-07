import { configureStore } from '@reduxjs/toolkit';
import roadmapReducer from '../Slicers/roadmapSlice';
import quizStatsReducer from '../Slicers/quizStatsSlice';
import authReducer from '../Slicers/authSlice';
import faqReducer from '../Slicers/faqSlice';
import analyticsReducer from '../Slicers/analyticsSlice';

export const store = configureStore({
  reducer: {
    roadmaps: roadmapReducer,
    quizStats: quizStatsReducer,
    auth: authReducer,
    faq: faqReducer,
    analytics: analyticsReducer,
    // ... other reducers


  },
});
