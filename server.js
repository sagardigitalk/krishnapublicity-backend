import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dns from 'node:dns';
import connectDB from './config/db.js';

dns.setServers(['1.1.1.1', '8.8.8.8']);

// Routes
import authRoutes from './routes/authRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Krishna Publicity API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
