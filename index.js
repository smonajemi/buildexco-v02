import express from 'express';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;  

// Connect to the database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
