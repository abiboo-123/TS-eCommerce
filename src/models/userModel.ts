import { Document, Schema, model } from 'mongoose';
import { number } from 'zod';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'business';
  otp?: string;
  otpExpiration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'business'], required: true },
    otp: { type: String, required: false },
    otpExpiration: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const User = model<IUser>('User', userSchema);

// Export the model
export default User;
