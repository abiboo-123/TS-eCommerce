import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';
import { hashPassword, findUserByEmail, comparePassword } from '../services/auth.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { generateOTP } from '../utils/otp';
import { sendOtpEmail } from '../utils/email';

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
      return res.status(400).json({ message: 'User already exists' });
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
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user: IUser | null = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Generate JWT tokens
    const accessToken = generateAccessToken(user); // because .create returns an array in transaction
    const refreshToken = generateRefreshToken(user);

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
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // 1. Verify refresh token
    const decoded: TokenPayload | null = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // 2. Find user by ID
    const user: IUser | null = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 3. Generate new access token
    const accessToken = generateAccessToken(user);

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
      return res.status(400).json({ message: 'Invalid email' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.otp = otp;
    user.otpExpiration = otpExpires;

    await user.save();

    // Optionally send email
    // sendOtpEmail(email, otp);

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
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (user.otp && user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiration && user.otpExpiration < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const hashedPassword: string = await hashPassword(password);

    user.password = hashedPassword;
    await user.save();

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
      return res.status(401).json({ message: 'User not found' });
    }
    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
