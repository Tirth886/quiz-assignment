import { Id } from '../../../types/index.js';
import { Questions } from './type.js';

export type ExistedQuestion = {
    value: string,
} & Id

export type Answers = {
    question_id: string,
    selected_option: number,
    is_correct: boolean
} & Id

export type QuestionWithOption = {
    options: string[],
    correct_option?: number
} & Questions

export type Quiz = {
  title: string;
  questions: QuestionWithOption[]
} & Id;