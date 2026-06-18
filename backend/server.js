import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';


dotenv.config();


connectDB();

const app = express();


app.use(express.json());


app.use('/api/users', userRoutes);


app.use('/api/products', productRoutes);


app.use('/api/orders', orderRoutes);


app.use('/api/wishlist', wishlistRoutes);


app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend server za prodavnicu zdrave hrane je uspešno pokrenut.',
    timestamp: new Date()
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});
