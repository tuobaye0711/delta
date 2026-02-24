# 部署说明

> 📀 将项目部署到生产环境

---

## 一、本地部署

### 前置要求

- Node.js >= 18
- npm >= 9
- git（可选）

### 部署步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd delta-force-bullet-tracker

# 2. 安装依赖
cd backend
npm install
cd ../frontend
npm install

# 3. 初始化数据库
cd ../backend
npx prisma generate
npx prisma migrate dev --name init

# 4. 初始化弹种数据
npm run dev &  # 启动后端
sleep 5
curl -X POST http://localhost:3000/api/bullets/init

# 5. 启动前端
cd ../frontend
npm run dev

# 6. 访问
# 前端: http://localhost:5173
# 后端: http://localhost:3000
```

---

## 二、生产环境部署

### 方案 A：Docker 部署

#### 1. 创建 Dockerfile

**后端 Dockerfile**：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**前端 Dockerfile**：
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DATABASE_URL=file:./dev.db
    volumes:
      - ./backend/prisma:/app/prisma
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### 3. 启动

```bash
docker-compose up -d
```

---

### 方案 B：PM2 部署

#### 1. 安装 PM2

```bash
npm install -g pm2
```

#### 2. 配置 ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'delta-force-backend',
      script: './dist/index.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'file:./dev.db',
      },
    },
    {
      name: 'delta-force-frontend',
      script: './node_modules/.bin/vite',
      args: 'preview',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
    },
  ],
};
```

#### 3. 启动

```bash
# 构建项目
cd backend && npm run build
cd ../frontend && npm run build

# 启动 PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### 方案 C：云服务器部署（推荐）

#### 1. 服务器准备

**推荐配置**：
- CPU: 2 核
- 内存: 4GB
- 硬盘: 40GB
- 系统: Ubuntu 22.04 LTS

#### 2. 安装环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 nginx
sudo apt install -y nginx

# 安装 PM2
sudo npm install -g pm2
```

#### 3. 部署项目

```bash
# 克隆项目
git clone <repository-url>
cd delta-force-bullet-tracker

# 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 初始化数据库
cd ../backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed  # 如果有 seed 脚本

# 构建项目
npm run build
cd ../frontend
npm run build

# 启动后端
cd ../backend
pm2 start dist/index.js --name delta-force-backend

# 配置 nginx
sudo nano /etc/nginx/sites-available/delta-force
```

#### 4. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        root /path/to/delta-force-bullet-tracker/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/delta-force /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. 配置 HTTPS（Let's Encrypt）

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 三、数据库配置

### SQLite（默认）

适合小型项目或个人使用：

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL（推荐生产环境）

#### 1. 安装 PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. 创建数据库

```bash
sudo -u postgres psql
CREATE DATABASE delta_force;
CREATE USER delta_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE delta_force TO delta_user;
\q
```

#### 3. 配置 Prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 4. 环境变量

```env
DATABASE_URL="postgresql://delta_user:your_password@localhost:5432/delta_force"
```

---

## 四、监控和日志

### PM2 监控

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs

# 监控
pm2 monit
```

### 日志配置

```javascript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

---

## 五、备份和恢复

### 数据库备份

```bash
# SQLite
cp backend/prisma/dev.db backup/dev-$(date +%Y%m%d).db

# PostgreSQL
pg_dump -U delta_user delta_force > backup/delta-force-$(date +%Y%m%d).sql
```

### 自动备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
cp backend/prisma/dev.db $BACKUP_DIR/dev-$DATE.db

# 压缩
gzip $BACKUP_DIR/dev-$DATE.db

# 删除 30 天前的备份
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

添加到 crontab：

```bash
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```

---

## 六、安全配置

### 1. 环境变量

```env
# 后端
PORT=3000
NODE_ENV=production
DATABASE_URL="your-database-url"

# JWT 密钥（如果使用）
JWT_SECRET="your-secret-key"

# API 密钥（如果使用第三方 API）
API_KEY="your-api-key"
```

### 2. 防火墙配置

```bash
# 允许 SSH
sudo ufw allow 22/tcp

# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable
```

### 3. Nginx 安全

```nginx
# 隐藏 Nginx 版本
server_tokens off;

# 限制请求大小
client_max_body_size 10M;

# 启用 gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 七、性能优化

### 1. 后端优化

- 启用数据库索引
- 使用 Redis 缓存
- 启用 Gzip 压缩
- 使用 CDN 静态资源

### 2. 前端优化

- 代码分割
- 懒加载
- 图片压缩
- 启用浏览器缓存

### 3. 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_price_history_bullet_created ON price_history(bullet_id, created_at DESC);
CREATE INDEX idx_transactions_user_bullet ON user_transactions(user_id, bullet_id);
CREATE INDEX idx_targets_user_bullet ON user_targets(user_id, bullet_id);
```

---

## 八、故障排查

### 常见问题

#### 问题 1：数据库连接失败

```bash
# 检查数据库是否运行
sudo systemctl status postgresql

# 检查连接字符串
echo $DATABASE_URL
```

#### 问题 2：端口被占用

```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :80

# 释放端口
sudo kill -9 <PID>
```

#### 问题 3：Nginx 配置错误

```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 九、更新和维护

### 更新代码

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
cd backend && npm install
cd ../frontend && npm install

# 运行数据库迁移
cd ../backend
npx prisma migrate deploy

# 重新构建
npm run build
cd ../frontend
npm run build

# 重启服务
pm2 restart all
sudo systemctl restart nginx
```

### 定期维护

- 每周检查日志
- 每月备份数据
- 定期更新依赖
- 监控服务器资源

---

## 十、成本估算

### 云服务器（推荐）

| 配置 | 月成本 | 说明 |
|------|--------|------|
| 2核4G | ¥50-100 | 适合小型项目 |
| 4核8G | ¥150-200 | 适合中型项目 |
| 8核16G | ¥300-500 | 适合大型项目 |

### 其他成本

- 域名：¥50-100/年
- SSL 证书：免费（Let's Encrypt）
- CDN：按流量计费

---

## 总结

- **开发环境**：直接使用 `./start.sh`
- **小型项目**：PM2 + SQLite
- **生产环境**：PM2 + PostgreSQL + Nginx
- **高可用**：Docker + Kubernetes

如有问题，随时联系～

---

Made with 💖 by 盼盼 🐼
