require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize } = require('./models');
const { PORT, CLIENT_URL, NODE_ENV } = require('./config/env');
const logger = require('./utils/logger');

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']   // ✅ extra safety
  }
});

// Make io accessible to routes via app
app.set('io', io);

// Socket connection handling
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Join room based on user or restaurant
  socket.on('join:user', (userId) => {
    socket.join(`user-${userId}`);
    logger.debug(`Socket ${socket.id} joined user room: user-${userId}`);
  });

  socket.on('join:restaurant', (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`);
    logger.debug(`Socket ${socket.id} joined restaurant room: restaurant-${restaurantId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync models (use { alter: true } in development only)
    if (NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized');
    }

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`Client URL: ${CLIENT_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server...');
  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await sequelize.close();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error closing database connection:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();

module.exports = { app, server };