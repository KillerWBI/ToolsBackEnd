import { HttpError } from "http-errors";
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  console.error("Server error:", err);


  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }


  res.status(500).json({
    message: "Internal Server Error",
  });
};
