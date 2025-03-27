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
import { cspReportMiddleware } from './middlewares/cspMiddleware.js';
import { httpsRedirect } from './middlewares/httpsRedirect.js'
import errorHandler, { AppError } from './middlewares/errorHandler.js';

// Environment Variables
dotenv.config();

// Directory Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App Initialization
const app = express();

// Proxy & Redirects
app.set('trust proxy', 1); // e.g., for Heroku
app.use(httpsRedirect);

// Static Files (before compression for caching benefit)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
}));

// Middleware: Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security Headers & Compression
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://www.google.com", "https://www.gstatic.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://use.fontawesome.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://use.fontawesome.com", "data:"],
      "img-src": ["'self'", "data:", "https://www.buildexco.com"],
      "frame-src": ["'self'", "https://www.google.com", "https://www.recaptcha.net"],
      "object-src": ["'none'"],
      "upgrade-insecure-requests": [],
      "report-uri": ["/csp-violation-report"]
    }
  },
  frameguard: { action: 'deny' },
  crossOriginEmbedderPolicy: false,
}));

// CSP Violation Reports
app.post("/csp-violation-report", cspReportMiddleware);

// Logger (after security)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Session Handling
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
}));

// View Engine Setup
const viewsDir = path.join(__dirname, 'views');
app.engine('.hbs', expressHandlebars.engine({
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(viewsDir, 'layout'),
  partialsDir: path.join(viewsDir, 'partials'),
}));
app.set('view engine', 'hbs');
app.set('views', viewsDir);

// 🛣️ Routes
app.use('/', indexRoute);

// 404 Handler
app.use((req, res, next) => {
  next(new AppError('Page Not Found', 404));
});

app.use(errorHandler);


export default app;
