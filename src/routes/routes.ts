import { query, Router } from 'express';
import authRouter from './auth.routes';
import profileRouter from './profile.routes';
import AdminRouter from './admin.routes';
import productRouter from './product.routes';
import cartRouter from './cart.routes';
import ordersRouter from './orders.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/profiles', profileRouter);
router.use('/admin', AdminRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);

export default router;
