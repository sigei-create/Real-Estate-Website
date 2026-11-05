
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// ===============================
// SIGN UP
// ===============================

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Remove password from response
        const { password: removedPassword, ...userDetails } =
            newUser.toObject();

        return res.status(201).json({
            message: "User registered successfully!",
            user: userDetails
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Something went wrong during registration."
        });
    }
};


// ===============================
// SIGN IN
// ===============================

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password."
            });
        }

        // Find user by email
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(
            password,
            validUser.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Remove password from returned user data
        const { password: removedPassword, ...userDetails } =
            validUser.toObject();

        // Send token in an HTTP-only cookie
        return res
            .cookie("access_token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000
            })
            .status(200)
            .json({
                message: "Login successful!",
                user: userDetails
            });

    } catch (error) {
        console.error("Signin error:", error);

        return res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
