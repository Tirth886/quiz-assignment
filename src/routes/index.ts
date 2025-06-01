import { Router } from 'express';
import { QuizeRoute, UserRoute } from '../modules/index.js';

const router = Router();

router.use('/quiz', QuizeRoute);
router.use('/user', UserRoute);

export default router;