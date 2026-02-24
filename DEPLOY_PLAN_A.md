# 方案A 部署指南 - 分步操作

> 🎯 方案 A：前端 Vercel + 后端 Render
> ⏱️ 预计时间：20-30 分钟

---

## 📋 部署清单

- [ ] 第一步：准备 Git 仓库
- [ ] 第二步：注册账号
- [ ] 第三步：部署前端到 Vercel
- [ ] 第四步：部署后端和数据库到 Render
- [ ] 第五步：连接前后端
- [ ] 第六步：初始化数据
- [ ] 第七步：测试

---

## 第一步：准备 Git 仓库（5 分钟）

### 1. 初始化 Git 仓库

```bash
cd /workspace/projects/workspace/delta-force-bullet-tracker
git init
```

### 2. 添加所有文件

```bash
git add .
```

### 3. 提交

```bash
git commit -m "Initial commit: Delta Force Bullet Tracker"
```

### 4. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`delta-force-tracker`
3. 选择 Public 或 Private
4. 点击 "Create repository"

### 5. 推送到 GitHub

```bash
git remote add origin https://github.com/your-username/delta-force-tracker.git
git branch -M main
git push -u origin main
```

---

## 第二步：注册账号（3 分钟）

### 1. 注册 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 使用 GitHub、GitLab 或邮箱注册
4. 完成邮箱验证

### 2. 注册 Render

1. 访问 https://render.com
2. 点击 "Sign Up"
3. 使用 GitHub、GitLab 或邮箱注册
4. 完成邮箱验证

---

## 第三步：部署前端到 Vercel（5 分钟）

### 1. 在 Vercel 导入项目

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 点击 "Import"
4. 选择你的 GitHub 仓库 `delta-force-tracker`

### 2. 配置项目

填写以下信息：

| 配置项 | 值 |
|-------|-----|
| **Project Name** | delta-force-tracker-frontend |
| **Framework Preset** | Vue.js |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3. 点击 "Deploy"

等待部署完成（约 1-2 分钟）。

### 4. 获取前端 URL

部署成功后，Vercel 会提供一个 URL，类似：
```
https://delta-force-tracker-frontend.vercel.app
```

记下这个 URL，稍后需要用到。

---

## 第四步：部署后端和数据库到 Render（8 分钟）

### 1. 创建 PostgreSQL 数据库

1. 在 Render 点击 "New +"
2. 选择 "PostgreSQL"
3. 配置数据库：

| 配置项 | 值 |
|-------|-----|
| **Name** | delta-force-db |
| **Database** | delta_force |
| **User** | delta_user |
| **Password** | [设置一个强密码] |
| **Region** | Singapore（推荐，离国内近）|

4. 点击 "Create Database"

### 2. 等待数据库创建

等待 1-2 分钟，数据库创建完成后，你会看到以下信息：

- **Internal Database URL**: `postgresql://delta_user:password@dpg-xxx.oregon-postgres.render.com:5432/delta_force`

**复制这个连接字符串**，后面会用到！

### 3. 创建后端 Web Service

1. 在 Render 点击 "New +"
2. 选择 "Web Service"
3. 连接你的 GitHub 仓库 `delta-force-tracker`

### 4. 配置 Web Service

填写以下信息：

| 配置项 | 值 |
|-------|-----|
| **Name** | delta-force-api |
| **Environment** | Node.js |
| **Region** | Singapore |
| **Branch** | main |
| **Root Directory** | `backend` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

### 5. 添加环境变量

滚动到 "Environment Variables" 部分，添加以下变量：

| 变量名 | 值 |
|-------|-----|
| **DATABASE_URL** | `[粘贴刚才复制的 PostgreSQL 连接字符串]` |
| **NODE_ENV** | `production` |
| **PORT** | `3000` |

### 6. 点击 "Create Web Service"

等待部署完成（约 3-5 分钟）。

### 7. 获取后端 URL

部署成功后，Render 会提供一个 URL，类似：
```
https://delta-force-api.onrender.com
```

**记下这个 URL！** 后面需要用到。

---

## 第五步：连接前后端（2 分钟）

### 方法 A：在 Vercel 设置环境变量（推荐）

1. 进入 Vercel 项目 → Settings → Environment Variables
2. 添加以下环境变量：

| 变量名 | 值 |
|-------|-----|
| **VITE_API_URL** | `https://delta-force-api.onrender.com/api` |

3. 点击 "Save"
4. Vercel 会自动重新部署

### 方法 B：直接修改代码

修改 `frontend/src/api/index.ts` 文件：

```typescript
// 找到这行：
return 'https://delta-force-api.onrender.com/api';

// 替换为你的实际 Render 后端 URL：
return 'https://your-actual-backend-url.onrender.com/api';
```

然后提交代码，Vercel 会自动重新部署。

---

## 第六步：初始化数据（2 分钟）

### 方法 A：通过 Render Shell（推荐）

1. 进入 Render Web Service 页面
2. 点击 "Shell" 按钮
3. 等待 Shell 连接
4. 运行以下命令：

```bash
curl -X POST http://localhost:3000/api/bullets/init
```

### 方法 B：通过外部访问

```bash
curl -X POST https://delta-force-api.onrender.com/api/bullets/init
```

成功后会返回：
```json
{
  "message": "Bullets initialized successfully",
  "count": 7
}
```

---

## 第七步：测试（2 分钟）

### 1. 测试前端

访问你的 Vercel URL：
```
https://delta-force-tracker-frontend.vercel.app
```

应该能看到仪表盘页面，显示弹种列表。

### 2. 测试后端 API

访问健康检查端点：
```
https://delta-force-api.onrender.com/health
```

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2026-02-24T10:00:00.000Z"
}
```

### 3. 测试弹种数据

访问：
```
https://delta-force-api.onrender.com/api/bullets
```

应该返回弹种列表数据。

---

## 🔧 常见问题

### Q1: 前端页面加载，但 API 不工作

**A**: 检查以下几点：
1. 前端环境变量 `VITE_API_URL` 是否正确
2. 后端 URL 是否正确（注意包含 `/api` 后缀）
3. 查看 Vercel 的构建日志
4. 查看 Render 的运行日志

### Q2: 后端部署失败

**A**: 检查以下几点：
1. `package.json` 的 scripts 是否正确
2. 环境变量 `DATABASE_URL` 是否正确
3. 查看构建日志中的错误信息

### Q3: 数据库连接失败

**A**:
1. 确认 `DATABASE_URL` 格式正确
2. 确认密码中不包含特殊字符
3. 查看 Render 数据库的状态

### Q4: 弹种数据为空

**A**:
1. 确认是否运行了初始化命令
2. 检查后端日志是否有错误
3. 手动访问 `/api/bullets` 查看

### Q5: Vercel URL 难以访问

**A**:
1. 确认部署成功（绿色勾）
2. 尝试清除浏览器缓存
3. 检查是否有防火墙阻止

---

## 📊 部署完成检查清单

完成所有步骤后，检查以下项目：

- [ ] 前端可以正常访问
- [ ] 后端健康检查正常
- [ ] 弹种数据显示正常
- [ ] 持仓管理功能正常
- [ ] 价格趋势图显示正常
- [ ] 所有 API 接口可用

---

## 🎉 恭喜！

如果所有检查都通过，恭喜你成功部署了！

现在你可以：
- 访问前端网站使用所有功能
- 添加持仓记录
- 设置目标价格
- 监控子弹价格

---

## 📱 下一步

### 1. 配置自定义域名（可选）

**前端**：
1. 在 Vercel 项目 → Domains 添加你的域名
2. 按提示配置 DNS 记录

**后端**：
1. 在 Render Web Service → Custom Domains 添加你的域名
2. 按提示配置 DNS 记录

### 2. 添加更多功能

- 实现实际爬虫
- 添加邮件通知
- 实现智能推荐
- 数据导出功能

### 3. 监控和维护

- 定期检查服务状态
- 查看日志
- 备份数据库

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看 Render 日志
2. 查看 Vercel 日志
3. 检查浏览器控制台
4. 联系我帮你解决

---

祝部署顺利！🚀

---

Made with 💖 by 盼盼 🐼
