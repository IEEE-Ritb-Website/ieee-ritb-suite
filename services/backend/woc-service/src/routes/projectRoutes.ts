import { Router } from "express";
import * as projectController from "@/controllers/projectController";
import { asyncHandler } from "@/middlewares";

const router = Router();

// Create a new project
router.post("/projects", asyncHandler(projectController.createProject));

// Public routes - Read only
router.get("/projects", asyncHandler(projectController.listProjects));
router.get("/projects/:projectId", asyncHandler(projectController.getProjectById));
router.get("/projects/slug/:slug", asyncHandler(projectController.getProjectBySlug));

export default router;
