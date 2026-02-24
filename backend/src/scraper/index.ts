import axios from 'axios';
import * as cheerio from 'cheerio';

// 模拟数据（实际爬虫需要根据网站结构实现）
export const scrapeJbskins = async () => {
  try {
    // TODO: 实现真正的爬虫逻辑
    // const response = await axios.get('https://sjz.jbskins.com/item/index/');
    // const $ = cheerio.load(response.data);
    // ...

    // 返回模拟数据
    return [
      { name: 'AWM .338AP', price: 120000 },
      { name: '9×19 RIP', price: 638 },
      { name: 'AP40 穿甲弹', price: 450 },
      { name: '金弹', price: 5200 },
      { name: '5.56mm 普通弹', price: 35 },
      { name: '7.62mm 普通弹', price: 42 },
    ];
  } catch (error) {
    console.error('Error scraping jbskins:', error);
    return [];
  }
};

// 定时任务
export const startScraper = () => {
  console.log('🕷️ Scraper started (every 5 minutes)');

  setInterval(async () => {
    console.log('📊 Scraping prices...');

    const prices = await scrapeJbskins();

    console.log(`✅ Scraped ${prices.length} bullet prices`);
  }, 5 * 60 * 1000); // 5 分钟
};
