require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const emailRoutes = require('./routes/emailRoutes');
const sharesRoutes = require('./routes/sharesRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Middleware - ordered for optimal performance
app.use(helmet({
  contentSecurityPolicy: false, // Configure this based on your needs
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(compression({
  level: 6, // Balance between compression and CPU
  threshold: 1024 // Only compress responses larger than 1KB
}));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://playex.vercel.app',
    'https://playex-frontend.vercel.app',
    'https://playex-backend.vercel.app',
    'https://playex.cc',
    'https://www.playex.cc',
    /\.vercel\.app$/  // Allow all Vercel subdomains
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Conditional logging - only in development
if (!isProduction) {
  app.use(morgan('dev'));
}

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Health check route (no logging)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Playex API is running',
    status: 'online',
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/email', emailRoutes);
app.use('/api/shares', sharesRoutes);
app.use('/api/tmdb', tmdbRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path
  });
});

// Error handler - improved
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = isProduction ? 'Internal Server Error' : err.message;
  
  console.error(`[${req.id}] Error:`, {
    status,
    message: err.message,
    path: req.path,
    method: req.method
  });
  
  res.status(status).json({ 
    message,
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Modified server startup
const startServer = async (initialPort) => {
  const findAvailablePort = (port) => {
    return new Promise((resolve, reject) => {
      const server = app.listen(port)
        .once('listening', () => {
          server.close(() => resolve(port));
        })
        .once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            resolve(findAvailablePort(port + 1));
          } else {
            reject(err);
          }
        });
    });
  };

  try {
    const port = await findAvailablePort(initialPort);
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (isProduction) {
  // In production (Vercel), export the app
  module.exports = app;
} else {
  // In development, start the server
  const PORT = process.env.PORT || 5000;
  startServer(PORT);
}
