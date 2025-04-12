import User, { IAddress, IUser } from '../models/user.model';
import Product, { IProduct, IProductImage, IProductReview } from '../models/product.model';
import Order, { IOrder, IOrderItem } from '../models/orders.model';
import { Request, Response, NextFunction } from 'express';
import Coupon, { ICoupon } from '../models/coupon.model';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import { AppError } from '../utils/AppError';

// User Management
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search, role, sortBy } = req.query;
  const userId = req.user?.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const query: any = {};

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    }
    if (role) {
      query.role = role;
    }
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 }; // default sort

    if (sortBy === 'name') sortOptions = { name: 1 };
    else if (sortBy === 'email') sortOptions = { email: 1 };
    else if (sortBy === 'createdAt') sortOptions = { createdAt: -1 };

    const users = await User.find(query).select('-password -__v').sort(sortOptions).skip(skip).limit(limit);

    const totalUsers = await User.countDocuments(query);

    logger.info(`Fetched ${users.length} users from the database for userId: ${userId}`);

    res.status(200).json({
      status: 'success',
      data: {
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const userIdFromToken = req.user?.id;

  try {
    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    logger.info(`Fetched user ${user.name} from the database for userId: ${userIdFromToken}`);

    res.status(200).json({
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const { role } = req.body;
  const userIdFromToken = req.user?.id;

  try {
    const user: IUser | null = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true }).select('-password -__v');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    logger.info(`Updated user role for userId: ${userId}, by UserId: ${userIdFromToken}`);

    res.status(200).json({
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Products Management
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, category, quantity } = req.body;
  const host = `${req.protocol}://${req.get('host')}`;
  const files = req.files as Express.Multer.File[];
  const userId = req.user?.id;

  try {
    const imageArray = files.map((file) => ({
      url: `${host}/uploads/products/${file.filename}`,
      isDefault: false
    }));

    if (imageArray.length > 0) imageArray[0].isDefault = true;

    const product: IProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
      images: imageArray
    });

    await product.save();

    logger.info(`Product created successfully by userId: ${userId}, productId: ${product._id}`);

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { name, description, price, category, quantity } = req.body;
  const host = `${req.protocol}://${req.get('host')}`;
  const files = req.files as Express.Multer.File[];
  const userId = req.user?.id;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));

    if (files?.length > 0) {
      const imageArray = files.map((file) => ({
        url: `${host}/uploads/products/${file.filename}`,
        isDefault: false
      }));

      if (imageArray.length > 0) imageArray[0].isDefault = true;
      product.images.push(...imageArray);
    }

    Object.assign(product, {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(category && { category }),
      ...(quantity && { quantity })
    });

    await product.save();

    logger.info(`Product updated successfully by userId: ${userId}, productId: ${product._id}`);

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const userId = req.user?.id;

  try {
    const product: IProduct | null = await Product.findByIdAndDelete(productId);

    if (!product) return next(new AppError('Product not found', 404));

    logger.info(`Product deleted successfully by userId: ${userId}, productId: ${product._id}`);

    res.status(200).json({ message: 'Product deleted successfully', deletedId: productId });
  } catch (err) {
    next(err);
  }
};

export const addProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const host = `${req.protocol}://${req.get('host')}`;
  const files = req.files as Express.Multer.File[];
  const userId = req.user?.id;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));

    const imageArray = files.map((file) => ({
      url: `${host}/uploads/products/${file.filename}`,
      isDefault: false
    }));

    if (imageArray.length > 0) imageArray[0].isDefault = true;

    product.images.push(...imageArray);
    await product.save();

    logger.info(`Product images added successfully by userId: ${userId}, productId: ${product._id}`);

    res.status(200).json({ message: 'Product images added successfully', product });
  } catch (err) {
    next(err);
  }
};

export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { imageId } = req.body;
  const userId = req.user?.id;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));

    const index = product.images.findIndex((img: IProductImage) => img._id.toString() === imageId);
    if (index === -1) return next(new AppError('Image not found', 404));

    product.images.splice(index, 1);
    await product.save();

    logger.info(`Product image deleted successfully by userId: ${userId}, productId: ${product._id}, imageId: ${imageId}`);

    res.status(200).json({ message: 'Product image deleted successfully', deletedImageId: imageId, product });
  } catch (err) {
    next(err);
  }
};

export const setDefaultProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { imageId } = req.body;
  const userId = req.user?.id;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));

    const index = product.images.findIndex((img: IProductImage) => img._id.toString() === imageId);
    if (index === -1) return next(new AppError('Image not found', 404));

    product.images.forEach((img) => (img.isDefault = false));
    product.images[index].isDefault = true;
    await product.save();

    logger.info(`Product default image set successfully by userId: ${userId}, productId: ${product._id}, imageId: ${imageId}`);

    res.status(200).json({ message: 'Default product image set successfully', product });
  } catch (err) {
    next(err);
  }
};

// Orders Management
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  const { status, startDate, userId, sortBy, endDate = new Date() } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const userIdFromToken = req.user?.id;

  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    if (start > end) {
      return next(new AppError('Start date cannot be greater than end date', 400));
    }
  }

  try {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (userId) {
      query.user = userId;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (sortBy) {
      query.$sort = sortBy === 'newest' ? { createdAt: -1 } : { totalPrice: 1 };
    }

    const orders: IOrder[] = await Order.find(query)
      .populate('user', '-password -__v')
      .populate('items.product', 'name price')
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    if (orders.length === 0) {
      return next(new AppError('No orders found', 404));
    }

    logger.info(`Fetched ${orders.length} orders from the database for userId: ${userIdFromToken}`);

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page
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
    const order: IOrder | null = await Order.findById(orderId).populate('user', '-password -__v');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    logger.info(`Fetched order ${order._id} from the database for userId: ${userId}`);

    res.status(200).json({
      data: order
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  const userId = req.user?.id;

  try {
    const order: IOrder | null = await Order.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true }).populate(
      'user',
      '-password -__v'
    );
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    logger.info(`Updated order status for orderId: ${orderId}, by userId: ${userId}`);

    res.status(200).json({
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// Coupons Management
export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  const { code, discountType, discountValue, isActive, usageLimit, expiresAt } = req.body;
  const userId = req.user?.id;

  try {
    const coupon = new Coupon({
      code,
      expiresAt,
      discountType,
      discountValue,
      isActive,
      usageLimit
    });

    await coupon.save();

    logger.info(`Coupon created successfully by userId: ${userId}, couponId: ${coupon._id}`);

    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (err) {
    next(err);
  }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  const { couponIdOrCode } = req.params;
  const { code, discountType, discountValue, isActive, usageLimit, expiresAt } = req.body;
  const userId = req.user?.id;

  try {
    if (!couponIdOrCode) {
      return next(new AppError('Coupon ID or Code is required', 400));
    }
    const isId = mongoose.Types.ObjectId.isValid(couponIdOrCode);

    const coupon: ICoupon | null = isId
      ? await Coupon.findByIdAndUpdate(
          couponIdOrCode,
          {
            code,
            expiresAt,
            discountType,
            discountValue,
            isActive,
            usageLimit
          },
          { new: true, runValidators: true }
        )
      : await Coupon.findOneAndUpdate(
          { code: couponIdOrCode },
          {
            code,
            expiresAt,
            discountType,
            discountValue,
            isActive,
            usageLimit
          },
          { new: true, runValidators: true }
        );

    if (!coupon) return next(new AppError('Coupon not found', 404));

    logger.info(`Coupon updated successfully by userId: ${userId}, couponId: ${coupon._id}`);

    res.status(200).json({ message: 'Coupon updated successfully', coupon });
  } catch (err) {
    next(err);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  const { couponIdOrCode } = req.params;
  const userId = req.user?.id;

  if (!couponIdOrCode) {
    return next(new AppError('Coupon ID or Code is required', 400));
  }

  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(couponIdOrCode);
    const coupon: ICoupon | null = await Coupon.findOneAndDelete(isObjectId ? { _id: couponIdOrCode } : { code: couponIdOrCode });

    if (!coupon) {
      return next(new AppError('Coupon not found', 404));
    }

    logger.info(`Coupon deleted successfully by userId: ${userId}, couponId: ${coupon._id}`);

    res.status(200).json({ message: 'Coupon deleted successfully', deletedId: coupon._id });
  } catch (err) {
    next(err);
  }
};

export const getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
  const { code, isActive, discountType, valid, sortBy } = req.query;
  const userId = req.user?.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const query: any = {};
    if (code) {
      query.code = { $regex: code, $options: 'i' };
    }
    if (isActive) {
      query.isActive = isActive === 'true';
    }
    if (discountType) {
      query.discountType = discountType;
    }
    if (valid !== undefined) {
      query.expiresAt = valid ? { $gt: new Date() } : { $lte: new Date() };
    }
    if (sortBy) {
      query.$sort = sortBy === 'newest' ? { createdAt: -1 } : { discountValue: 1 };
    }
    const coupons: ICoupon[] = await Coupon.find(query).skip(skip).limit(limit);
    const totalCoupons = await Coupon.countDocuments(query);

    if (coupons.length === 0) {
      return next(new AppError('No coupons found', 404));
    }

    logger.info(`Fetched ${coupons.length} coupons from the database for userId: ${userId}`);

    res.status(200).json({
      status: 'success',
      data: {
        coupons,
        totalCoupons,
        totalPages: Math.ceil(totalCoupons / limit),
        currentPage: page
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getCouponByIdOrCode = async (req: Request, res: Response, next: NextFunction) => {
  const { couponIdOrCode } = req.params;
  const userId = req.user?.id;

  if (!couponIdOrCode) {
    return next(new AppError('Coupon ID or Code is required', 400));
  }

  try {
    const isId = mongoose.Types.ObjectId.isValid(couponIdOrCode);
    const coupon = isId ? await Coupon.findById(couponIdOrCode) : await Coupon.findOne({ code: couponIdOrCode });

    if (!coupon) {
      return next(new AppError('Coupon not found', 404));
    }

    logger.info(`Fetched coupon ${coupon.code} from the database for userId: ${userId}`);

    res.status(200).json({
      data: coupon
    });
  } catch (err) {
    next(err);
  }
};

// Dashboard Statistics

export const getDashboardStatistics = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCoupons = await Coupon.countDocuments();

    logger.info(`Fetched dashboard statistics for userId: ${userId}`);

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCoupons
      }
    });
  } catch (err) {
    next(err);
  }
};
