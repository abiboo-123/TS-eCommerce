import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  coupon?: Types.ObjectId;
  paymentMethod: 'cash' | 'paypal';
  paymentStatus: 'pending' | 'paid';
  orderStatus: 'pending' | 'confirmed' | 'returned' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    houseNumber?: number;
    postalCode: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalPrice: { type: Number, required: true },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon', required: false },
    paymentMethod: { type: String, enum: ['cash', 'paypal'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      street: { type: String, required: true },
      houseNumber: { type: Number },
      postalCode: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
