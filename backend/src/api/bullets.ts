import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// 获取所有弹种及当前价格
router.get('/', async (req, res) => {
  try {
    const bullets = await prisma.bulletType.findMany({
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const result = bullets.map(bullet => ({
      id: bullet.id,
      name: bullet.name,
      level: bullet.level,
      currentPrice: bullet.priceHistory[0]?.price || 0,
      source: bullet.priceHistory[0]?.source || '',
      updatedAt: bullet.priceHistory[0]?.createdAt || null,
      isHot: bullet.isHot,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bullets' });
  }
});

// 获取单个弹种详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bullet = await prisma.bulletType.findUnique({
      where: { id: parseInt(id) },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    });

    if (!bullet) {
      return res.status(404).json({ error: 'Bullet not found' });
    }

    // 计算涨跌幅
    const currentPrice = bullet.priceHistory[0]?.price || 0;
    const previousPrice = bullet.priceHistory[1]?.price || currentPrice;
    const change = currentPrice - previousPrice;
    const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

    res.json({
      ...bullet,
      currentPrice,
      change,
      changePercent,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bullet details' });
  }
});

// 获取弹种价格历史
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { hours = 24 } = req.query;
    const limit = Math.min(parseInt(hours as string) * 12, 1000); // 每5分钟一个点

    const history = await prisma.priceHistory.findMany({
      where: { bulletId: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json(history.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// 初始化弹种数据
router.post('/init', async (req, res) => {
  try {
    const bullets = [
      { name: 'AWM .338AP', level: 6, description: '6级红弹，穿透顶级', isHot: true },
      { name: '9×19 RIP', level: 4, description: '4级弹，价格波动大', isHot: true },
      { name: 'AP40 穿甲弹', level: 4, description: '4级手枪弹', isHot: false },
      { name: '金弹', level: 4, description: '4级以上金弹', isHot: true },
      { name: '5.56mm 普通弹', level: 3, description: '3级普通弹', isHot: false },
      { name: '7.62mm 普通弹', level: 3, description: '3级普通弹', isHot: false },
      { name: '周抛弹', level: 3, description: '双休日需求旺', isHot: false },
    ];

    for (const bullet of bullets) {
      await prisma.bulletType.upsert({
        where: { name: bullet.name },
        update: {},
        create: bullet,
      });
    }

    res.json({ message: 'Bullets initialized successfully', count: bullets.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize bullets' });
  }
});

// 添加价格记录（用于爬虫）
router.post('/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { price, source } = req.body;

    const priceRecord = await prisma.priceHistory.create({
      data: {
        bulletId: parseInt(id),
        price: parseFloat(price),
        source: source || 'unknown',
      },
    });

    res.json(priceRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add price record' });
  }
});

export default router;
