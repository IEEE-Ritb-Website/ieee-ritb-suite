import { Router } from "express";
import { pingRoute } from "./ping";
import eventRoutes from "./eventRoutes";
import formRoutes from "./formRoutes";

const router = Router();

// Health check
router.use(pingRoute);

// API routes
router.use(eventRoutes);
router.use(formRoutes);

export default router;
