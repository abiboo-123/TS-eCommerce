import { z } from 'zod';

export const registerValidator = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['customer', 'business'], { message: 'Role must be either customer or business' })
});

export const loginValidator = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export const forgetPasswordValidator = z.object({
  email: z.string().email({ message: 'Email is required' })
});

export const resetPasswordValidator = z.object({
  email: z.string().email({ message: 'Email is required' }),
  otp: z.string().min(6, { message: 'OTP is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export const changePasswordValidator = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});
