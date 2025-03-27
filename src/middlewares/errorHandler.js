export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log detailed error only in development
  if (isDev) {
    console.error('Error:', err);
  } else {
    console.error('Error:', message);
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).render('error', {
      title: 'Validation Error',
      message: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).render('error', {
      title: 'Unauthorized',
      message: 'Access denied. Please login or check permissions.',
    });
  }

  // Handle 404 specifically
  if (err.statusCode === 404) {
    return res.status(404).render('error', {
      title: 'Page Not Found',
      message: err.message || 'Page not found.',
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).render('error', {
      title: 'Error',
      message: err.message,
    });
  }

  // Default fallback error
  res.status(status).render('error', {
    title: 'Server Error',
    message: isDev ? message : 'Something went wrong.',
  });
};

export default errorHandler;
