import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js'

const PORT = process.env.PORT || 3000;
let server;

const startServer = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Error starting the server:', error.message);
    process.exit(1);
  }
};

startServer();