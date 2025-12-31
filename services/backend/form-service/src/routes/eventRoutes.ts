import { Router } from "express";
import * as eventController from "@/controllers/eventController";
import { asyncHandler } from "@/middlewares";

const router = Router();

// Public routes - Read only
router.get("/events", asyncHandler(eventController.listEvents));
router.get("/events/:eventId", asyncHandler(eventController.getEventById));
router.get("/events/slug/:slug", asyncHandler(eventController.getEventBySlug));

export default router;
