import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import leetcodeRoutes from './routes/leetcode.routes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

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