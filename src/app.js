import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import expressHandlebars from 'express-handlebars';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import helmet from 'helmet';
import session from 'express-session';
import indexRoute from './routes/index.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// **Trust proxy for Heroku**
app.set('trust proxy', 1); 

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


// Enable request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
// Static file 
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',  
  etag: true,    
}));

// Middleware setup
app.use(compression()); // Faster response times
app.use(helmet({
  contentSecurityPolicy: false,  
  crossOriginEmbedderPolicy: false, 
  frameguard: { action: 'deny' },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// rate limiting 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,  // 100 requests 
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

// Error 404
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: 'Page Not Found', 
    message: 'Sorry, the page you are looking for does not exist.' 
  });
});

// General error
app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', { 
    title: 'Error', 
    message: err.message || 'Internal Server Error' 
  });
});

// Catch-all error 
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

export default app;
