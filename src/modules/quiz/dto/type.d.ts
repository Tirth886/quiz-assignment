import { Id } from '../../../types/index.js';

export type Feedback = {
  questionId: string;
  questionText: string;
  selectedOption: number;
  isCorrect: boolean;
  correctOption: {
    index: number | null;
    text: string | null;
  } | null;
};

export type FeedbackWaring = {
  noQuestion?: boolean,
  feedbackGiven?: boolean
}

export type Questions = {
    text: string,
} & Id

export type Result = {
  questionId: string,
  question: string,
  selected_option_index: number,
  correct_option_index: number|null,
  correct_option: string|null,
  selected_option: string,
} & Id;

export type UserSummary = {
  name: string,
  score: number,
  incorrect: number,
  summary: Result[]
} & Id