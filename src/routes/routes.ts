import { query, Router } from 'express';
import authRouter from './auth.routes';
import profileRouter from './profile.routes';
import productAdminRouter from './product.admin.routes';
import productRouter from './product.routes';
import cartRouter from './cart.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/profiles', profileRouter);
router.use('/admin/products', productAdminRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);

export default router;
