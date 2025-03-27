export const httpsRedirect = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      if (req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
      }
    }
    next();
  };
  