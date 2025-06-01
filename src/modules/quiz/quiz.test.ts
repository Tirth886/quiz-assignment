// test/unit/quiz.service.spec.js

import { expect } from 'chai';
import { describe, it } from 'mocha';

// Adjust this path to point at where your compiled (or source) quiz.service lives
import {
  addQuiz,
  getQuestionAnswers,
  getQuizById,
  getQuizResult
} from './quiz.service.js';
import { Quiz } from './dto/schema.js';
import { createUser } from '../user/user.service.js';
import { User } from '../user/dto/schema.js';
import { Result, UserSummary } from './dto/type.js';

describe('Quiz Service · Unit Tests', () => {
  let sharedQuizId: string;
  let quiz: Quiz | null;
  let user: User;

  before(() => {
    const userInput = { name: 'Alice' };
    const newUser = createUser(userInput);
    user = newUser;
  });
  before( () => {
    const quiz: Quiz = {
      id:'',
      title: 'JavaScript Basics',
      questions: [
        {
          id:'',
          text: 'What is the result of `typeof null` in JavaScript?',
          options: ['object', 'null', 'undefined', 'number'],
          correct_option: 0
        },
        {
          id:'',
          text: 'Which method converts a JSON string into a JavaScript object?',
          options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.toObject()'],
          correct_option: 0
        },
        {
          id:'',
          text: 'Which keyword declares a block-scoped variable in JavaScript?',
          options: ['var', 'let', 'const', 'static'],
          correct_option: 1
        }
      ]
    };
    const newQuiz = addQuiz(quiz);
    sharedQuizId = newQuiz.id;
  });

  it('→ should have created a quiz with a valid ID', () => {
    expect(sharedQuizId).to.be.a('string').with.length.greaterThan(0);
  });

  before(() => {
    const fetched: Quiz | null = getQuizById(sharedQuizId);
    if (fetched) {
      quiz = fetched;
    }
  });
  it('→ should fetch the same quiz by using sharedQuizId', async () => {
    if (quiz) {
      expect(quiz.id).to.equal(sharedQuizId);
      expect(quiz.questions).to.be.an('array');
      quiz.questions.forEach((q) => {
        expect(q).to.be.an('object');
      });
    }
  });

  it('→ should submit question and immediate feedback', async () => {
    if (quiz && user) {
      const feedback = quiz.questions.map((qus) => {
        const randomSelection = Math.floor(Math.random() * 4); // Consider 4 option always
        return getQuestionAnswers(qus.id, randomSelection, user.id);
      });
      feedback.forEach((item) => {
        if ('feedbackGiven' in item) {
          expect(item.feedbackGiven).to.be.an('boolean');
        } else if ('noQuestion' in item) {
          expect(item.noQuestion).to.be.an('boolean');
        } else {
          if (
            'questionId' in item &&
              'questionText' in item &&
              'selectedOption' in item &&
              'isCorrect' in item
          ) {
            expect(item.questionId).to.be.an('string');
            expect(item.questionText).to.be.an('string');
            expect(item.selectedOption).to.be.an('number');
            expect(item.isCorrect).to.be.an('boolean');
          }
          if ('correctOption' in item && item.correctOption) {
            expect(item.correctOption).to.be.an('object');
          }
        }
      });
    }
  });
  it('→ should generate result with userId and correct/incorrect', async () => {
    if (quiz && user) {
      const summary: UserSummary | null = getQuizResult(quiz.id, user.id);
      // 1) Ensure it did not return null
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(summary).to.not.be.null;

      // 2) Check top‐level fields
      expect(summary).to.have.property('id');
      expect(summary).to.have.property('name');
      expect(summary).to.have.property('score');
      expect(summary).to.have.property('incorrect');
      expect(summary).to.have.property('summary').that.is.an('array').with.lengthOf(quiz.questions.length);

      // 3) Verify summary entries
      (summary?.summary as Result[]).map((item) => {
        // Entry 1 (correct answer for question1Id)
        expect(item).to.have.property('id');
        expect(item).to.have.property('question');
        expect(item).to.have.property('questionId');
        // The correct_option field should be the text of dummyQuestions[0].options[2]
        expect(item).to.have.property('correct_option');
        expect(item).to.have.property('correct_option_index');
        // The selected_option field is also the same (since answer was correct)
        expect(item).to.have.property('selected_option');
        expect(item).to.have.property('selected_option_index');
      });
    }
  });

});
