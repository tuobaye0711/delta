import axios from 'axios';

// 获取 API 基础 URL
const getBaseUrl = () => {
  // 如果设置了环境变量，使用环境变量
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 开发环境使用代理
  if (!import.meta.env.PROD) {
    return '/api';
  }

  // 生产环境默认使用 Render 后端（需要修改为你的实际地址）
  return 'https://delta-force-api.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

// 获取所有弹种
export const getBullets = () => api.get('/bullets');

// 获取弹种详情
export const getBulletDetail = (id: number) => api.get(`/bullets/${id}`);

// 获取价格历史
export const getPriceHistory = (id: number, hours: number = 24) =>
  api.get(`/bullets/${id}/history?hours=${hours}`);

// 初始化弹种数据
export const initBullets = () => api.post('/bullets/init');

// 添加价格记录
export const addPriceRecord = (id: number, data: any) =>
  api.post(`/bullets/${id}/price`, data);

// 获取所有交易记录
export const getTransactions = (userId: string = 'default') =>
  api.get(`/transactions?userId=${userId}`);

// 添加交易记录
export const addTransaction = (data: any) => api.post('/transactions', data);

// 删除交易记录
export const deleteTransaction = (id: number) => api.delete(`/transactions/${id}`);

// 获取持仓统计
export const getPositionSummary = (userId: string = 'default') =>
  api.get(`/transactions/summary?userId=${userId}`);

// 获取所有目标价
export const getTargets = (userId: string = 'default') =>
  api.get(`/targets?userId=${userId}`);

// 添加目标价
export const addTarget = (data: any) => api.post('/targets', data);

// 删除目标价
export const deleteTarget = (id: number) => api.delete(`/targets/${id}`);

// 检查目标触发
export const checkTargets = (userId: string = 'default') =>
  api.get(`/targets/check?userId=${userId}`);

export default api;
