import { query, Router } from 'express';
import { getAllProducts, getProductById, productSearch, getTopRatedProducts, submitProductReview } from '../controllers/product.controller';
import { validate } from '../middlewares/validation';
import { productIdValidation, productSearchValidation, productReviewValidation } from '../validations/product.validation';
import { authorization, authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', validate(productSearchValidation, 'query'), getAllProducts);
router.get('/top-rated', validate(productSearchValidation, 'query'), getTopRatedProducts);
router.get('/:productId', validate(productIdValidation, 'params'), getProductById);
router.post('/:productId/review', validate(productIdValidation, 'params'), validate(productReviewValidation, 'body'), submitProductReview);
router.get('/search', validate(productSearchValidation, 'query'), productSearch);

export default router;
