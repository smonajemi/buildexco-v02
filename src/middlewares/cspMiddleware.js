const cspMiddleware = (req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' https://code.jquery.com https://cdn.jsdelivr.net https://www.google.com https://www.gstatic.com;" +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://use.fontawesome.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://use.fontawesome.com data:; " +
    "img-src 'self' data: https://www.buildexco.com; " +
    "frame-src 'self' https://www.google.com https://www.recaptcha.net; " +
    "object-src 'none'; " +
    "upgrade-insecure-requests; " +
    "report-uri /csp-violation-report;"
  );
  next();
};

const cspReportMiddleware = (req, res) => {
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.status(204).send(); 
};

export { cspMiddleware, cspReportMiddleware };
