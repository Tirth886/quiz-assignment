import { NextFunction, Request, Response } from 'express';
import { addQuiz, getQuestionAnswers, getQuizById, getQuizResult } from './quiz.service.js';
import { HTTP_STATUS } from '../../constant/index.js';

export const fetchQuizById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;

    const quiz = getQuizById(quizId);

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    res.status(HTTP_STATUS.OK).json(quiz);
  } catch (err) {
    next(err);
  }
};

export const createQuiz = (req: Request, res: Response, next: NextFunction) => {
  try {
    const quiz = addQuiz(req.body);
    res.status(HTTP_STATUS.CREATED).json(quiz);
  } catch (err) {
    next(err);
  }
};

export const getQuestionFeedback = (req: Request, res: Response, next: NextFunction)  => {
  try {
    const { questionId } = req.params;
    const selectedOption = Number(req.query.selected_option);
    const userId = req.headers.userSessionId as string;

    const feedback = getQuestionAnswers(questionId, selectedOption, userId);

    if ('noQuestion' in feedback && feedback.noQuestion) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
    } else if ('feedbackGiven' in feedback && feedback.feedbackGiven) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Feedback already given' });
    } else {
      res.status(HTTP_STATUS.OK).json(feedback);
    }

    return;
  } catch (err) {
    next(err);
  }
};

export const getResults = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const userId = req.headers.userSessionId as string;
    const result = getQuizResult(quizId, userId);

    if (!result) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message : 'User not found or Quiz not found'
      });
      return;
    }
    res.clearCookie('sessionId', {
      httpOnly:true
    });
    res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
};

