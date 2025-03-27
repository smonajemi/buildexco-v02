const cspReportMiddleware = (req, res) => {
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.status(204).send(); 
};

export { cspReportMiddleware };
