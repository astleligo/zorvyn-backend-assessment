export const handleError = (res, err) => {
    // Zod errors
    if (err.name === "ZodError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((e) => e.message),
        });
    }

    // Mongo duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate field value",
        });
    }

    // Default
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};