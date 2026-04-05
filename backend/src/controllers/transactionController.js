import Transaction from "../models/Transaction.js";
import { transactionSchema } from "../utils/validation.js";
import { handleError } from "../utils/errorHandler.js";

// CREATE
export const createTransaction = async (req, res) => {
    try {
        const data = transactionSchema.parse(req.body);

        const transaction = await Transaction.create({
            ...data,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (err) {
        handleError(res, err);
    }
};

// GET (with filtering)
export const getTransactions = async (req, res) => {
    try {
        const {
            type,
            category,
            startDate,
            endDate,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        let filter = {};

        // Filter by type
        if (type) filter.type = type;

        // Filter by category
        if (category) filter.category = category;

        // Validate dates
        if (startDate && isNaN(new Date(startDate))) {
            return res.status(400).json({
                success: false,
                message: "Invalid startDate",
            });
        }

        if (endDate && isNaN(new Date(endDate))) {
            return res.status(400).json({
                success: false,
                message: "Invalid endDate",
            });
        }

        // Date range filter
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // Search
        if (search) {
            filter.$or = [
                { category: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } },
            ];
        }

        // Pagination validation
        const pageNumber = Number(page);
        const limitNumberRaw = Number(limit);

        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid page number",
            });
        }

        if (isNaN(limitNumberRaw) || limitNumberRaw < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid limit value",
            });
        }

        // Apply limit cap (IMPORTANT)
        const limitNumber = Math.min(limitNumberRaw, 50);
        const skip = (pageNumber - 1) * limitNumber;

        // Count
        const total = await Transaction.countDocuments(filter);

        // Fetch
        const transactions = await Transaction.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (err) {
        handleError(res, err);
    }
};

// UPDATE
export const updateTransaction = async (req, res) => {
    try {
        const data = transactionSchema.partial().parse(req.body);

        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.json({
            success: true,
            data: transaction,
        });
    } catch (err) {
        handleError(res, err);
    }
};

// DELETE
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.json({
            success: true,
            message: "Transaction deleted",
        });
    } catch (err) {
        handleError(res, err);
    }
};