import { Router } from "express";
import * as registrationController from "@/controllers/registrationController";
import { asyncHandler } from "@/middlewares";
import { writeLimiter } from "@/middlewares/rateLimit";

const router = Router();

// Register for a project (open, no auth required)
router.post("/projects/:projectId/register", writeLimiter, asyncHandler(registrationController.registerForProject));

// List registrations for a project
router.get("/projects/:projectId/registrations", asyncHandler(registrationController.listRegistrationsByProject));

// Get registration for a project (by optional email query or me)
router.get("/projects/:projectId/registrations/me", asyncHandler(registrationController.getMyRegistration));

export default router;
