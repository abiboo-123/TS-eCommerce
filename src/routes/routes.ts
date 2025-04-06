import { query, Router } from 'express';
import authRouter from './authRoutes';
import profileRouter from './profileRoutes';

const router = Router();

router.use('/auth', authRouter);
router.use('/profiles', profileRouter);

export default router;
