import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import leetcodeRoutes from './routes/leetcode.routes.js';
import taskRoutes from './routes/task.routes.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from "cookie-parser";
import progressRoutes from "./routes/progress.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";




dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://rise-dsa.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};


app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging only in dev
if (process.env.NODE_ENV === 'development') {
  const morgan = await import('morgan');
  app.use(morgan.default('dev'));
}

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Server is running' });
});

// ROUTES (must come BEFORE error handler)
app.use('/api/auth', authRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/mentor", mentorRoutes);

// GLOBAL ERROR HANDLER (ALWAYS LAST)
app.use(errorHandler);

// UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION 💥', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// UNHANDLED PROMISE REJECTION
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥', err);
  server.close(() => process.exit(1));
});