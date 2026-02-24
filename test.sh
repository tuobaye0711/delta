#!/bin/bash

echo "🧪 项目测试脚本"
echo "=================="
echo ""

# 检查后端依赖
echo "📦 检查后端依赖..."
if [ -d "backend/node_modules" ]; then
    echo "✅ 后端依赖已安装"
else
    echo "❌ 后端依赖未安装"
    echo "请先运行: cd backend && npm install"
    exit 1
fi

# 检查前端依赖
echo ""
echo "📦 检查前端依赖..."
if [ -d "frontend/node_modules" ]; then
    echo "✅ 前端依赖已安装"
else
    echo "❌ 前端依赖未安装"
    echo "请先运行: cd frontend && npm install"
    exit 1
fi

# 检查数据库
echo ""
echo "🗄️  检查数据库..."
if [ -f "backend/prisma/dev.db" ]; then
    echo "✅ 数据库已创建"
else
    echo "❌ 数据库未创建"
    echo "请先运行: cd backend && npx prisma migrate dev --name init"
    exit 1
fi

# 测试后端 API
echo ""
echo "🔌 测试后端 API..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 后端 API 运行正常"
else
    echo "❌ 后端 API 未运行"
    echo "请先运行: cd backend && npm run dev"
    exit 1
fi

# 测试弹种数据
echo ""
echo "📊 测试弹种数据..."
BULLET_COUNT=$(curl -s http://localhost:3000/api/bullets | grep -o '"id"' | wc -l)
if [ "$BULLET_COUNT" -gt 0 ]; then
    echo "✅ 弹种数据正常 (共 $BULLET_COUNT 种)"
else
    echo "❌ 弹种数据未初始化"
    echo "请先运行: curl -X POST http://localhost:3000/api/bullets/init"
    exit 1
fi

# 测试前端
echo ""
echo "🎨 测试前端..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ 前端运行正常"
else
    echo "❌ 前端未运行"
    echo "请先运行: cd frontend && npm run dev"
    exit 1
fi

echo ""
echo "=================="
echo "✅ 所有测试通过！"
echo "=================="
echo ""
echo "📊 访问地址: http://localhost:5173"
echo "🔌 API 地址: http://localhost:3000"
echo ""
