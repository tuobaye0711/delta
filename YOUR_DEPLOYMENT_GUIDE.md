# 你的专属部署指南 - 方案 A

> 🎯 基于你提供的信息定制的部署步骤
> 👤 GitHub 用户：tuobaye0711
> 📦 仓库名称：delta
> ✉️  Vercel 邮箱：tuobaye0711@163.com

---

## 📋 你的账号信息汇总

### Git 仓库
- **GitHub 用户名**: `tuobaye0711`
- **仓库名称**: `delta`
- **完整仓库地址**: `https://github.com/tuobaye0711/delta`
- **Git 远程 URL**: `https://github.com/tuobaye0711/delta.git`

### Vercel
- **Email**: `tuobaye0711@163.com`
- **Team ID**: 无（个人账号）

---

## 🚀 部署流程（7 个步骤）

### 第一步：推送代码到 GitHub（5 分钟）

#### 方法 A：使用自动化脚本（推荐）

```bash
cd /workspace/projects/workspace/delta-force-bullet-tracker
chmod +x deploy-step1-push.sh
./deploy-step1-push.sh
```

脚本会自动完成：
1. 初始化 Git 仓库
2. 添加所有文件
3. 提交代码
4. 连接到 GitHub 仓库
5. 推送代码

#### 方法 B：手动推送

如果脚本遇到问题，可以手动执行：

```bash
# 1. 进入项目目录
cd /workspace/projects/workspace/delta-force-bullet-tracker

# 2. 初始化 Git
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Initial commit: Delta Force Bullet Tracker"

# 5. 连接远程仓库
git remote add origin https://github.com/tuobaye0711/delta.git

# 6. 推送
git branch -M main
git push -u origin main
```

#### 可能需要认证

如果提示需要认证：
1. 输入 GitHub 用户名：`tuobaye0711`
2. 输入密码（你的 GitHub 密码）或 Personal Access Token

**💡 提示**：如果不想输入密码，可以创建 Personal Access Token：
- 访问 https://github.com/settings/tokens
- 点击 "Generate new token"
- 选择权限：`repo`
- 点击生成
- 复制 Token（只显示一次）
- 推送时，密码位置输入 Token

---

### 第二步：创建 GitHub 仓库（如果还没有）

**访问**：https://github.com/new

**填写**：
- **Repository name**: `delta`
- **Description**: `三角洲子弹价格监控平台 - Delta Force Bullet Tracker`
- **Public/Private**: 选择你喜欢的（Private 更安全）
- **Initialize**: 不勾选任何选项

点击 **"Create repository"**

---

### 第三步：注册 Vercel（3 分钟）

**访问**：https://vercel.com/signup

**注册**：
1. 选择登录方式：**Email**（因为你已经提供了邮箱）
2. 输入邮箱：`tuobaye0711@163.com`
3. 设置密码
4. 点击 "Sign up"
5. 验证邮箱（检查 163 邮箱）

---

### 第四步：注册 Render（3 分钟）

**访问**：https://render.com/register

**注册**：
1. 选择登录方式：**GitHub**（推荐）或 Email
2. 如果选 Email：输入你的邮箱
3. 点击 "Sign up"
4. 验证邮箱

---

### 第五步：部署前端到 Vercel（5 分钟）

**访问**：https://vercel.com/dashboard

**步骤**：
1. 点击 **"Add New Project"**
2. 点击 **"Import"**
3. 选择你的 GitHub 仓库：`tuobaye0711/delta`
4. 点击 **"Import"**

**配置项目**：
| 配置项 | 值 |
|-------|-----|
| **Project Name** | `delta-force-tracker-frontend` |
| **Framework Preset** | `Vue.js` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

点击 **"Deploy"**

**等待部署**：约 1-2 分钟

**获取 URL**：部署成功后会显示类似：
```
https://delta-force-tracker-frontend.vercel.app
```

**记下这个 URL**，后面会用到！

---

### 第六步：部署后端和数据库到 Render（10 分钟）

#### 6.1 创建 PostgreSQL 数据库

**访问**：https://dashboard.render.com

**步骤**：
1. 点击 **"New +"**
2. 选择 **"PostgreSQL"**
3. 配置数据库：

| 配置项 | 值 |
|-------|-----|
| **Name** | `delta-force-db` |
| **Database** | `delta_force` |
| **User** | `delta_user` |
| **Password** | `[设置一个强密码]` |
| **Region** | `Singapore`（推荐，离国内近）|

4. 点击 **"Create Database"**

**等待创建**：1-2 分钟

**复制连接字符串**：
创建成功后，你会看到类似这样的连接字符串：
```
postgresql://delta_user:password@dpg-xxx.oregon-postgres.render.com:5432/delta_force
```

**复制这个完整的连接字符串**，后面会用到！

#### 6.2 创建后端 Web Service

**访问**：https://dashboard.render.com

**步骤**：
1. 点击 **"New +"**
2. 选择 **"Web Service"**
3. 选择你的 GitHub 仓库：`tuobaye0711/delta`
4. 点击 **"Connect"**

**配置 Web Service**：
| 配置项 | 值 |
|-------|-----|
| **Name** | `delta-force-api` |
| **Region** | `Singapore` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

**添加环境变量**：
滚动到 **"Environment Variables"** 部分，点击 **"Add Environment Variable"**，逐个添加：

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `[粘贴刚才复制的 PostgreSQL 连接字符串]` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

点击 **"Create Web Service"**

**等待部署**：3-5 分钟

**获取 URL**：部署成功后会显示类似：
```
https://delta-force-api.onrender.com
```

**记下这个 URL**！

---

### 第七步：连接前后端（2 分钟）

**访问**：https://vercel.com/dashboard

**步骤**：
1. 进入你的前端项目：`delta-force-tracker-frontend`
2. 点击 **"Settings"** 标签
3. 找到 **"Environment Variables"** 部分
4. 点击 **"Add New"**
5. 填写：

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://delta-force-api.onrender.com/api` |

6. 点击 **"Save"**

**重新部署**：Vercel 会自动重新部署，等待 1-2 分钟。

---

### 第八步：初始化数据（2 分钟）

#### 方法 A：通过 Render Shell（推荐）

1. 访问你的 Render 后端服务：https://dashboard.render.com
2. 进入 `delta-force-api` Web Service
3. 点击 **"Shell"** 按钮
4. 等待 Shell 连接（几秒钟）
5. 运行以下命令：

```bash
curl -X POST http://localhost:3000/api/bullets/init
```

#### 方法 B：通过外部访问

直接在浏览器访问：
```
https://delta-force-api.onrender.com/api/bullets/init
```

**成功后会返回**：
```json
{
  "message": "Bullets initialized successfully",
  "count": 7
}
```

---

### 第九步：测试（2 分钟）

#### 测试 1：前端访问

**访问**：
```
https://delta-force-tracker-frontend.vercel.app
```

**期望结果**：
- 能看到仪表盘页面
- 显示 7 种弹种的价格卡片
- 没有明显的错误

#### 测试 2：后端健康检查

**访问**：
```
https://delta-force-api.onrender.com/health
```

**期望结果**：
```json
{
  "status": "ok",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

#### 测试 3：弹种数据 API

**访问**：
```
https://delta-force-api.onrender.com/api/bullets
```

**期望结果**：返回弹种列表 JSON 数据。

---

## 🔧 常见问题

### Q1: Git 推送时提示认证失败

**解决方案**：
1. 确认 GitHub 用户名是：`tuobaye0711`
2. 确认仓库名是：`delta`
3. 如果提示密码，输入你的 GitHub 密码
4. 如果使用两步验证，需要使用 Personal Access Token

### Q2: GitHub 仓库不存在

**解决方案**：
1. 访问 https://github.com/new
2. 仓库名填写：`delta`
3. 点击 "Create repository"
4. 然后重新运行推送脚本

### Q3: Vercel 部署失败

**检查**：
1. 查看构建日志：项目页面 → Deployments → 查看具体错误
2. 确认 `frontend/package.json` 存在
3. 确认 `vite.config.ts` 配置正确

### Q4: Render 数据库连接失败

**检查**：
1. 确认 `DATABASE_URL` 格式正确
2. 确认密码没有特殊字符
3. 查看 Render 数据库状态：Dashboard → Databases

### Q5: 前端页面加载但 API 不工作

**检查**：
1. 确认 `VITE_API_URL` 环境变量已设置
2. 确认 URL 是：`https://delta-force-api.onrender.com/api`
3. 注意：URL 需要包含 `/api` 后缀
4. 查看浏览器控制台（F12）的错误信息

---

## 📊 最终架构

部署完成后，你的架构是这样的：

```
浏览器
  ↓
https://delta-force-tracker-frontend.vercel.app  (Vercel 前端)
  ↓ API 调用
https://delta-force-api.onrender.com/api  (Render 后端)
  ↓ 数据库连接
Render PostgreSQL Database
  - Database: delta_force
  - User: delta_user
```

---

## 🎉 部署完成！

如果所有测试都通过，恭喜你！

你现在拥有：
- ✅ 在线可访问的前端网站
- ✅ 可用的后端 API
- ✅ PostgreSQL 数据库
- ✅ 完整的子弹价格监控系统

---

## 📱 可用的 URL

| 服务 | URL |
|------|-----|
| 前端 | https://delta-force-tracker-frontend.vercel.app |
| 后端 | https://delta-force-api.onrender.com |
| 数据库 | (Render 内部，通过后端访问） |

---

## 🆘 需要帮助？

如果遇到任何问题：

1. **查看日志**：
   - Vercel: 项目页面 → Deployments
   - Render: Web Service → Logs

2. **检查配置**：
   - 环境变量是否正确
   - 连接字符串是否完整

3. **联系我**：
   - 告诉我具体的错误信息
   - 我会帮你解决

---

## 📝 下一步

部署成功后，你可以：

1. **使用所有功能**：
   - 查看实时子弹价格
   - 添加持仓记录
   - 设置目标价格
   - 分析价格趋势

2. **配置自定义域名**（可选）：
   - 在 Vercel 和 Render 添加你的域名

3. **添加更多功能**：
   - 实现实际爬虫
   - 添加通知系统
   - 数据导出功能

---

祝部署顺利！🚀

---

Made with 💖 by 盼盼 🐼
