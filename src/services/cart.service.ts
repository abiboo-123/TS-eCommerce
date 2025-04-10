import Order, { IOrder, IOrderItem } from '../models/orders.model';
import Cart, { ICart } from '../models/cart.model';
import Coupon, { ICoupon } from '../models/coupon.model';
import User, { IAddress, IUser } from '../models/user.model';
import { IProduct } from '../models/product.model'; // Import IProduct for type assertion

export const checkOut = async (userId: string, addressId: string, coupon?: string): Promise<IOrder> => {
  try {
    const couponDoc: ICoupon | null = coupon ? await Coupon.findOne({ code: coupon }) : null;

    const cart: ICart | null = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      throw new Error('Cart not found');
    }

    const user: IUser | null = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const address = user.address?.find((addr) => addr._id.toString() === addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    let totalPrice = cart.totalPrice;

    if (couponDoc) {
      const now = new Date();
      if (couponDoc.isActive && couponDoc.expiresAt > now) {
        if (couponDoc.usageLimit && couponDoc.usedCount >= couponDoc.usageLimit) {
          throw new Error('Coupon usage limit exceeded');
        }

        if (couponDoc.discountType === 'percentage') {
          totalPrice -= (totalPrice * couponDoc.discountValue) / 100;
        } else if (couponDoc.discountType === 'fixed') {
          totalPrice -= couponDoc.discountValue;
        }

        couponDoc.usedCount += 1;
        await couponDoc.save();
      }
    }

    const orderItems: IOrderItem[] = cart.items.map((item) => {
      const product = item.productId as unknown as IProduct;

      return {
        product: item.productId,
        quantity: item.quantity,
        price: product.price
      };
    });

    const order: IOrder = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      coupon: couponDoc?._id,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress: {
        street: address.street,
        houseNumber: address.houseNumber,
        postalCode: address.postalCode
      }
    });

    await order.save();
    return order;
  } catch (error: any) {
    throw new Error(`Error creating order: ${error.message || error}`);
  }
};
