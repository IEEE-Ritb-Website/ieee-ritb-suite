import { Router } from "express";
import * as organizationController from "@/controllers/organizationController";
import { asyncHandler } from "@/middlewares";
import { writeLimiter } from "@/middlewares/rateLimit";

const router = Router();

// Create a new organization
router.post("/organizations", writeLimiter, asyncHandler(organizationController.createOrganization));

// Read routes
router.get("/organizations", asyncHandler(organizationController.listOrganizations));
router.get("/organizations/:organizationId", asyncHandler(organizationController.getOrganizationById));

export default router;
