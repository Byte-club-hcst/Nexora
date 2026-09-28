const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const { generalLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/error');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Strict CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed = env.allowedOrigins.some((allowed) => {
      if (allowed === origin) return true;
      try {
        const originUrl = new URL(origin);
        const allowedUrl = new URL(allowed);
        return originUrl.hostname === allowedUrl.hostname;
      } catch {
        return false;
      }
    });

    if (isAllowed || !env.isProduction) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing with safe size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply general rate limiting
app.use('/api', generalLimiter);

// Health check endpoints
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'nexora-2026-api',
    uptime: process.uptime(),
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/event', require('./routes/event.routes'));
app.use('/api/tracks', (req, res) => {
  const eventController = require('./controllers/event.controller');
  return eventController.getTracks(req, res);
});
app.use('/api/registration', require('./routes/registration.routes'));
app.use('/api/submission', require('./routes/submission.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`,
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
