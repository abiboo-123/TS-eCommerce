import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoed: TokenPayload | null = verifyAccessToken(token);

  if (!decoed) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  (req as any).user = decoed;

  next();
};

export const authorization = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const hasAccess = allowedRoles.some((role) => user.role === role);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};
