import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/userModel';

type TokenPayload = {
  id: string;
  role?: string;
};

export const generateAccessToken = (user: IUser): string => {
  const accessSecret = process.env.JWT_ACCESS_SECRET || '';
  const accessExpiry = (process.env.JWT_ACCESS_EXPIRY || '15m') as any;

  if (!accessSecret) {
    throw new Error('JWT_ACCESS_SECRET is not defined');
  }

  const payload = {
    id: user._id,
    role: user.role
  };

  const options: SignOptions = {
    expiresIn: accessExpiry
  };

  return jwt.sign(payload, accessSecret, options);
};

export const generateRefreshToken = (user: IUser): string => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || '';
  const refreshExpiry = (process.env.JWT_REFRESH_EXPIRY || '30d') as any;

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  const payload = {
    id: user._id
  };

  const options: SignOptions = {
    expiresIn: refreshExpiry
  };

  return jwt.sign(payload, refreshSecret, options);
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  const accessSecret = process.env.JWT_ACCESS_SECRET || '';

  if (!accessSecret) {
    throw new Error('JWT_ACCESS_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, accessSecret) as TokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || '';

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, refreshSecret) as TokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
};

export type { TokenPayload };
