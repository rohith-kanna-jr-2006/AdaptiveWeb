const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const configRoutes = require('./routes/configRoutes');
const adaptiveRoutes = require('./routes/adaptiveRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const notFoundHandler = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security & Parsing Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Mount API Routes under /api
app.use('/api', healthRoutes);
app.use('/api', configRoutes);
app.use('/api', adaptiveRoutes);
app.use('/api', metricsRoutes);

// Register 404 Not Found Middleware
app.use(notFoundHandler);

// Register Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;
