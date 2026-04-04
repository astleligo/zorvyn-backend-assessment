import Transaction from "../models/Transaction.js";

// CREATE
export const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            createdBy: req.user.id,
        });

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET (with filtering)
export const getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        let filter = {};

        if (type) filter.type = type;
        if (category) filter.category = category;

        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const transactions = await Transaction.find(filter).sort({ date: -1 });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
export const deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};