import { registerSchema, loginSchema } from "../utils/validation.js";
import { handleError } from "../utils/errorHandler.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
    try {
        const data = registerSchema.parse(req.body);

        const userExists = await User.findOne({ email: data.email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
            ...data,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        handleError(res, err);
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const data = loginSchema.parse(req.body);

        const user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token,
        });
    } catch (err) {
        handleError(res, err);
    }
};