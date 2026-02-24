import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bulletRoutes from './api/bullets';
import transactionRoutes from './api/transactions';
import targetRoutes from './api/targets';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bullets', bulletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/targets', targetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}/api/bullets`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
