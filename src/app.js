// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; 
import expbs from 'express-handlebars'; 
import indexRoute from './routes/index.js';  // Your route module

// Derive __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config();

const app = express();

// Set up the views directory
const viewsDir = path.join(__dirname, 'views');

// Set up the Handlebars engine with layouts and partials
app.engine('.hbs', expbs.engine({
  extname: '.hbs',
  defaultLayout: 'layout',  // Default layout name
  layoutsDir: path.join(viewsDir, 'layout'),  // Layouts directory
  partialsDir: path.join(viewsDir, 'partials')  // Partials directory
}));

// Set view engine and views directory
app.set('view engine', 'hbs');
app.set('views', viewsDir);

// Serve static files (public directory)
app.use(express.static(path.join(__dirname, 'public')));  // This serves files from the 'public' directory

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('MongoDB connection error:', err));

// Define routes
app.use('/', indexRoute);  // Mount your route here

// Error handling: 404 and other errors
app.use((req, res, next) => {
  next(createError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

export default app; 
