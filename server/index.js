import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import swapRoutes from './routes/swapRoutes.js';

const app = express();

app.use(cors({
  origin: 'https://slot-swapper-tq9b.vercel.app',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
