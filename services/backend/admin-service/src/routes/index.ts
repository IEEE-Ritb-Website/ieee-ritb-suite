import { Router } from 'express';
import { pingRoute } from './ping';
import { sampleRoute } from './sample';

const router = Router();

router.use(pingRoute);
router.use(sampleRoute);

export default router;
