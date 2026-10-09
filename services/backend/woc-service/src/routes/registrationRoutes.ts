import { Router } from "express";
import * as registrationController from "@/controllers/registrationController";
import { asyncHandler } from "@/middlewares";

const router = Router();

// Public route - Register for a project
router.post("/projects/:projectId/register", asyncHandler(registrationController.registerForProject));

// Registrations for a project (mentors / organizers)
router.get("/projects/:projectId/registrations", asyncHandler(registrationController.listRegistrationsByProject));

export default router;
