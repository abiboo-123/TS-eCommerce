import { query, Router } from 'express';
import { register, login, refreshToken, forgetPassword, resetPassword, changePassword } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import {
  registerValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator
} from '../validations/authValidation';
import { authorization, authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', validate(registerValidator, 'body'), register);

router.post('/login', validate(loginValidator, 'body'), login);

router.get('/refresh-token', refreshToken);

router.post('/forget-password', validate(forgetPasswordValidator, 'body'), forgetPassword);

router.post('/reset-password', validate(resetPasswordValidator, 'body'), resetPassword);

router.put('/change-password', validate(changePasswordValidator, 'body'), authenticate, changePassword);

export default router;
