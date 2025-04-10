import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // % or fixed amount
  expiresAt: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
