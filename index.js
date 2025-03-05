import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js'
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
