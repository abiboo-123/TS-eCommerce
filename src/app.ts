import express from 'express';
import dotenv from 'dotenv';
import { setupSwaggerDocs } from './utils/swaggerDocs';
import connectDB from './config/mongoDB';
import router from './routes/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

setupSwaggerDocs(app);

app.get('/ping', (_, res) => {
  res.json({ message: 'pong' });
});

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
