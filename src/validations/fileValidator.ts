import { Request, Response, NextFunction } from 'express';

export const validateUploadedImages = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const singleFile = req.file as Express.Multer.File | undefined;

  if (!files?.length && !singleFile) {
    return res.status(400).json({ message: 'At least one image must be uploaded.' });
  }

  const fileArray = (files || [singleFile]).filter((f): f is Express.Multer.File => f !== undefined);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxFileSize = 5 * 1024 * 1024;

  for (const file of fileArray) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: `Invalid file type: ${file.originalname}` });
    }

    if (file.size > maxFileSize) {
      return res.status(400).json({ message: `File too large: ${file.originalname}` });
    }
  }

  next();
};
