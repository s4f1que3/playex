require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const emailRoutes = require('./routes/emailRoutes');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://playex.vercel.app',
    'https://playex-frontend.vercel.app',
    'https://playex-backend.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Debug middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Playex API is running',
    status: 'online',
    environment: process.env.NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/email', emailRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : null
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
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API URL: http://localhost:${port}`);
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
