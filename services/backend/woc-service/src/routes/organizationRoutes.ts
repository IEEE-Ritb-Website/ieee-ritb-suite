import { Router } from "express";
import * as organizationController from "@/controllers/organizationController";
import { asyncHandler, requireAuth, requireRole } from "@/middlewares";
import { writeLimiter } from "@/middlewares/rateLimit";

const router = Router();

// Create a new organization (mentors and admins only)
router.post("/organizations", writeLimiter, requireAuth, requireRole("mentor", "admin"), asyncHandler(organizationController.createOrganization));

// Public routes - Read only
router.get("/organizations", asyncHandler(organizationController.listOrganizations));
router.get("/organizations/:organizationId", asyncHandler(organizationController.getOrganizationById));

export default router;
