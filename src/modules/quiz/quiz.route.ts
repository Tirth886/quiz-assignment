import { Router } from 'express';
import {
  getResults,
  createQuiz,
  fetchQuizById,
  getQuestionFeedback
} from './quiz.controller.js';
import { RequestValidator, sessionValidator } from '../../provider/Middleware.js';
import { createQuizSchema, getQuizSchema, questionIdSchema, selectedOptionSchema } from './quiz.validation.js';
const router = Router();

router.post(
  '/create',
  RequestValidator({ body: createQuizSchema }),
  createQuiz
);

router.get(
  '/:quizId/fetch',
  sessionValidator,
  RequestValidator({ params: getQuizSchema }),
  fetchQuizById
);

router.get(
  '/:questionId/feedback',
  sessionValidator,
  RequestValidator({
    params: questionIdSchema,
    query: selectedOptionSchema
  }),
  getQuestionFeedback,
);

router.get(
  '/:quizId/result',
  sessionValidator,
  RequestValidator({ params: getQuizSchema }),
  getResults
);

export default router;
