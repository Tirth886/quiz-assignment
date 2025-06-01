import { Router } from 'express';
import {
  registerUser,
} from './user.controller.js';
import { RequestValidator } from '../../provider/Middleware.js';
import { userSchema } from './user.validation.js';

const router = Router();

router.post(
  '/register',
  RequestValidator({ body : userSchema }),
  registerUser
);

export default router;
