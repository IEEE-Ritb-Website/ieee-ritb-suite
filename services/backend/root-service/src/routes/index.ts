import { Router } from 'express';
import chapterRouter from './chapter';

const router = Router();

router.use(chapterRouter);

export default router;
