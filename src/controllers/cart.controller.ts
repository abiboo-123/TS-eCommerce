import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Cart, { ICart, ICartItem } from '../models/cart.model';
import Product from '../models/product.model';
import { checkOut } from '../services/cart.service';
import { IOrder } from '../models/orders.model';

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart: ICart | null = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      const newItem: ICartItem = {
        productId: new mongoose.Types.ObjectId(productId),
        quantity: Number(quantity)
      };
      cart.items.push(newItem);
    }

    const populatedCart = await cart.populate('items.productId');
    let total = 0;
    for (const item of populatedCart.items) {
      const price = (item.productId as any).price || 0;
      total += price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (err) {
    next(err);
  }
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.splice(existingItemIndex, 1);

    let total = 0;
    for (const item of cart.items) {
      const price = (item.productId as any).price || 0;
      total += price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully', cart });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    next(err);
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[existingItemIndex].quantity = Number(quantity);

    let total = 0;
    for (const item of cart.items) {
      const price = (item.productId as any).price || 0;
      total += price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({ message: 'Cart item quantity updated successfully', cart });
  } catch (err) {
    next(err);
  }
};

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { addressId, coupon } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const order: null | IOrder = await checkOut(userId, addressId, coupon);
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({ message: 'Checkout successful', order });
  } catch (err) {
    next(err);
  }
};
