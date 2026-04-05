import User from "../models/User.js";
import { handleError } from "../utils/errorHandler.js";

// Update Role (Admin only)
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User role updated",
            data: user,
        });
    } catch (err) {
        handleError(res, err);
    }
};

// Update Status (Admin only)
export const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        // Prevent self-deactivation
        if (req.user.id === req.params.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User status updated",
            data: user,
        });
    } catch (err) {
        handleError(res, err);
    }
};