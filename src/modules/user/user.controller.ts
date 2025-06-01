import { NextFunction, Request, Response } from 'express';

import { createUser } from './user.service.js';
import { HTTP_STATUS } from '../../constant/index.js';

export const registerUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = createUser(req.body);
    res.cookie('sessionId', user.id, {
      httpOnly: true
    });
    res.status(HTTP_STATUS.CREATED).json(user);
  } catch (err) {
    next(err);
  }
};