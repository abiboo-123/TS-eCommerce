import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues;
      return res.status(400).json({ message: 'Validation error', errors });
    }

    // Override the raw data with the validated one
    (req as any)[target] = result.data;
    next();
  };
};
