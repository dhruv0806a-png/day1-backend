function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // Mongoose CastError (invalid ObjectId) → 400
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
