import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import adminEndpoints from './api/adminEndpoints';
import clientEndpoints from './api/clientEndpoints';
import { testConnection } from './config/database';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import streamingEndpoints from './api/streamingEndpoints';

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection:', reason);
});

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://admin.yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add detailed request logging
app.use(morgan('combined'));

// Cookie parser middleware
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HouseHunt backend is running.',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/admin', adminEndpoints);
app.use('/api/client', clientEndpoints);
app.use('/api/stream', streamingEndpoints);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', error);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Headers:', req.headers);
  console.error('Request Body:', req.body);
  console.error('Stack Trace:', error.stack);
  console.error('==========================');
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.message
    });
  }

  if (error.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      details: error.message
    });
  }

  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 HouseHunt backend server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
}); 