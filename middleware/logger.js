function logger(req, res, next) {
  const now = new Date();
  const iso = now.toISOString();
  const method = req.method;
  const originalUrl = req.originalUrl;
  console.log(`[${iso}] ${method} ${originalUrl}`);

  next();
}

module.exports = logger;
