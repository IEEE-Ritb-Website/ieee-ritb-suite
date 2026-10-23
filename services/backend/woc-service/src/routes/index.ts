import { Router } from 'express';
import { pingRoute } from './ping';
import { sampleRoute } from './sample';
import { cronRoute } from './cron';
import organizationRoutes from './organizationRoutes';
import projectRoutes from './projectRoutes';
import registrationRoutes from './registrationRoutes';

const router = Router();

router.use(pingRoute);
router.use(sampleRoute);
router.use(cronRoute);
router.use(organizationRoutes);
router.use(projectRoutes);
router.use(registrationRoutes);

export default router;
