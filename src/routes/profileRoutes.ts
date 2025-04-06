import { query, Router } from 'express';
import {
  addAddress,
  createProfile,
  deleteAddress,
  getAllAddresses,
  getProfile,
  updateAddress,
  updateProfile
} from '../controllers/profileController';
import { validate } from '../middlewares/validation';
import {
  addAddressValidator,
  addressIdValidator,
  createProfileValidator,
  updateAddressValidator,
  updateProfileValidator
} from '../validations/profileValidation';
import { authorization, authenticate } from '../middlewares/authMiddleware';
import { upload } from '../utils/multer';

const router = Router();

router.use(authenticate);
router.use(authorization('consumer'));

router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }]), validate(createProfileValidator, 'body'), createProfile);
router.get('/', getProfile);
router.put('/', upload.fields([{ name: 'photo', maxCount: 1 }]), validate(updateProfileValidator, 'body'), updateProfile);

router.post('/addresses', validate(addAddressValidator, 'body'), addAddress);
router.get('/addresses', getAllAddresses);
router.put('/addresses/:addressId', validate(addressIdValidator, 'params'), validate(updateAddressValidator, 'body'), updateAddress);
router.delete('/addresses/:addressId', validate(addressIdValidator, 'params'), deleteAddress);

export default router;
