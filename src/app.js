import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; 
import expbs from 'express-handlebars'; 
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

// Handlebars engine setup with layouts and partials
app.engine('.hbs', expbs.engine({
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(viewsDir, 'layout'),
  partialsDir: path.join(viewsDir, 'partials'),
}));

// Set view engine and views directory
app.set('view engine', 'hbs');
app.set('views', viewsDir);

// Static file serving (public directory) with cache control
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',  // Cache static assets for 1 day
  etag: true,    
}));

// Middleware setup
app.use(compression()); //faster response times
app.use(helmet({
  contentSecurityPolicy: false,  // Disable CSP in development to allow inline scripts/styles
  crossOriginEmbedderPolicy: false, // Disable COEP for loading external resources
  frameguard: { action: 'deny' }, // Prevent clickjacking
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,  // Limit each IP to 100 requests per window
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
  next(createError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

export default app;
