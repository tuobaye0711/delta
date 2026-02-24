# Vercel 快速部署指南

> ⚡ 5 分钟部署到 Vercel

---

## 方案选择

### 方案 A：只部署前端（推荐，最简单）
前端部署到 Vercel，后端部署到其他平台。

**优点**：
- 配置最简单
- Vercel 免费额度够用
- 部署速度快

**缺点**：
- 需要两个部署平台
- 前后端分离

### 方案 B：全栈部署到 Vercel
前端和后端都部署到 Vercel。

**优点**：
- 单一部署平台
- 统一管理

**缺点**：
- 需要修改数据库为 PostgreSQL
- 配置较复杂
- Serverless 有冷启动问题

---

## 方案 A：只部署前端（推荐）

### 第一步：准备前端项目

Vercel 会自动识别 Vue 项目，无需额外配置。

### 第二步：推送到 Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/delta-force-tracker.git
git push -u origin main
```

### 第三步：在 Vercel 部署

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 导入你的 Git 仓库
4. 配置项目：
   - **Framework Preset**: Vue.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"

### 第四步：配置后端 API 代理

在前端项目中修改 API 代理配置。

**开发环境** (`frontend/vite.config.ts`):
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**生产环境** (修改 `frontend/src/api/index.ts`):
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://your-backend.vercel.app/api'  // 后端地址
    : '/api',  // 开发环境使用代理
  timeout: 10000,
});

// ... 其余代码
```

### 第五步：部署后端

推荐后端部署平台：
- **Render**（推荐，免费）：https://render.com
- **Railway**（免费额度）：https://railway.app
- **Fly.io**（免费额度）：https://fly.io
- **Heroku**（付费）：https://heroku.com

---

## 方案 B：全栈部署到 Vercel

### 前置要求

1. **PostgreSQL 数据库**
   - 推荐：Supabase（免费）
   - 注册：https://supabase.com
   - 创建项目后获取连接字符串

2. **修改数据库配置**

编辑 `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // 从 sqlite 改为 postgresql
  url      = env("DATABASE_URL")
}
```

3. **安装 PostgreSQL 客户端**

```bash
cd backend
npm install pg
```

### 部署步骤

#### 1. 创建 Vercel 配置

在项目根目录创建 `vercel.json`:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "http://localhost:3000/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2. 设置环境变量

在 Vercel 项目设置中添加：

```
DATABASE_URL = postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

#### 3. 推送到 Git 并部署

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

#### 4. 在 Vercel 导入项目

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 导入你的 Git 仓库
4. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `.`（项目根目录）
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
5. 添加环境变量 `DATABASE_URL`
6. 点击 "Deploy"

#### 5. 运行数据库迁移

部署完成后，运行迁移：

```bash
# 本地运行（使用远程数据库）
export DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
cd backend
npx prisma migrate deploy

# 初始化数据
curl -X POST https://your-project.vercel.app/api/bullets/init
```

---

## 我的推荐

### 新手推荐：方案 A

原因：
- 配置最简单
- 不需要改数据库
- 可以快速上手

### 进阶推荐：方案 B

原因：
- 统一管理
- 性能更好
- 专业部署

---

## 快速开始（方案 A）

### 1. 推送代码

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/delta-force-tracker.git
git push -u origin main
```

### 2. 部署到 Vercel

1. 访问 https://vercel.com/new
2. 导入你的 GitHub 仓库
3. 选择 `frontend` 目录
4. 点击 Deploy

### 3. 部署后端

使用 Render 部署后端（详细见 RENDER_DEPLOYMENT.md）

---

## 需要什么？

如果需要我帮你：

### 1. 修改项目配置
- 调整 Vercel 配置
- 修改数据库配置
- 优化构建配置

### 2. 部署后端
- 配置 Render 部署
- 配置 Railway 部署
- 配置其他平台

### 3. 调试部署问题
- 解决构建错误
- 解决运行时错误
- 优化性能

### 4. 添加更多功能
- 集成真实爬虫
- 添加通知系统
- 实现自动更新

---

告诉我你想要：
- A. 方案 A（只部署前端）
- B. 方案 B（全栈部署）

我会帮你准备相应的配置！🚀

---

Made with 💖 by 盼盼 🐼
