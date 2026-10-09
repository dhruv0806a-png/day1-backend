require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const app = express();
const logger = require("./middleware/logger");
app.use(logger);
const timer = require("./middleware/timer");
app.use(timer);
const AppError = require("./middleware/AppError");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const miscRouter = require("./routes/misc");

app.get("/", (req, res) => {
  res.send("Backend started successfully");
});

app.use("/products", productsRouter);
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/", miscRouter);
app.use((req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
