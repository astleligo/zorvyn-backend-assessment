import Transaction from "../models/Transaction.js";

// 📊 SUMMARY
export const getSummary = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            {
                $group: {
                    _id: "$type", // ✅ FIXED
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let income = 0;
        let expense = 0;

        result.forEach((item) => {
            if (item._id === "income") income = item.total;
            if (item._id === "expense") expense = item.total;
        });

        res.json({
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📊 CATEGORY BREAKDOWN
export const getCategoryBreakdown = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            {
                $group: {
                    _id: {
                        category: "$category",
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                },
            },
            {
                $sort: { total: -1 },
            },
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📊 MONTHLY TRENDS
export const getMonthlyTrends = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                        },
                    },
                },
            },
            {
                $addFields: {
                    netBalance: { $subtract: ["$income", "$expense"] },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};