require('dotenv').config(); // Load environment variables at the top

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const userMediaRoutes = require('./routes/userMediaRoutes');

// Create Express app
const app = express();

// Set up security middleware
app.use(helmet());

// CORS configuration - Allow frontend to communicate with backend
const allowedOrigins = ['https://playex.onrender.com', 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins, // Ensure this matches your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle CORS preflight requests globally
app.options('*', cors());

// Middleware for JSON, URL encoding, and logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Root route to check API status
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Playex API is running',
    status: 'online',
    endpoints: [
      '/api/auth/login - Login',
      '/api/auth/register - Register',
      '/api/auth/reset-password - Reset password',
      '/api/auth/me - Get current user',
      '/api/users - User endpoints',
      '/api/media - Media endpoints',
      '/api/user-media - User media endpoints'
    ]
  });
});

// Set up API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/user-media', userMediaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve React app for unknown routes (AFTER API routes)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Set up port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
