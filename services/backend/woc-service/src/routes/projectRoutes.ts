import { Router } from "express";
import * as projectController from "@/controllers/projectController";
import { asyncHandler, requireAuth, requireRole } from "@/middlewares";
import { writeLimiter } from "@/middlewares/rateLimit";

const router = Router();

// Create a new project (mentors and admins only)
router.post("/projects", writeLimiter, requireAuth, requireRole("mentor", "admin"), asyncHandler(projectController.createProject));

// Public routes - Read only
router.get("/projects", asyncHandler(projectController.listProjects));
router.get("/projects/:projectId", asyncHandler(projectController.getProjectById));
router.get("/projects/slug/:slug", asyncHandler(projectController.getProjectBySlug));

export default router;
