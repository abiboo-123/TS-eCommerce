import { query, Router } from 'express';
import { cancelOrder, getOrderById, getOrders, returnOrder } from '../controllers/orders.controller';
import { validate } from '../middlewares/validation';
import { getOrderValidation, orderIdValidation } from '../validations/orders.validation';
import { authorization, authenticate } from '../middlewares/authMiddleware';

const router = Router({});

router.use(authenticate);
router.use(authorization('consumer'));

router.get('/', validate(getOrderValidation, 'query'), getOrders);

router.get('/:orderId', validate(orderIdValidation, 'params'), getOrderById);

router.post('/:orderId/cancel', validate(orderIdValidation, 'params'), cancelOrder);

router.post('/:orderId/return', validate(orderIdValidation, 'params'), returnOrder);

export default router;
