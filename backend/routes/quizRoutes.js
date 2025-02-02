const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const QUIZ_API = 'https://quizapi.io/api/v1/questions';
const API_KEY = process.env.QUIZ_API_KEY;

const fetchWithRetry = async (params, retries = 3) => {
 try {
   const response = await axios.get(QUIZ_API, {
     params: {
       apiKey: API_KEY,
       ...params,
       limit: params.limit || 10
     }
   });
   return response.data;
 } catch (error) {
   if (retries > 0 && error.response?.status === 429) {
     await new Promise(resolve => setTimeout(resolve, 2000));
     return fetchWithRetry(params, retries - 1);
   }
   throw error;
 }
};

const transformQuestions = (data) => data.map(q => ({
 id: q.id,
 question: q.question,
 difficulty: q.difficulty,
 category: q.tags[0]?.name || 'Uncategorized',
 answers: Object.entries(q.answers)
   .filter(([_, value]) => value !== null)
   .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
 correctAnswers: Object.entries(q.correct_answers)
   .filter(([_, value]) => value === 'true')
   .map(([key]) => key.replace('_correct', '')),
 explanation: q.explanation,
 multipleCorrectAnswers: q.multiple_correct_answers === 'true'
}));

router.get('/', async (req, res) => {
 try {
   const { 
     category, 
     difficulty, 
     limit = 10, 
     tags 
   } = req.query;

   const cacheKey = `quiz-${category}-${difficulty}-${limit}-${tags || 'all'}`;
   const cachedData = cache.get(cacheKey);
   
   if (cachedData) {
     return res.json(cachedData);
   }

   const apiParams = {
     ...(difficulty && { difficulty: difficulty.toLowerCase() }),
     ...(tags && { tags }),
     limit: parseInt(limit, 10)
   };

   const rawData = await fetchWithRetry(apiParams);
   const transformedData = transformQuestions(rawData);

   if (transformedData.length === 0) {
     return res.status(404).json({ error: 'No questions found' });
   }

   cache.set(cacheKey, transformedData);
   res.json(transformedData);

 } catch (error) {
   console.error('Quiz API error:', error);
   const status = error.response?.status || 500;
   const message = error.response?.data?.error || 'Failed to fetch questions';
   res.status(status).json({ 
     error: message,
     details: error.response?.data
   });
 }
});

module.exports = router;