# 部署快速参考 - 方案 A

> 📌 打印这个页面，部署时随时查看

---

## 🔑 重要信息（部署后填写）

### 前端信息
- Vercel URL: `_______________________________`
- 自定义域名（如有）: `_______________________________`

### 后端信息
- Render URL: `_______________________________`
- Service Name: `delta-force-api`
- Branch: `main`

### 数据库信息
- Database URL: `_______________________________`
- Database: `delta_force`
- User: `delta_user`
- Password: `_______________________________`

---

## 📝 环境变量清单

### Vercel 环境变量

| 变量名 | 值 |
|-------|-----|
| VITE_API_URL | `https://delta-force-api.onrender.com/api` |

### Render 环境变量

| 变量名 | 值 |
|-------|-----|
| DATABASE_URL | `postgresql://delta_user:password@host:5432/delta_force` |
| NODE_ENV | `production` |
| PORT | `3000` |

---

## 🚀 部署步骤

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/delta-force-tracker.git
git push -u origin main
```

### 2. 部署前端到 Vercel

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 导入 GitHub 仓库
4. 配置：
   - Root Directory: `frontend`
   - Framework Preset: `Vue.js`
5. 点击 Deploy

### 3. 创建数据库

1. 访问 https://render.com
2. 点击 "New +" → "PostgreSQL"
3. 配置：
   - Name: `delta-force-db`
   - Database: `delta_force`
   - Region: `Singapore`
4. 点击 "Create"
5. 复制 Internal Database URL

### 4. 部署后端到 Render

1. 点击 "New +" → "Web Service"
2. 导入 GitHub 仓库
3. 配置：
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. 添加环境变量 `DATABASE_URL`
5. 点击 "Create"

### 5. 连接前后端

在 Vercel 添加环境变量：
```
VITE_API_URL = https://delta-force-api.onrender.com/api
```

### 6. 初始化数据

```bash
curl -X POST https://delta-force-api.onrender.com/api/bullets/init
```

### 7. 测试

- 前端: https://delta-force-tracker-frontend.vercel.app
- 后端: https://delta-force-api.onrender.com/health

---

## 🔗 有用链接

- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- GitHub Repository: https://github.com/your-username/delta-force-tracker

---

## ⚠️ 常见错误

### 错误 1: Database connection failed

**解决方案**：
- 检查 `DATABASE_URL` 是否正确
- 确认密码没有特殊字符
- 查看数据库状态

### 错误 2: API not responding

**解决方案**：
- 检查后端是否正在运行
- 查看 Render 日志
- 确认端口配置正确

### 错误 3: Frontend can't reach backend

**解决方案**：
- 检查 `VITE_API_URL` 是否正确
- 确认 URL 包含 `/api` 后缀
- 查看 CORS 配置

---

## 📞 联系我

如果遇到问题，随时联系我！

---

Made with 💖 by 盼盼 🐼
