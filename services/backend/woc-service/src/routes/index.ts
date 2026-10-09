import { Router } from 'express';
import { pingRoute } from './ping';
import { sampleRoute } from './sample';
import { cronRoute } from './cron';

const router = Router();

router.use(pingRoute);
router.use(sampleRoute);
router.use(cronRoute);

export default router;
