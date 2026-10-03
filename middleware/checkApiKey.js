function checkApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (key !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  console.log("Received API key:", key);
  next();
}

module.exports = checkApiKey;
