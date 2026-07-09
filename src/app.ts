import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "@/config/passport";
import routes from "@/routes";
import { notFoundHandler, errorHandler } from "@/middlewares/error.middleware";

const app = express();

// --- Global middlewares ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

// --- Health check ---
app.get("/", (req, res) => {
  res.json({ message: "Chatbot backend jalan 🚀" });
});

// --- Semua route API di-prefix /api ---
app.use("/api", routes);

// --- 404 & error handler (harus paling bawah) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
