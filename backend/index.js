// File: backend/index.js
// =================================================================================
// Server Entry Point for Employee Management System (Corrected)
// =================================================================================

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import jobPostingRoutes from './routes/jobPostingRoutes.js';
import jobApplicationRoutes from './routes/jobApplicationRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB Database
connectDB();

// --- Middleware Setup ---

// CORS Configuration
// This allows the frontend (running on Netlify or localhost) to make requests to this backend.
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite's default dev port
    'http://localhost:3000', // Common React dev port
    process.env.FRONTEND_URL    // Your production frontend URL from .env
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// Body Parser Middleware
// This allows the server to accept and parse JSON in request bodies.
app.use(express.json());

// --- API Routes ---
// All API endpoints are prefixed with /api
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/jobs', jobPostingRoutes);
app.use('/api/applications', jobApplicationRoutes);


// --- Root Endpoint ---
// A simple health check endpoint to confirm the server is running.
app.get('/', (req, res) => {
  res.send('Employee Management System API is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
