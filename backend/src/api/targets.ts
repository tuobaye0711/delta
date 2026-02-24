import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取所有目标价
router.get('/', async (req, res) => {
  try {
    const { userId = 'default' } = req.query;

    const targets = await prisma.userTarget.findMany({
      where: { userId: String(userId), isActive: true },
      include: {
        bullet: true,
      },
    });

    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
});

// 添加目标价
router.post('/', async (req, res) => {
  try {
    const { userId = 'default', bulletId, targetType, targetPrice } = req.body;

    const target = await prisma.userTarget.create({
      data: {
        userId,
        bulletId: parseInt(bulletId),
        targetType, // profit / loss
        targetPrice: parseFloat(targetPrice),
      },
      include: {
        bullet: true,
      },
    });

    res.json(target);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create target' });
  }
});

// 删除目标价
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.userTarget.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Target deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete target' });
  }
});

// 检查目标是否触发
router.get('/check', async (req, res) => {
  try {
    const { userId = 'default' } = req.query;

    const targets = await prisma.userTarget.findMany({
      where: { userId: String(userId), isActive: true },
      include: {
        bullet: {
          include: {
            priceHistory: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const triggered = [];

    for (const target of targets) {
      const currentPrice = target.bullet.priceHistory[0]?.price || 0;

      let isTriggered = false;
      if (target.targetType === 'profit' && currentPrice >= target.targetPrice) {
        isTriggered = true;
      } else if (target.targetType === 'loss' && currentPrice <= target.targetPrice) {
        isTriggered = true;
      }

      if (isTriggered) {
        triggered.push({
          target,
          currentPrice,
          message: `${target.bullet.name} 价格 ${target.targetType === 'profit' ? '已达到' : '跌破'}目标价 ${target.targetPrice}！`,
        });
      }
    }

    res.json(triggered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check targets' });
  }
});

export default router;
