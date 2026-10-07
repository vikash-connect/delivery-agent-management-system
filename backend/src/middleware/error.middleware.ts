import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle Custom Application Errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.statusCode === 404 ? 'NOT_FOUND' : err.statusCode === 409 ? 'DUPLICATE_ENTRY' : 'BAD_REQUEST',
        message: err.message,
      },
    });
    return;
  }

  // Handle Zod Request Validation Errors
  if (err instanceof ZodError) {
    const details = err.issues.map((issue: ZodIssue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details,
      },
    });
    return;
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation (e.g. duplicate email or phoneNumber)
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      const field = target.join(', ');
      res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: `Delivery agent with this ${field || 'field'} already exists`,
        },
      });
      return;
    }

    // P2025: Record to update or delete not found
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Delivery agent not found',
        },
      });
      return;
    }
  }

  // Default Fallback Error (Internal Server Error)
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred on the server',
    },
  });
};
