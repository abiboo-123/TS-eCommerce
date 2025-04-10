import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAddress extends Document {
  _id: Types.ObjectId;
  street: string;
  houseNumber?: number;
  postalCode: number;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'consumer' | 'admin';

  phoneNumber?: string;
  address: Types.DocumentArray<IAddress>;
  profileImage?: string;

  otp?: string;
  otpExpiration?: Date;
}

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    houseNumber: { type: Number },
    postalCode: { type: Number, required: true },
    isDefault: { type: Boolean, required: true, default: false }
  },
  { _id: true }
);

const userSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['consumer', 'admin'], default: 'consumer', required: true },

    phoneNumber: { type: String },
    address: {
      type: [addressSchema],
      default: []
    },
    profileImage: { type: String },

    otp: { type: String },
    otpExpiration: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
