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


// CORS CONFIGURATION
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


// GLOBAL MIDDLEWARE
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// API ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/habits", habitRouter);
app.use("/api/v1/habit-logs", habitLogRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/ai", aiRouter);


// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };