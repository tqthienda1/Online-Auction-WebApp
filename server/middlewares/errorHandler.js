export const errorHandler = (err, req, res, next) => {
  console.error("Error: ", err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "development" ? err.statck : undefined,
  });
};
