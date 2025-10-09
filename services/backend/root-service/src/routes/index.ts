import { Router } from 'express';
import { pingRoute } from './ping';
import chapterRouter from './chapters';

const router = Router();

router.use(pingRoute);
router.use(chapterRouter);

export default router;
