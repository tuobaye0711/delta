# Vercel 部署说明

> 📀 将三角洲子弹价格监控平台部署到 Vercel

---

## 前置要求

### 1. Vercel 账号
- 访问 https://vercel.com 注册账号
- 可以使用 GitHub、GitLab、Bitbucket 或邮箱注册

### 2. PostgreSQL 数据库
Vercel Serverless 不支持 SQLite，需要改用 PostgreSQL：
- 推荐：Supabase（免费）
- 替代：Neon、PlanetScale、Railway

### 3. Git 仓库
- GitHub、GitLab 或 Bitbucket 仓库
- 将项目代码推送到仓库

---

## 部署步骤

### 第一步：准备数据库

#### 使用 Supabase（推荐）

1. 访问 https://supabase.com 注册账号
2. 创建新项目：
   - Project name: `delta-force-tracker`
   - Database password: 设置一个强密码
   - Region: 选择最近的区域（推荐 Singapore）
3. 等待数据库创建完成（约 1-2 分钟）
4. 获取数据库连接字符串：
   - 进入 Settings → Database
   - 找到 Connection String
   - 选择 "URI" 格式
   - 复制连接字符串

**连接字符串格式**：
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 第二步：修改数据库配置

#### 1. 修改 Prisma Schema

编辑 `backend/prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"  // 改为 postgresql
  url      = env("DATABASE_URL")
}
```

#### 2. 安装 PostgreSQL 客户端

```bash
cd backend
npm install pg
```

#### 3. 设置环境变量

在 Vercel 项目设置中添加：
```
DATABASE_URL = postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 第三步：准备项目结构

#### 创建 Vercel API 目录

```bash
cd delta-force-bullet-tracker
mkdir -p api
```

#### 创建 API 代理

创建 `api/index.ts`：

```typescript
import { createServer } from 'http';

export default function handler(req, res) {
  // 这里会由 Express 处理
  res.statusCode = 200;
  res.json({ status: 'ok' });
}
```

#### 修改 Vercel 配置

编辑 `vercel.json`：

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
      "source": "/api/:path*",
      "destination": "http://localhost:3000/:path*"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

### 第四步：推送到 Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/delta-force-tracker.git
git push -u origin main
```

### 第五步：在 Vercel 部署

#### 方法 A：通过 Vercel CLI（推荐）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
cd delta-force-bullet-tracker
vercel
```

按照提示操作：
1. 选择 "Link to existing project" 或 "Create new project"
2. 设置项目名称
3. 添加环境变量 `DATABASE_URL`
4. 确认部署

#### 方法 B：通过 Vercel Dashboard

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 导入你的 Git 仓库
4. 配置项目：
   - **Framework Preset**: Vue.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 添加环境变量：
   - Key: `DATABASE_URL`
   - Value: 你的 PostgreSQL 连接字符串
6. 点击 "Deploy"

---

## 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例 |
|-------|------|------|
| DATABASE_URL | PostgreSQL 连接字符串 | `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres` |
| NODE_ENV | 运行环境 | `production` |
| PORT | 端口号（可选） | `3000` |

---

## 运行数据库迁移

部署完成后，需要运行数据库迁移：

### 方法 A：通过 Vercel CLI

```bash
vercel env pull .env.local
cd backend
npx prisma migrate deploy
```

### 方法 B：通过本地连接

```bash
cd backend
# 设置数据库 URL
export DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate deploy

# 初始化数据（可选）
npx prisma db seed
```

### 方法 C：通过 Supabase SQL Editor

1. 访问 Supabase Dashboard
2. 进入 SQL Editor
3. 运行 Prisma 生成的 SQL 文件
4. 或运行初始化数据的 SQL

---

## 初始化弹种数据

部署完成后，访问你的 Vercel 域名：

```
https://your-project.vercel.app/api/bullets/init
```

或在应用的"设置"页面点击"初始化弹种数据"按钮。

---

## 自定义域名

### 在 Vercel 中配置

1. 进入项目设置 → Domains
2. 添加你的域名（如 `delta-tracker.example.com`）
3. 配置 DNS 记录：
   - 类型: CNAME
   - 名称: `delta-tracker`
   - 值: `cname.vercel-dns.com`

### 在域名注册商配置

根据 Vercel 提供的 DNS 记录配置你的域名。

---

## 更新和重新部署

### 自动部署

推送代码到 Git 后，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Update code"
git push
```

### 手动部署

```bash
vercel --prod
```

---

## 监控和日志

### 查看部署日志

```bash
vercel logs
```

### 查看项目日志

1. 访问 Vercel Dashboard
2. 选择你的项目
3. 进入 "Logs" 标签

---

## 常见问题

### Q1: 部署失败，提示数据库连接错误

**A**: 检查 `DATABASE_URL` 环境变量是否正确：
- 确认密码正确
- 确认数据库地址正确
- 确认端口是 5432

### Q2: 前端部署成功，但 API 不工作

**A**: 检查以下几点：
- 确认 API 路由配置正确
- 确认后端服务正常
- 查看 Vercel 日志

### Q3: 如何调试 API 问题？

**A**:
1. 使用 `vercel logs` 查看实时日志
2. 在 Vercel Dashboard 查看函数日志
3. 添加更多日志输出

### Q4: 数据库迁移失败怎么办？

**A**:
1. 检查数据库连接
2. 手动运行迁移：`npx prisma migrate deploy`
3. 查看迁移 SQL 文件是否有错误

### Q5: 免费 Vercel 配额用完了怎么办？

**A**:
- Hobby 免费计划：每月 100GB 带宽
- 超出后会停止服务，下个月恢复
- 可以升级到 Pro 计划（$20/月）

---

## 成本估算

### Vercel
- Hobby（免费）：100GB 带宽/月
- Pro（$20/月）：1TB 带宽/月

### Supabase（推荐）
- Free：500MB 数据库
- Pro（$25/月）：8GB 数据库

### 总成本
- 免费方案：$0/月
- 生产方案：$45-50/月

---

## 性能优化

### 1. 启用 CDN

Vercel 自动提供 CDN，无需额外配置。

### 2. 数据库连接池

在 Prisma Schema 中添加：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // 连接池
}
```

### 3. 缓存策略

在 Vercel 配置中设置缓存时间。

---

## 安全配置

### 1. 环境变量

不要在代码中硬编码敏感信息，使用环境变量。

### 2. HTTPS

Vercel 自动提供 HTTPS，无需额外配置。

### 3. API 限流

添加 API 限流中间件防止滥用。

---

## 备份和恢复

### 数据库备份

Supabase 自动提供备份：
- Daily backups（7 天保留）
- Point-in-time recovery

### 手动备份

```bash
pg_dump $DATABASE_URL > backup.sql
```

---

## 总结

部署到 Vercel 的步骤：

1. ✅ 注册 Vercel 账号
2. ✅ 创建 PostgreSQL 数据库
3. ✅ 修改数据库配置（改为 PostgreSQL）
4. ✅ 推送代码到 Git
5. ✅ 在 Vercel 导入项目
6. ✅ 配置环境变量
7. ✅ 运行数据库迁移
8. ✅ 初始化弹种数据
9. ✅ 访问你的网站

---

## 需要帮助？

- Vercel 文档：https://vercel.com/docs
- Supabase 文档：https://supabase.com/docs
- Prisma 文档：https://www.prisma.io/docs

如有问题，随时联系我～

---

Made with 💖 by 盼盼 🐼
