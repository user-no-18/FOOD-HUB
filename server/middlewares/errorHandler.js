export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // don't leak stack traces in production
  const response = { success: false, message };
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  console.error(`❌ [${req.method}] ${req.path} →`, status, message);
  res.status(status).json(response);
};
