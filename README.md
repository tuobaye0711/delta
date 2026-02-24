# 三角洲子弹价格监控平台

> 🎯 专业的子弹价格监控和交易辅助工具
> 🐼 作者：盼盼
> 📅 创建时间：2026-02-24

---

## 🌟 项目简介

这是一个为《三角洲行动》玩家设计的子弹价格监控平台，帮助玩家：

- 📊 **实时监控** - 多弹种价格实时更新
- 📈 **趋势分析** - 查看价格历史曲线
- 💼 **持仓管理** - 记录交易，计算利润
- 🎯 **目标提醒** - 设置回本线和止盈止损价
- 💡 **智能推荐** - 基于数据的买入卖出建议（V2.0）

---

## 📋 项目文档

- [📊 市场调研报告](RESEARCH.md) - 倒子弹生态分析
- [📝 产品设计文档](PRODUCT_DESIGN.md) - 功能和界面设计
- [🚀 项目总结](PROJECT_SUMMARY.md) - 已完成工作说明

---

## 🎬 快速开始

### 方式一：手动启动

```bash
# 1. 安装后端依赖
cd backend
npm install

# 2. 初始化数据库
npx prisma generate
npx prisma migrate dev --name init

# 3. 启动后端（端口 3000）
npm run dev

# 4. 在另一个终端，初始化弹种数据
curl -X POST http://localhost:3000/api/bullets/init

# 5. 安装前端依赖
cd ../frontend
npm install

# 6. 启动前端（端口 5173）
npm run dev
```

访问 http://localhost:5173

---

### 方式二：使用启动脚本（推荐）

```bash
# 在项目根目录执行
chmod +x start.sh  # Linux/Mac
./start.sh
```

或者 Windows：
```bash
start.bat
```

---

## 📸 功能截图

### 仪表盘
- 实时价格卡片
- 价格趋势图
- 持仓概览
- 今日预警

### 弹种详情
- 详细价格信息
- 历史曲线图
- 目标价格设置

### 持仓管理
- 交易记录管理
- 利润实时计算
- 卖出快捷操作

---

## 🏗️ 技术栈

### 后端
- Node.js (TypeScript)
- Express.js
- SQLite + Prisma
- node-cron
- Axios + Cheerio

### 前端
- Vue 3 + Vite
- Element Plus
- ECharts
- Pinia
- Vue Router

---

## 📊 数据库结构

### 表结构

| 表名 | 说明 |
|------|------|
| bullet_types | 弹种类型 |
| price_history | 价格历史 |
| user_transactions | 交易记录 |
| user_targets | 目标价格 |

---

## 🔌 API 接口

### 弹种相关
- `GET /api/bullets` - 获取所有弹种
- `GET /api/bullets/:id` - 获取弹种详情
- `GET /api/bullets/:id/history` - 获取价格历史
- `POST /api/bullets/init` - 初始化弹种数据

### 交易相关
- `GET /api/transactions` - 获取交易记录
- `POST /api/transactions` - 添加交易记录
- `DELETE /api/transactions/:id` - 删除交易记录
- `GET /api/transactions/summary` - 获取持仓统计

### 目标价相关
- `GET /api/targets` - 获取目标价
- `POST /api/targets` - 添加目标价
- `DELETE /api/targets/:id` - 删除目标价
- `GET /api/targets/check` - 检查目标触发

---

## ⚙️ 配置说明

### 后端配置 (backend/.env)
```
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
```

### 前端配置
代理配置在 `frontend/vite.config.ts` 中，默认代理到 `http://localhost:3000`

---

## 🎯 核心功能说明

### 1. 实时价格监控
显示所有弹种的当前价格和涨跌幅，数据每分钟自动刷新。

### 2. 价格历史曲线
支持 6小时、24小时、7天三个时间维度，ECharts 图表展示。

### 3. 持仓管理
- 添加买入/卖出记录
- 自动计算平均成本
- 实时计算未实现利润
- 支持多弹种持仓

### 4. 目标价格
- 设置止盈价格
- 设置止损价格
- 价格触发时提醒

### 5. 数据刷新
- 仪表盘每分钟自动刷新
- 支持手动刷新按钮
- 可配置刷新频率

---

## 🔜 后续计划

### V1.1（近期）
- [ ] 实际爬虫实现
- [ ] 定时任务调度
- [ ] 预警通知系统

### V2.0（中期）
- [ ] 用户账号系统
- [ ] 智能推荐算法
- [ ] 数据导出功能

### V3.0（远期）
- [ ] 移动端 App
- [ ] 社区分享功能
- [ ] 交易机器人

---

## ⚠️ 重要提示

### 数据来源
当前使用模拟数据，实际爬虫需要根据目标网站结构实现。

### 风险提示
倒子弹有风险，价格波动可能造成损失，请谨慎操作。

### 隐私说明
所有数据存储在本地 SQLite 数据库，不会上传到云端。

---

## 🤝 贡献指南

欢迎提出建议和改进！

1. Fork 本项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

---

## 📄 许可证

MIT License

---

## 💖 致谢

感谢淡淡提出这个有趣的项目需求！

希望这个工具能帮助你更好地倒子弹赚钱 🚀

---

Made with 💖 by 盼盼 🐼

如有问题或建议，欢迎随时沟通～
