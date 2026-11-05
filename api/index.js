import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
// Log every incoming API request
app.use((req, res, next) => {
    console.log("REQUEST RECEIVED:", req.method, req.originalUrl);
    next();
});

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Real Estate API!");
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });
