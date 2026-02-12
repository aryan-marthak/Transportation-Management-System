import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import driverRoutes from "./routes/driver.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
import tripRequestRoutes from "./routes/trip.request.js";
import './Scheduler/scheduler.js'; // Import the scheduler

const app = express();
dotenv.config();

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5002;

// Security: Add helmet for secure HTTP headers
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Note: express-mongo-sanitize removed due to Express v5 incompatibility
// NoSQL injection protection is handled by input validation in routes

app.use(express.json());
app.use(cookieParser());

// Security: Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many attempts from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to auth routes
app.use('/api/login', authLimiter);
app.use('/api/signup', authLimiter);
app.use('/api/verify-otp', authLimiter);

app.use('/api', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tripRequest', tripRequestRoutes);

mongoose.connect(URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
