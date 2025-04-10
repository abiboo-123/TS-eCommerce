import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product, { IProduct, IProductImage } from '../models/product.model';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, category, quantity } = req.body;
  const host = `${req.protocol}://${req.get('host')}`;
  const files = req.files as Express.Multer.File[];

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

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(limit).lean();
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

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

  try {
    const query = {
      $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]
    };

    const products = await Product.find(query).skip(skip).limit(limit).lean();
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ message: 'Products retrieved successfully', products, totalProducts, totalPages });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product retrieved successfully', product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { name, description, price, category, quantity } = req.body;
  const host = `${req.protocol}://${req.get('host')}`;
  const files = req.files as Express.Multer.File[];

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

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

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  try {
    const product: IProduct | null = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully', product });
  } catch (err) {
    next(err);
  }
};

export const addProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const host = `${req.protocol}://${req.get('host')}`;
  const files = req.files as Express.Multer.File[];

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const imageArray = files.map((file) => ({
      url: `${host}/uploads/products/${file.filename}`,
      isDefault: false
    }));

    if (imageArray.length > 0) imageArray[0].isDefault = true;

    product.images.push(...imageArray);
    await product.save();

    res.status(200).json({ message: 'Product images added successfully', product });
  } catch (err) {
    next(err);
  }
};

export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { imageId } = req.body;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const index = product.images.findIndex((img: IProductImage) => img._id.toString() === imageId);
    if (index === -1) return res.status(404).json({ message: 'Image not found' });

    product.images.splice(index, 1);
    await product.save();

    res.status(200).json({ message: 'Product image deleted successfully', product });
  } catch (err) {
    next(err);
  }
};

export const setDefaultProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { imageId } = req.body;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const index = product.images.findIndex((img: IProductImage) => img._id.toString() === imageId);
    if (index === -1) return res.status(404).json({ message: 'Image not found' });

    product.images.forEach((img) => (img.isDefault = false));
    product.images[index].isDefault = true;

    await product.save();
    res.status(200).json({ message: 'Default product image set successfully', product });
  } catch (err) {
    next(err);
  }
};

export const submitProductReview = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = (req as any).user?.id;

  try {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

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
    res.status(200).json({ message: 'Product review submitted successfully', product });
  } catch (err) {
    next(err);
  }
};

export const getTopRatedProducts = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().sort({ averageRating: -1 }).skip(skip).limit(limit).lean();

    res.status(200).json({ message: 'Top-rated products retrieved successfully', products });
  } catch (err) {
    next(err);
  }
};
