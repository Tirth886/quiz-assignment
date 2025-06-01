import { z } from 'zod';

const questionSchema = z.object({
  text: z.string(),
  options: z.array(z.string().min(1)).min(4),
  correct_option: z.number().min(0),
});

export const createQuizSchema = z.object({
  title: z.string().min(1).max(255),
  questions: z.array(questionSchema).min(1),
});

export const getQuizSchema = z.object({
  quizId: z.string(),
});

export const questionIdSchema = z.object({
  questionId: z.string(),
});
export const selectedOptionSchema = z.object({
  selected_option: z.coerce.number().min(0),
});