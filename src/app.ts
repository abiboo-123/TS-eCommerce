import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { setupSwaggerDocs } from './utils/swaggerDocs';
import connectDB from './config/mongoDB';
import { AppError } from './utils/AppError';
import logger from './utils/logger';
import router from './routes/routes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

setupSwaggerDocs(app);
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/', router);

// connect to the database
connectDB()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  logger.error(`[${req.method}] ${req.originalUrl} → ${message}`);

  res.status(statusCode).json({
    status: 'error',
    message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
