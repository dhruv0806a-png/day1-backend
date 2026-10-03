console.log("AppError.js loaded");
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
