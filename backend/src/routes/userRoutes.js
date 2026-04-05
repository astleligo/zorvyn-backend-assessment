import express from "express";
import {
    updateUserRole,
    updateUserStatus,
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin only
router.patch("/:id/role", protect, authorize("admin"), updateUserRole);
router.patch("/:id/status", protect, authorize("admin"), updateUserStatus);

export default router;