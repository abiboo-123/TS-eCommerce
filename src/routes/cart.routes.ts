import { query, Router } from 'express';
import { addToCart, getCart, removeFromCart, updateCartItemQuantity, clearCart, checkout } from '../controllers/cart.controller';
import { validate } from '../middlewares/validation';
import { productIdValidation, quantityValidation } from '../validations/cart.validation';
import { authorization, authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorization('consumer'));

router.post('/add', validate(productIdValidation), validate(quantityValidation), addToCart);

router.get('/', getCart);

router.delete('/remove/:productId', validate(productIdValidation, 'params'), removeFromCart);

router.put('/update/:productId', validate(productIdValidation, 'params'), validate(quantityValidation), updateCartItemQuantity);

router.delete('/clear', clearCart);

router.post('/checkout', checkout);

export default router;
