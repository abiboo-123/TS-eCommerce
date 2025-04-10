import { query, Router } from 'express';
import {
  addAddress,
  createProfile,
  deleteAddress,
  getAllAddresses,
  getProfile,
  updateAddress,
  updateProfile
} from '../controllers/profile.controller';
import { validate } from '../middlewares/validation';
import {
  addAddressValidator,
  addressIdValidator,
  createProfileValidator,
  updateAddressValidator,
  updateProfileValidator
} from '../validations/profile.validation';
import { authorization, authenticate } from '../middlewares/authMiddleware';
import { upload } from '../utils/uploadFiles/profile.upload';
import { validateUploadedImages } from '../validations/fileValidator';

const router = Router();

router.use(authenticate);
router.use(authorization('consumer'));

router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }]), validate(createProfileValidator, 'body'), validateUploadedImages, createProfile);
router.get('/', getProfile);
router.put('/', upload.fields([{ name: 'photo', maxCount: 1 }]), validate(updateProfileValidator, 'body'), validateUploadedImages, updateProfile);

router.post('/addresses', validate(addAddressValidator, 'body'), addAddress);
router.get('/addresses', getAllAddresses);
router.put('/addresses/:addressId', validate(addressIdValidator, 'params'), validate(updateAddressValidator, 'body'), updateAddress);
router.delete('/addresses/:addressId', validate(addressIdValidator, 'params'), deleteAddress);

export default router;
