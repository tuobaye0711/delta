# 开发文档

> 📝 开发过程中的重要信息记录

---

## 项目进度

### ✅ 已完成

#### 阶段一：生态调研
- [x] 市场调研报告
- [x] 倒子弹生态分析
- [x] 价格波动规律研究

#### 阶段二：产品设计
- [x] 产品设计文档
- [x] 数据库设计
- [x] 技术栈选择

#### 阶段三：开发实施
- [x] 后端框架搭建
- [x] 前端框架搭建
- [x] API 接口开发
- [x] 前端页面开发
- [x] 核心功能实现

### ⏳ 待完成

#### 阶段四：测试优化
- [ ] 功能测试
- [ ] 数据准确性验证
- [ ] 用户体验优化

---

## 技术实现细节

### 后端 API

#### 1. 弹种 API (`/api/bullets`)
- `GET /` - 获取所有弹种及当前价格
- `GET /:id` - 获取单个弹种详情
- `GET /:id/history` - 获取价格历史
- `POST /init` - 初始化弹种数据
- `POST /:id/price` - 添加价格记录

#### 2. 交易 API (`/api/transactions`)
- `GET /` - 获取所有交易记录
- `POST /` - 添加交易记录
- `DELETE /:id` - 删除交易记录
- `GET /summary` - 获取持仓统计

#### 3. 目标价 API (`/api/targets`)
- `GET /` - 获取所有目标价
- `POST /` - 添加目标价
- `DELETE /:id` - 删除目标价
- `GET /check` - 检查目标是否触发

### 前端页面

#### 1. 仪表盘 (Dashboard.vue)
- 弹种价格卡片
- 价格趋势图
- 持仓概览
- 今日预警

#### 2. 弹种列表 (Bullets.vue)
- 所有弹种列表
- 涨跌幅显示
- 详情跳转

#### 3. 弹种详情 (BulletDetail.vue)
- 详细信息展示
- 历史曲线图
- 目标价格设置

#### 4. 持仓管理 (Positions.vue)
- 交易记录管理
- 持仓统计
- 利润计算

#### 5. 设置 (Settings.vue)
- 刷新频率配置
- 提醒开关
- 数据管理

---

## 数据模型

### BulletType（弹种类型）
```typescript
{
  id: number;
  name: string;
  level: number;
  description: string | null;
  isHot: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### PriceHistory（价格历史）
```typescript
{
  id: number;
  bulletId: number;
  price: number;
  source: string;
  createdAt: Date;
}
```

### UserTransaction（用户交易）
```typescript
{
  id: number;
  userId: string;
  bulletId: number;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  note: string | null;
  createdAt: Date;
}
```

### UserTarget（目标价格）
```typescript
{
  id: number;
  userId: string;
  bulletId: number;
  targetType: 'profit' | 'loss';
  targetPrice: number;
  isActive: boolean;
  createdAt: Date;
}
```

---

## 爬虫实现计划

### 数据源 1：jbskins.com
- URL: https://sjz.jbskins.com/item/index/
- 方法：爬虫
- 频率：每 5 分钟

### 数据源 2：deltaforce.build
- URL: https://www.deltaforce.build/poach
- 方法：爬虫或 API
- 频率：每 10 分钟

### 数据源 3：kkrb.net
- URL: https://www.kkrb.net/
- 方法：爬虫
- 频率：每 15 分钟

### 实现步骤
1. 分析目标网站 HTML 结构
2. 使用 Cheerio 解析价格数据
3. 写入数据库
4. 异常处理和重试机制
5. 反爬策略处理

---

## 智能推荐算法（V2.0）

### 1. 价格低位检测
- 比较当前价格与 N 小时最低价
- 计算偏离度
- 给出买入建议

### 2. 涨势识别
- 连续 N 次价格上涨
- 涨幅超过阈值
- 给出持有建议

### 3. 时间窗口分析
- 凌晨 2 点（低谷）
- 晚上 9 点（高峰）
- 双休日周抛
- 活动期间

---

## 已知问题

1. **数据源爬虫**：当前使用模拟数据，实际爬虫需要根据目标网站调整
2. **价格预警**：提醒功能已实现，但通知方式待扩展（如邮件、短信）
3. **用户系统**：当前使用默认用户，V2.0 将增加登录注册

---

## 优化建议

### 性能优化
- 数据库索引优化
- API 响应缓存
- 前端组件懒加载

### 用户体验
- 加载动画优化
- 错误提示更友好
- 移动端适配

### 功能增强
- 数据导出（Excel/CSV）
- 更多图表类型
- 自定义弹种

---

## 测试计划

### 功能测试
- [ ] API 接口测试
- [ ] 前端页面测试
- [ ] 数据准确性验证

### 性能测试
- [ ] 并发请求测试
- [ ] 大数据量测试
- [ ] 响应时间测试

### 兼容性测试
- [ ] 浏览器兼容性
- [ ] 移动端适配
- [ ] 不同分辨率

---

## 部署计划

### 开发环境
- 本地 SQLite 数据库
- 本地 Node.js 服务

### 生产环境（未来）
- 云服务器部署
- PostgreSQL 数据库
- Nginx 反向代理
- HTTPS 证书

---

## 贡献指南

### 代码风格
- TypeScript 类型严格
- ESLint 规则
- 注释清晰

### 提交规范
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
- chore: 构建

---

## 联系方式

如有问题或建议，请联系：
- 作者：盼盼 🐼
- 创建日期：2026-02-24

---

## 版本历史

### v1.0.0 (2026-02-24)
- ✅ 完成项目基础架构
- ✅ 实现核心功能
- ✅ 完成 MVP 版本

### v1.1.0 (计划中)
- 🔄 实际爬虫实现
- 🔄 定时任务调度
- 🔄 预警通知系统

### v2.0.0 (计划中)
- ⏳ 用户账号系统
- ⏳ 智能推荐算法
- ⏳ 数据导出功能

---

Made with 💖 by 盼盼 🐼
