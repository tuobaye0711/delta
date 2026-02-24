#!/bin/bash

echo "🐼 三角洲子弹价格监控平台 - 启动脚本"
echo "===================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未安装 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 安装后端依赖
echo "📦 安装后端依赖..."
cd backend
npm install

# 初始化数据库
echo ""
echo "🗄️  初始化数据库..."
npx prisma generate
npx prisma migrate dev --name init 2>/dev/null || echo "数据库已存在"

# 启动后端
echo ""
echo "🚀 启动后端服务..."
npm run dev &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 5

# 初始化弹种数据
echo ""
echo "📊 初始化弹种数据..."
curl -s -X POST http://localhost:3000/api/bullets/init > /dev/null 2>&1 || echo "弹种数据已存在"

# 安装前端依赖
echo ""
echo "📦 安装前端依赖..."
cd ../frontend
npm install

# 启动前端
echo ""
echo "🎨 启动前端服务..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "===================================="
echo "✅ 启动完成！"
echo "===================================="
echo ""
echo "📊 前端地址: http://localhost:5173"
echo "🔌 后端API: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 等待用户中断
wait $BACKEND_PID $FRONTEND_PID
