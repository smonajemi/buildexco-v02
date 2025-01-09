import express from 'express';
import findFreePort from 'find-free-port';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;  

connectDB();

findFreePort(PORT, (err, freePort) => {
  if (err) {
      console.error('Error finding a free port:', err);
    return;
  }
  
  app.listen(freePort, () => {
    console.log(`Server running on port ${freePort}`);
  });
});
