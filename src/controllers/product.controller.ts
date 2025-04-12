import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product, { IProduct, IProductImage } from '../models/product.model';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const userId = req.user?.id;

  try {
    const products = await Product.find().skip(skip).limit(limit).lean();
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    logger.info(`Products retrieved successfully for user: ${userId}`);

    res.status(200).json({ message: 'Products retrieved successfully', products, totalProducts, totalPages });
  } catch (err) {
    next(err);
  }
};

export const productSearch = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const userId = req.user?.id;

  try {
    const query = {
      $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]
    };

    const products = await Product.find(query).skip(skip).limit(limit).lean();
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    logger.info(`Products retrieved successfully for user: ${userId}`);

    res.status(200).json({ message: 'Products retrieved successfully', products, totalProducts, totalPages });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const userId = req.user?.id;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));

    logger.info(`Product retrieved successfully for user: ${userId}`);

    res.status(200).json({ message: 'Product retrieved successfully', product });
  } catch (err) {
    next(err);
  }
};

export const submitProductReview = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user?.id;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));

    const index = product.reviews.findIndex((review) => review.userId.toString() === userId);

    if (index !== -1) {
      product.reviews[index].rating = rating;
      product.reviews[index].comment = comment;
      product.reviews[index].updatedAt = new Date();
    } else {
      product.reviews.push({
        _id: new mongoose.Types.ObjectId(),
        userId,
        rating,
        comment,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);
    }

    product.numOfReviews = product.reviews.length;
    product.averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.numOfReviews;

    await product.save();

    logger.info(`Product review submitted successfully for user: ${userId}`);

    res.status(200).json({ message: 'Product review submitted successfully', product });
  } catch (err) {
    next(err);
  }
};

export const getTopRatedProducts = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const userId = req.user?.id;

  try {
    const products = await Product.find().sort({ averageRating: -1 }).skip(skip).limit(limit).lean();

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    logger.info(`Top-rated products retrieved successfully for user: ${userId}`);

    res.status(200).json({ message: 'Top-rated products retrieved successfully', products, totalProducts, totalPages });
  } catch (err) {
    next(err);
  }
};
