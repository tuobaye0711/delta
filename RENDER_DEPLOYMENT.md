# Render 后端部署指南

> 📀 将后端 API 部署到 Render

---

## 为什么选择 Render？

- ✅ **免费额度**：每月 750 小时
- ✅ **简单易用**：类似 Heroku 的部署体验
- ✅ **支持多种语言**：Node.js、Python 等
- ✅ **自动部署**：Git 推送自动构建
- ✅ **SSL 证书**：自动提供 HTTPS
- ✅ **PostgreSQL**：提供托管数据库

---

## 方案 A：使用 Render PostgreSQL（推荐）

### 第一步：注册 Render

1. 访问 https://render.com 注册账号
2. 使用 GitHub、GitLab 或邮箱登录

### 第二步：创建 PostgreSQL 数据库

1. 登录后点击 "New +"
2. 选择 "PostgreSQL"
3. 配置数据库：
   - **Name**: `delta-force-db`
   - **Database**: `delta_force`
   - **User**: `delta_user`
   - **Region**: 选择 Singapore（离国内近）
4. 点击 "Create Database"
5. 等待数据库创建完成（约 1-2 分钟）
6. 复制数据库连接字符串（Internal Database URL）

**连接字符串格式**：
```
postgresql://delta_user:password@dpg-xxx.oregon-postgres.render.com:5432/delta_force
```

### 第三步：修改数据库配置

编辑 `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // 从 sqlite 改为 postgresql
  url      = env("DATABASE_URL")
}
```

### 第四步：安装 PostgreSQL 客户端

```bash
cd backend
npm install pg
```

### 第五步：修改后端代码

编辑 `backend/src/index.ts`:

```typescript
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
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: https://your-service.onrender.com/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
  });
});
```

### 第六步：更新 package.json

确保 `backend/package.json` 有正确的脚本：

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "postinstall": "npx prisma generate"
  }
}
```

### 第七步：创建 Render Web Service

1. 在 Render 点击 "New +"
2. 选择 "Web Service"
3. 连接你的 Git 仓库
4. 配置服务：
   - **Name**: `delta-force-api`
   - **Environment**: `Node`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. 添加环境变量：
   ```
   DATABASE_URL = postgresql://delta_user:password@dpg-xxx.oregon-postgres.render.com:5432/delta_force
   NODE_ENV = production
   PORT = 3000
   ```
6. 点击 "Create Web Service"
7. 等待部署完成（约 3-5 分钟）

### 第八步：运行数据库迁移

#### 方法 A：通过 Render Shell（推荐）

1. 在 Render Web Service 页面点击 "Shell"
2. 运行以下命令：
   ```bash
   npx prisma migrate deploy
   ```

#### 方法 B：通过本地连接

```bash
export DATABASE_URL="postgresql://delta_user:password@dpg-xxx.oregon-postgres.render.com:5432/delta_force"
cd backend
npx prisma migrate deploy
```

### 第九步：初始化弹种数据

#### 方法 A：通过 Render Shell

1. 进入 Render Web Service 的 Shell
2. 运行：
   ```bash
   curl -X POST http://localhost:3000/api/bullets/init
   ```

#### 方法 B：通过外部访问

```bash
curl -X POST https://delta-force-api.onrender.com/api/bullets/init
```

### 第十步：测试 API

访问：
- https://delta-force-api.onrender.com/health
- https://delta-force-api.onrender.com/api/bullets

---

## 方案 B：使用外部数据库

如果你想使用其他数据库提供商（如 Supabase），步骤类似：

### 1. 创建数据库

选择一个提供商：
- Supabase（推荐）：https://supabase.com
- Neon：https://neon.tech
- Railway：https://railway.app

### 2. 获取连接字符串

从数据库提供商获取 PostgreSQL 连接字符串。

### 3. 在 Render 配置环境变量

在 Render Web Service 中添加：
```
DATABASE_URL = postgresql://user:password@host:5432/database
```

其余步骤与方案 A 相同。

---

## 环境变量配置

在 Render Web Service 中添加以下环境变量：

| 变量名 | 说明 | 示例 |
|-------|------|------|
| DATABASE_URL | PostgreSQL 连接字符串 | `postgresql://user:password@host:5432/db` |
| NODE_ENV | 运行环境 | `production` |
| PORT | 端口号（可选） | `3000` |

---

## 自动重新部署

Render 会在以下情况自动重新部署：
- 推送新代码到 Git
- 修改环境变量
- 手动触发重新部署

也可以手动点击 "Manual Deploy" 按钮。

---

## 监控和日志

### 查看日志

1. 进入 Render Web Service 页面
2. 点击 "Logs" 标签
3. 查看实时日志

### 查看指标

1. 进入 Render Web Service 页面
2. 点击 "Metrics" 标签
3. 查看 CPU、内存、响应时间等指标

---

## 成本

### Render 免费计划

- Web Service：
  - 750 小时/月
  - 512MB RAM
  - 0.1 CPU
  - 免费但会休眠（15 分钟无访问）

- PostgreSQL：
  - 90 天免费试用
  - 之后 $7/月

### 升级到付费

如果需要 24/7 运行：
- Starter: $7/月（512MB RAM，24/7）
- Standard: $25/月（1GB RAM，24/7）

---

## 常见问题

### Q1: 部署失败，提示 "Cannot find module"

**A**: 检查 `package.json` 的依赖是否正确，确保安装了所有依赖。

### Q2: 数据库连接失败

**A**: 检查以下几点：
- `DATABASE_URL` 环境变量是否正确
- 数据库是否允许外部连接
- 防火墙规则是否正确

### Q3: 服务休眠问题

**A**: 免费计划会休眠，解决方案：
- 升级到付费计划（$7/月）
- 使用健康检查保持活跃（需要外部服务）

### Q4: 如何保持服务 24/7 运行？

**A**: 升级到 Starter 计划（$7/月）即可 24/7 运行。

### Q5: 如何备份数据库？

**A**: Render 自动备份 PostgreSQL 数据库（每天）。
手动备份：
```bash
pg_dump $DATABASE_URL > backup.sql
```

---

## 连接前端和后端

### 修改前端 API 配置

编辑 `frontend/src/api/index.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://delta-force-api.onrender.com/api'  // Render 后端地址
    : '/api',  // 开发环境使用代理
  timeout: 10000,
});

// ... 其余代码
```

### 或者使用环境变量

在 Vercel 项目设置中添加：
```
VITE_API_URL = https://delta-force-api.onrender.com/api
```

然后在代码中使用：
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});
```

---

## 总结

部署后端到 Render 的步骤：

1. ✅ 注册 Render
2. ✅ 创建 PostgreSQL 数据库
3. ✅ 修改数据库配置为 PostgreSQL
4. ✅ 修改后端代码以适配 Render
5. ✅ 推送代码到 Git
6. ✅ 在 Render 创建 Web Service
7. ✅ 配置环境变量
8. ✅ 运行数据库迁移
9. ✅ 初始化弹种数据
10. ✅ 测试 API

---

## 需要帮助？

- Render 文档：https://render.com/docs
- PostgreSQL 文档：https://www.postgresql.org/docs

如有问题，随时联系我～

---

Made with 💖 by 盼盼 🐼
