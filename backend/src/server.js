const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 NEXORA 2026 Production API Server Online`);
  console.log(`📡 Port: ${env.PORT}`);
  console.log(`🌐 Environment: ${env.NODE_ENV}`);
  console.log(`🔒 Allowed Origins: ${env.allowedOrigins.join(', ')}`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Gracefully closing server...`);
  server.close(() => {
    console.log('✅ HTTP server closed. Process exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
