import express from 'express';
import dotenv from 'dotenv';
import { setupSwaggerDocs } from './utils/swaggerDocs';
import connectDB from './config/mongoDB';
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
