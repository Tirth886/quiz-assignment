import { ZodSchema } from 'zod';

export type Id = {
    id: string;
}

export type ValidatorSchemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};