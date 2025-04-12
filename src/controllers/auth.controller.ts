import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';
import { hashPassword, findUserByEmail, comparePassword } from '../services/auth.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { generateOTP } from '../utils/otp';
import { sendOtpEmail } from '../utils/email';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession(); // 1. Start session

  try {
    session.startTransaction(); // 2. Begin transaction

    const { name, email, password } = req.body;

    // 3. Check if user already exists
    const existingUser: IUser | null = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction(); // 4. Rollback
      session.endSession();
      return next(new AppError('User already exists', 400));
    }

    // 5. Hash password
    const hashedPassword = await hashPassword(password);

    // 6. Create user inside the transaction
    const createdUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword
        }
      ],
      { session }
    );

    const newUser: IUser = createdUsers[0]; // because .create returns an array

    // 7. Generate JWT token
    const accessToken = generateAccessToken(newUser); // because .create returns an array in transaction
    const refreshToken = generateRefreshToken(newUser);

    await session.commitTransaction(); // 8. Commit if everything is good
    session.endSession();

    logger.info(`User registered successfully: ${newUser._id}`);

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken
    });
  } catch (err) {
    await session.abortTransaction(); // 9. Rollback on error
    session.endSession();
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user: IUser | null = await findUserByEmail(email);
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // 2. Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // 3. Generate JWT tokens
    const accessToken = generateAccessToken(user); // because .create returns an array in transaction
    const refreshToken = generateRefreshToken(user);

    logger.info(`User logged in successfully: ${user._id}`);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.header('Authorization')?.split(' ')[1];
    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    // 1. Verify refresh token
    const decoded: TokenPayload | null = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // 2. Find user by ID
    const user: IUser | null = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // 3. Generate new access token
    const accessToken = generateAccessToken(user);

    logger.info(`Access token refreshed successfully for user: ${user._id}`);

    res.status(200).json({
      message: 'Access token refreshed successfully',
      accessToken
    });
  } catch (err) {
    next(err);
  }
};

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user: IUser | null = await findUserByEmail(email);

    if (!user) {
      return next(new AppError('Invalid email', 400));
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.otp = otp;
    user.otpExpiration = otpExpires;

    await user.save();

    // Optionally send email
    // sendOtpEmail(email, otp);

    logger.info(`OTP sent to email: ${email}`);

    console.log(`OTP for ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password } = req.body;

    const user: IUser | null = await findUserByEmail(email);

    if (!user) {
      return next(new AppError('Invalid email', 400));
    }

    if (user.otp && user.otp !== otp) {
      return next(new AppError('Invalid otp', 400));
    }

    if (user.otpExpiration && user.otpExpiration < new Date()) {
      return next(new AppError('OTP has expired', 400));
    }

    const hashedPassword: string = await hashPassword(password);

    user.password = hashedPassword;

    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    logger.info(`Password reset successfully for email: ${email}`);

    res.status(200).json({ message: 'Password rested successfully' });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    const id = req.user?.id;

    const user: IUser | null = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 401));
    }
    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.save();

    logger.info(`Password changed successfully for user: ${user._id}`);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
