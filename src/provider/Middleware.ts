import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ValidatorSchemas } from '../types/index.js';
import { HTTP_STATUS } from '../constant/index.js';
import { UserModel } from '../modules/user/user.model.js';
import { User } from '../modules/user/dto/schema.js';

// Validates and parses request body, query, and params using provided Zod schemas, returning 400 on validation errors
export const RequestValidator = <T>({ body, query, params }: ValidatorSchemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (body) req.body = body.parse(req.body);
      if (query) (req as Request & { validatedQuery: T }).validatedQuery  = query.parse(req.query);
      if (params) req.params = params.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.issues
        });
      }
      next(error);
    }
  };

// Ensures a user session exists by checking cookies; denies access (403) if no valid session is found
export const sessionValidator = (req: Request, res: Response, next: NextFunction) : void => {
  const userCookie = req.headers.cookie?.split('=');
  if (!userCookie) {
    next(new Error('User Id not Found'));
    return;
  }
  if (userCookie.length) {
    const userSessionId = userCookie.pop() as string;
    const user: User | undefined = UserModel.get(userSessionId);
    if (!user) {
      res.status(HTTP_STATUS.FORBIDDEN).json('Cannot access without session');
      return;
    }
    req.headers.userSessionId = userSessionId;
  }
  next();
  return;
};

// Global error handler: formats errors into a JSON response with status code and message
export const errorResponse: ErrorRequestHandler =  (err, req, res, _next) => {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  const { message } = err;
  let statusCode = HTTP_STATUS.INTERNAL_SERVER;
  if (err instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
  }
  res.status(statusCode).json({
    message,
    statusCode,
    status: 'error',
  });
};

// Wraps res.json to always return an object containing status and data fields
export const responseFormat = (_req: Request, res: Response, next: NextFunction) => {
  const oldResponse = res.json;
  res.json = (data : any) => {
    const responseSchema = {
      status: res.statusCode,
      data,
    };
    return oldResponse.call(res, responseSchema);
  };
  next();
};

// Health check endpoint: returns a 200 OK with status "ok"
export const healthCheck = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(HTTP_STATUS.OK).json({
    status:'ok'
  });
};