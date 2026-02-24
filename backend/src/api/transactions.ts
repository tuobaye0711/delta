import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取所有交易记录
router.get('/', async (req, res) => {
  try {
    const { userId = 'default' } = req.query;

    const transactions = await prisma.userTransaction.findMany({
      where: { userId: String(userId) },
      include: {
        bullet: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// 添加交易记录
router.post('/', async (req, res) => {
  try {
    const { userId = 'default', bulletId, action, quantity, price, note } = req.body;

    const total = quantity * price;

    const transaction = await prisma.userTransaction.create({
      data: {
        userId,
        bulletId: parseInt(bulletId),
        action, // buy / sell
        quantity: parseInt(quantity),
        price: parseFloat(price),
        total: parseFloat(total.toFixed(2)),
        note,
      },
      include: {
        bullet: true,
      },
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// 删除交易记录
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.userTransaction.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// 获取持仓统计
router.get('/summary', async (req, res) => {
  try {
    const { userId = 'default' } = req.query;

    const transactions = await prisma.userTransaction.findMany({
      where: { userId: String(userId) },
      include: {
        bullet: true,
      },
    });

    // 计算每种子弹的持仓
    const positions: any = {};

    for (const tx of transactions) {
      const bulletId = tx.bulletId;
      if (!positions[bulletId]) {
        positions[bulletId] = {
          bullet: tx.bullet,
          quantity: 0,
          totalCost: 0,
        };
      }

      if (tx.action === 'buy') {
        positions[bulletId].quantity += tx.quantity;
        positions[bulletId].totalCost += tx.total;
      } else if (tx.action === 'sell') {
        positions[bulletId].quantity -= tx.quantity;
      }
    }

    // 计算未实现利润
    const summary = [];

    for (const bulletId in positions) {
      const pos = positions[bulletId];
      if (pos.quantity > 0) {
        const avgCost = pos.totalCost / pos.quantity;

        // 获取当前价格
        const latestPrice = await prisma.priceHistory.findFirst({
          where: { bulletId: parseInt(bulletId) },
          orderBy: { createdAt: 'desc' },
        });

        const currentPrice = latestPrice?.price || avgCost;
        const unrealizedProfit = (currentPrice - avgCost) * pos.quantity;
        const profitPercent = avgCost > 0 ? (unrealizedProfit / pos.totalCost) * 100 : 0;

        summary.push({
          bulletId: parseInt(bulletId),
          bulletName: pos.bullet.name,
          quantity: pos.quantity,
          avgCost,
          totalCost: pos.totalCost,
          currentPrice,
          unrealizedProfit,
          profitPercent,
        });
      }
    }

    res.json({
      totalValue: summary.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0),
      totalProfit: summary.reduce((sum, item) => sum + item.unrealizedProfit, 0),
      positions: summary,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

export default router;
