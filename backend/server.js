require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Configuration - Allow frontend to communicate with backend
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  console.log(`[${timestamp}] ${method} ${path}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
    console.log(`✓ Database: calendar_management`);
  })
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message);
    console.error('Please check your MONGO_URI in the .env file');
    process.exit(1);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: NODE_ENV,
  });
});

// API Routes
app.use('/api/events', eventRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Calendar Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err.message);
  
  const statusCode = err.status || err.statusCode || 500;
  const isDevelopment = NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp,
    ...(isDevelopment && { stack: err.stack }),
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════');
  console.log('✓ Calendar Management Backend Started');
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
  console.log('═══════════════════════════════════════\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    console.log('✓ Server stopped');
    process.exit(0);
  });
});
