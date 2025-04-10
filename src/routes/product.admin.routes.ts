import { query, Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  setDefaultProductImage
} from '../controllers/product.controller';
import { validate } from '../middlewares/validation';
import { createProductValidation, productIdValidation, productImageIdValidation, updateProductValidation } from '../validations/product.validation';
import { authorization, authenticate } from '../middlewares/authMiddleware';
import { upload } from '../utils/uploadFiles/product.upload';
import { validateUploadedImages } from '../validations/fileValidator';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(authorization('admin'));

router.post('/', upload.array('images'), validate(createProductValidation, 'body'), validateUploadedImages, createProduct);
router.put('/:productId', validate(productIdValidation, 'params'), validate(updateProductValidation, 'body'), updateProduct);
router.delete('/:productId', validate(productIdValidation, 'params'), deleteProduct);
router.post('/:productId/images', upload.array('images'), validate(productIdValidation, 'params'), validateUploadedImages, addProductImage);
router.delete('/:productId/images', validate(productImageIdValidation, 'params'), deleteProductImage);
router.put('/:productId/images', validate(productImageIdValidation, 'params'), setDefaultProductImage);

export default router;
