import { Router } from "express";
import * as organizationController from "@/controllers/organizationController";
import { asyncHandler } from "@/middlewares";

const router = Router();

// Create a new organization
router.post("/organizations", asyncHandler(organizationController.createOrganization));

// Public routes - Read only
router.get("/organizations", asyncHandler(organizationController.listOrganizations));
router.get("/organizations/:organizationId", asyncHandler(organizationController.getOrganizationById));

export default router;
