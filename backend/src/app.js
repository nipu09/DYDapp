
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import habitRouter from "./routes/habit.routes.js";
import habitLogRouter from "./routes/habitLog.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import aiRouter from "./routes/ai.routes.js";
const app = express();

// CORS configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/habit", habitRouter);
app.use("/api/v1/", habitLogRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/ai", aiRouter);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Global JSON Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
    });
});




export { app };
