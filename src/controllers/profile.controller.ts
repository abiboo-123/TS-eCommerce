import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';

export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber } = req.body;
  const id: string | undefined = req.user?.id;
  const host = `${req.protocol}://${req.get('host')}`;

  try {
    let imagePath;

    if (req.file?.filename) imagePath = `${host}/uploads/profile/${req.file?.filename}`;

    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.phoneNumber) {
      return res.status(400).json({ message: 'Profile already exists. Use update instead.' });
    }

    Object.assign(user, {
      phoneNumber,
      profileImage: imagePath
    });

    await user.save();

    const { password, otp, otpExpiration, ...safeUser } = user.toObject();
    res.status(200).json({ message: 'Profile completed', user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?.id;

  try {
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, otp, otpExpiration, ...safeUser } = user.toObject();

    res.status(200).json({ message: 'Profile retrieved successfully', user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, phoneNumber, removeProfileImage } = req.body;
  const id = req.user?.id;
  const host = `${req.protocol}://${req.get('host')}`;

  try {
    let imagePath;

    if (req.file?.filename) imagePath = `${host}/uploads/profile/${req.file?.filename}`;
    if (removeProfileImage) imagePath = '';

    const user: IUser | null = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, {
      ...(phoneNumber && { phoneNumber }),
      ...(name && { name }),
      ...(removeProfileImage ? { profileImage: undefined } : imagePath ? { profileImage: imagePath } : {})
    });

    await user.save();

    const { password, otp, otpExpiration, ...safeUser } = user.toObject();
    res.status(200).json({ message: 'Profile updated successfully', user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  const { street, houseNumber, postalCode, isDefault } = req.body;
  const userId = req.user?.id;

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Unset all other defaults if this one is default
    if (isDefault) {
      user.address?.forEach((addr) => (addr.isDefault = false));
    }
    // Push new address
    user.address.push({ street, houseNumber, postalCode, isDefault });
    await user.save();

    const addedAddress = user.address[user.address.length - 1];

    res.status(201).json({
      message: 'Address added successfully',
      address: addedAddress
    });
  } catch (err) {
    next(err);
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const addressId = req.params.addressId;
  const { street, houseNumber, postalCode, isDefault } = req.body;

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.address.id(addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    // Unset all others if this one becomes default
    if (isDefault) {
      user.address.forEach((addr) => {
        if (addr._id.toString() !== addressId) addr.isDefault = false;
      });
    }

    // Update fields if provided
    if (street !== undefined) address.street = street;
    if (houseNumber !== undefined) address.houseNumber = houseNumber;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.status(200).json({
      message: 'Address updated successfully',
      address
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAddresses = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  try {
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sorted = [...(user.address || [])].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    res.status(200).json({ addresses: sorted });
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const addressId = req.params.addressId;

  try {
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.address.id(addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    user.address.pull(addressId);
    await user.save();

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    next(err);
  }
};
