import { Router } from "express";
import * as formController from "@/controllers/formController";
import { asyncHandler } from "@/middlewares";

const router = Router();

// Public routes - Generate form models from events
router.get("/events/:eventId/form-model", asyncHandler(formController.getFormModelByEventId));
router.get("/events/slug/:slug/form-model", asyncHandler(formController.getFormModelBySlug));

// Public route - Submit form response/registration
router.post("/events/:eventId/submit", asyncHandler(formController.submitFormResponse));

export default router;

