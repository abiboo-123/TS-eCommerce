import { query, Router } from 'express';
import {
  getAllUsers,
  addProductImage,
  createCoupon,
  deleteCoupon,
  deleteProduct,
  getAllCoupons,
  createProduct,
  deleteProductImage,
  getAllOrders,
  getCouponByIdOrCode,
  getDashboardStatistics,
  getOrderById,
  getUserById,
  updateCoupon,
  updateProduct,
  setDefaultProductImage,
  updateOrderStatus,
  updateUserRole
} from '../controllers/admin.controller';
import { validate } from '../middlewares/validation';
import {
  userIdValidation,
  updateUserRoleValidation,
  orderIdValidation,
  updateOrderStatusValidation,
  createCouponValidation,
  couponParamValidation,
  updateCouponValidation,
  getUserValidation,
  getCouponValidation
} from '../validations/admin.validation';
import {
  createProductValidation,
  productIdValidation,
  productImageIdValidation,
  updateProductValidation,
  productSearchValidation
} from '../validations/product.validation';
import { authorization, authenticate } from '../middlewares/authMiddleware';
import { upload } from '../utils/uploadFiles/product.upload';
import { validateUploadedImages } from '../validations/fileValidator';
import { getOrderValidation } from '../validations/orders.validation';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(authorization('admin'));

// Product Routes
router.post('/', upload.array('images'), validate(createProductValidation, 'body'), validateUploadedImages, createProduct);
router.put('/:productId', validate(productIdValidation, 'params'), validate(updateProductValidation, 'body'), updateProduct);
router.delete('/:productId', validate(productIdValidation, 'params'), deleteProduct);
router.post('/:productId/images', upload.array('images'), validate(productIdValidation, 'params'), validateUploadedImages, addProductImage);
router.delete('/:productId/images', validate(productImageIdValidation, 'params'), deleteProductImage);
router.put('/:productId/images', validate(productImageIdValidation, 'params'), setDefaultProductImage);

// User Routes
router.get('/users', validate(getUserValidation, 'query'), getAllUsers);
router.get('/users/:userId', validate(userIdValidation, 'params'), getUserById);
router.put('/users/:userId', validate(userIdValidation, 'params'), validate(updateUserRoleValidation, 'body'), updateUserRole);

// Order Routes
router.get('/orders', validate(getOrderValidation, 'query'), getAllOrders);
router.get('/orders/:orderId', validate(orderIdValidation, 'params'), getOrderById);
router.put('/orders/:orderId', validate(orderIdValidation, 'params'), validate(updateOrderStatusValidation), updateOrderStatus);

// Coupon Routes
router.post('/coupons', validate(createCouponValidation, 'body'), createCoupon);
router.get('/coupons', validate(getCouponValidation, 'query'), getAllCoupons);
router.get('/coupons/:couponIdOrCode', validate(couponParamValidation, 'params'), getCouponByIdOrCode);
router.put('/coupons/:couponIdOrCode', validate(couponParamValidation, 'params'), validate(updateCouponValidation, 'body'), updateCoupon);
router.delete('/coupons/:couponIdOrCode', validate(couponParamValidation, 'params'), deleteCoupon);

// Dashboard Statistics
router.get('/dashboard/statistics', getDashboardStatistics);

export default router;
