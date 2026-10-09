import { Router } from "express";
import * as registrationController from "@/controllers/registrationController";
import { asyncHandler, requireAuth, requireRole } from "@/middlewares";
import { writeLimiter } from "@/middlewares/rateLimit";

const router = Router();

// Public route - Register for a project (requires sign-in)
router.post("/projects/:projectId/register", writeLimiter, requireAuth, asyncHandler(registrationController.registerForProject));

// Registrations for a project (mentors and admins only — contains PII)
router.get("/projects/:projectId/registrations", requireAuth, requireRole("mentor", "admin"), asyncHandler(registrationController.listRegistrationsByProject));

export default router;
