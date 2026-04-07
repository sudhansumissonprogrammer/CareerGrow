import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connectDB, { isDbConnected } from "./utils/db.js";
import applicationRouter from "./routes/application.route.js";
import companyRouter from "./routes/company.routes.js";
import contactRouter from "./routes/contact.routes.js";
import docsRouter from "./routes/docs.routes.js";
import jobRouter from "./routes/job.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { createRateLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = frontendUrl
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use(createRateLimiter());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools (no origin header) and local Vite dev ports.
    if (!origin) return callback(null, true);
    const isAllowedConfiguredOrigin = allowedOrigins.includes(origin);
    const isAllowedLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

    if (isAllowedConfiguredOrigin || isAllowedLocalhost) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.get("/health", (_req, res) => {
  const dbConnected = isDbConnected();
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? "Server is running" : "Server is running, database is disconnected",
    database: dbConnected ? "connected" : "disconnected",
  });
});

app.use((req, res, next) => {
  const bypassPaths = ["/health", "/api/v1/contact"];
  if (bypassPaths.includes(req.path)) {
    return next();
  }

  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database is unavailable. Please try again shortly.",
    });
  }

  return next();
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/docs", docsRouter);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
  });

  const connected = await connectDB();
  if (!connected) {
    console.error(
      "Initial database connection failed. Server is still running; check MONGO_URL/network and restart after fixing."
    );
  }
};

startServer();
