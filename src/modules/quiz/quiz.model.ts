import { InMemoryDB } from '../../provider/InMemoryDB.js';
import { Quiz, Answers, QuestionWithOption, ExistedQuestion } from './dto/schema.js';

// In-memory database instance for storing Quiz objects
export const QuizModel = new InMemoryDB<Quiz>();

// In-memory database instance for storing questions along with their options and correct answers
export const QuestionModel = new InMemoryDB<QuestionWithOption>();

// In-memory database instance for tracking whether a question text has already been assigned an ID
export const ExistedQuestionModel = new InMemoryDB<ExistedQuestion>();

// In-memory database instance for storing user answers to questions
export const AnswerModel = new InMemoryDB<Answers>();
