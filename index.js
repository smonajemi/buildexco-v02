import express from 'express';
import findFreePort from 'find-free-port';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Find a free port
findFreePort(PORT, (err, freePort) => {
  if (err) {
    console.error('Error finding a free port:', err);
    process.exit(1); 
  }

  // Start the server
  app.listen(freePort, () => {
    console.log(`Server running on port ${freePort}`);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});
