// src/app.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; 
import expbs from 'express-handlebars'; 
import indexRoute from './routes/index.js';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// views directory
const viewsDir = path.join(__dirname, 'views');

// Handlebars engine with layouts and partials
app.engine('.hbs', expbs.engine({
  extname: '.hbs',
  defaultLayout: 'layout', 
  layoutsDir: path.join(viewsDir, 'layout'),  // Layouts directory
  partialsDir: path.join(viewsDir, 'partials')  // Partials directory
}));

// view engine and views directory
app.set('view engine', 'hbs');
app.set('views', viewsDir);

// static files (public directory)
app.use(express.static(path.join(__dirname, 'public'))); 

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  routes
app.use('/', indexRoute);

// Error handling
app.use((req, res, next) => {
  next(createError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

export default app; 
