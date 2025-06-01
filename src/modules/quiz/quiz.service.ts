import { generateUserQusestionMappingId, generateUUid } from '../../helper/index.js';
import { Id } from '../../types/index.js';
import { User } from '../user/dto/schema.js';
import { UserModel } from '../user/user.model.js';
import { Answers, ExistedQuestion, QuestionWithOption, Quiz } from './dto/schema.js';
import { Feedback, FeedbackWaring, Questions, Result, UserSummary } from './dto/type.js';
import { AnswerModel, ExistedQuestionModel, QuestionModel, QuizModel } from './quiz.model.js';

// Checks if a question with the given text already exists; if not, generates and stores a new ID, returning {id, isExist}
const getExistedQuestion = (qus: Questions) : Id & {isExist: boolean}  => {
  let isExist: boolean;
  const existed: ExistedQuestion | undefined = ExistedQuestionModel.get(qus.text);

  let questionId: string;
  if (!existed) {
    questionId = generateUUid();
    ExistedQuestionModel.set({
      id: qus.text,
      value: questionId
    });
    isExist = false;
  } else {
    questionId = existed.value;
    isExist = true;
  }
  return {
    id: questionId,
    isExist
  };
};

export function createQuestion(
  question: QuestionWithOption,
  id:string,
) {
  QuestionModel.set({
    id,
    correct_option: question.correct_option,
    options: question.options,
    text: question.text
  });
}

// Adds a new quiz with a generated ID, persists any new questions, and returns the quiz ID
export function addQuiz(quiz:Quiz): Id {
  const quizId = generateUUid();

  // Prepare questions for storage: for each question, retrieve or generate its ID (storing new questions in QuestionModel), then return question objects without the correct_option
  const preparedQuestions: Omit<QuestionWithOption, 'correct_option'>[] = quiz.questions
    .map((qus) => {
      const {
        id, isExist
      } = getExistedQuestion(qus); // Retrieve the question ID and a flag indicating if it already exists

      if (!isExist) {
        createQuestion(qus, id);
      }

      return {
        id,
        text: qus.text,
        options: qus.options
      };
    });

  const newQuiz = {
    id: quizId,
    title: quiz.title,
    questions: preparedQuestions,
  };

  QuizModel.set(newQuiz);
  return {
    id: quizId
  };
}

// Fetches a quiz by its ID from the QuizModel, returning null if not found
export function getQuizById(quizId: string): Quiz | null  {
  return QuizModel.get(quizId) ?? null;
}

// Retrieves a question, checks if the user has already answered it, evaluates the selected option, records the answer, and returns feedback or a warning
export function getQuestionAnswers(questionId: string, selectedOption: number, userId: string): Feedback | FeedbackWaring {
  const answerId = generateUserQusestionMappingId(userId, questionId);

  const question: QuestionWithOption | undefined = QuestionModel.get(questionId);

  if (!question) {
    const noQuestion: Omit<FeedbackWaring, 'feedbackGiven'> = {
      noQuestion: true,
    };
    return noQuestion;
  }

  const isAnswerGiven = AnswerModel.get(answerId);
  if (isAnswerGiven) {
    const feedbackGiven: Omit<FeedbackWaring, 'noQuestion'> = {
      feedbackGiven: true,
    };
    return feedbackGiven;
  }

  const isCorrect = question.correct_option === selectedOption;
  const result: Feedback = {
    questionId: question.id,
    questionText: question.text,
    selectedOption,
    isCorrect,
    correctOption:
      !isCorrect
        ? {
          index: question.correct_option ? question.correct_option : null,
          text: question.correct_option ? question.options[question.correct_option] : null
        }
        : null

  };

  AnswerModel.set({
    id: answerId,
    is_correct: isCorrect,
    question_id : questionId,
    selected_option : selectedOption
  });

  return result;
}

// Retrieves a user's quiz result summary (calculating score and building a detailed summary) and clears answered entries
export function getQuizResult(quizId: string, userId: string) : UserSummary | null {

  const user: User | undefined = UserModel.get(userId);
  if (!user) return null;

  const quiz : Quiz | undefined = QuizModel.get(quizId);
  if (!quiz) return null;

  const questionMapping= (quiz.questions as QuestionWithOption[])
    .reduce((questionMap : Record<string, QuestionWithOption>, item) => {
      questionMap[item.id] = item;
      return questionMap;
    }, {});

  const userQuestionMapping = Object.entries(questionMapping)
    .map(([questionId]) => generateUserQusestionMappingId(userId, questionId));

  let score = 0;
  const summary: Result[] = [];

  userQuestionMapping.forEach((answerId: string) => {
    const answer : Answers | undefined = AnswerModel.get(answerId);
    if (answer) {
      score += answer.is_correct ? 1 : 0;
      const questions: QuestionWithOption = questionMapping[answer.question_id];
      summary.push({
        id: answer.id,
        question : questions.text,
        questionId: answer.question_id,
        correct_option: questions.correct_option ? questions.options[questions.correct_option] : null,
        correct_option_index: questions.correct_option ? questions.correct_option : null,
        selected_option: questions.options[answer.selected_option],
        selected_option_index: answer.selected_option
      });
      AnswerModel.del(answerId);
    }
  });
  return {
    id: user.id,
    name: user.name,
    score,
    incorrect: userQuestionMapping.length - score,
    summary,
  };
}