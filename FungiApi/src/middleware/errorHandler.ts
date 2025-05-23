import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Send error response
  res.status(500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: 500,
      timestamp: new Date().toISOString()
    }
  });
};
