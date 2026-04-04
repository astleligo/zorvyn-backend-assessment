import express from "express";
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from "../controllers/transactionController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createTransaction);
router.get("/", protect, authorize("admin", "analyst"), getTransactions);
router.put("/:id", protect, authorize("admin"), updateTransaction);
router.delete("/:id", protect, authorize("admin"), deleteTransaction);

export default router;