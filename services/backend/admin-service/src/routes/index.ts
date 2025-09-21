import { Router } from 'express';
import authRouter from './authRoutes';
import chapterRouter from './chapterRoutes';

const router = Router();

router.use(authRouter);
router.use(chapterRouter);

export default router;
