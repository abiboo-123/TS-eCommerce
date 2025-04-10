import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProductImage extends Document {
  _id: Types.ObjectId;
  url: string;
  description?: string;
  isDefault: boolean;
}

export interface IProductReview extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  images: Types.DocumentArray<IProductImage>;
  isAvailable: boolean;
  reviews: Types.DocumentArray<IProductReview>;
  averageRating: number;
  numOfReviews: number;
}

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    description: { type: String, required: false },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const productReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const productSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    images: {
      type: [productImageSchema],
      default: []
    },
    reviews: {
      type: [productReviewSchema],
      default: []
    },
    averageRating: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
