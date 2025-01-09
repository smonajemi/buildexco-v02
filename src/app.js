import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; 
import expressHandlebars from 'express-handlebars'; 
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import helmet from 'helmet';
import session from 'express-session';
import indexRoute from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Views directory
const viewsDir = path.join(__dirname, 'views');

// Handlebars engine 
app.engine('.hbs', expressHandlebars.engine({
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(viewsDir, 'layout'),
  partialsDir: path.join(viewsDir, 'partials'),
}));

// Set view engine and views directory
app.set('view engine', 'hbs');
app.set('views', viewsDir);

// Static file 
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',  
  etag: true,    
}));

// Middleware setup
app.use(compression()); //faster response times
app.use(helmet({
  contentSecurityPolicy: false,  // allow inline scripts/styles
  crossOriginEmbedderPolicy: false, // loading external resources
  frameguard: { action: 'deny' }, // clickjacking
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,  // 100 requests per window
});
app.use(limiter);

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,  
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
}));


// Routes
app.use('/', indexRoute);

// Error handling (404 and general errors)
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: 'Page Not Found', 
    message: 'Sorry, the page you are looking for does not exist.' 
  });
});

// General error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', { 
    title: 'Error', 
    message: err.message || 'Internal Server Error' 
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

export default app;
