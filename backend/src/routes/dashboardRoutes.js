import express from "express";
import {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getRecentTransactions,
} from "../controllers/dashboardController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Analyst + Admin can access dashboard
router.get("/summary", protect, authorize("admin", "analyst"), getSummary);
router.get("/categories", protect, authorize("admin", "analyst"), getCategoryBreakdown);
router.get("/trends", protect, authorize("admin", "analyst"), getMonthlyTrends);
router.get("/recent", protect, authorize("admin", "analyst"), getRecentTransactions);

export default router;