import { Router } from "express";
import * as projectController from "@/controllers/projectController";
import { asyncHandler } from "@/middlewares";
import { writeLimiter } from "@/middlewares/rateLimit";

const router = Router();

// Create a new project
router.post("/projects", writeLimiter, asyncHandler(projectController.createProject));

// Read routes
router.get("/projects", asyncHandler(projectController.listProjects));
router.get("/projects/:projectId", asyncHandler(projectController.getProjectById));
router.get("/projects/slug/:slug", asyncHandler(projectController.getProjectBySlug));

export default router;
