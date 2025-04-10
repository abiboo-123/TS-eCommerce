import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Order, { IOrder, IOrderItem } from '../models/orders.model';
import Product, { IProduct } from '../models/product.model';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get the total number of orders for pagination
    const orders = await Order.find({ user: userId }).populate('items.product').skip(skip).limit(limit);

    const total = await Order.countDocuments({ user: userId });
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.status(200).json({
      message: 'Orders found successfully',
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const userId = req.user?.id;

  try {
    const order: IOrder | null = await Order.findOne({ _id: orderId, user: userId }).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'order found successfully', order });
  } catch (err) {
    next(err);
  }
};

/**
 * If the order is already shipped or delivered, we might want to handle the return process
 * else if the order is pending or confirmed, we can simply cancel it
 *
 * if order is paid, we might need to process a refund after the return of the product
 * else if order is not paid, we can just cancel it
 *
 * but for now, we will just cancel the order
 */
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const userId = req.user?.id;

  try {
    const order: IOrder | null = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus === 'cancelled' || order.orderStatus === 'returned') {
      return res.status(400).json({ message: 'Order is already cancelled or returned' });
    }

    // Alert the stock of the products in the order
    await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
      })
    );

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    next(err);
  }
};

export const returnOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const userId = req.user?.id;

  try {
    const order: IOrder | null = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus === 'returned') {
      return res.status(400).json({ message: 'Order is already returned' });
    }

    // Alert the stock of the products in the order
    await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
      })
    );

    order.orderStatus = 'returned';
    await order.save();

    res.status(200).json({ message: 'Order returned successfully', order });
  } catch (err) {
    next(err);
  }
};
