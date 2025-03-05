import findFreePort from 'find-free-port';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import readline from 'readline';

// Connect to the database
connectDB();

// Find a free port
const primaryPort = process.env.PORT || 5000; 
const fallbackPorts = [3001, 3002, 3003, 3004];
let currentPortIndex = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

findFreePort(primaryPort, (err, freePort) => {
  if (err) {
    console.error('Error finding a free port:', err);

    rl.question('Primary port is busy. Do you want to try a fallback port? (y/n) \n', (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.question(`Please enter the fallback port to try (${fallbackPorts.join(', ')}): `, (newPort) => {
          const port = parseInt(newPort);
          if (!isNaN(port) && fallbackPorts.includes(port)) {
            startServer(port);
          } else {
            console.log('Invalid port number or port not available. Exiting...');
            process.exit(1);
          }
        });
      } else {
        console.log('Exiting...');
        process.exit(1);
      }
    });
  } else {
    startServer(freePort);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});
