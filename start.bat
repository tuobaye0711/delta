@echo off
chcp 65001 > nul
title 三角洲子弹价格监控平台

echo 🐼 三角洲子弹价格监控平台 - 启动脚本
echo ====================================
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未安装 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo ✅ npm 版本:
npm --version
echo.

REM 安装后端依赖
echo 📦 安装后端依赖...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ 后端依赖安装失败
    pause
    exit /b 1
)

REM 初始化数据库
echo.
echo 🗄️  初始化数据库...
call npx prisma generate
call npx prisma migrate dev --name init 2>nul || echo 数据库已存在

REM 启动后端
echo.
echo 🚀 启动后端服务...
start "后端服务" cmd /k "npm run dev"

REM 等待后端启动
echo ⏳ 等待后端启动...
timeout /t 5 /nobreak >nul

REM 初始化弹种数据
echo.
echo 📊 初始化弹种数据...
curl -s -X POST http://localhost:3000/api/bullets/init >nul 2>&1 || echo 弹种数据已存在

REM 安装前端依赖
echo.
echo 📦 安装前端依赖...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)

REM 启动前端
echo.
echo 🎨 启动前端服务...
start "前端服务" cmd /k "npm run dev"

echo.
echo ====================================
echo ✅ 启动完成！
echo ====================================
echo.
echo 📊 前端地址: http://localhost:5173
echo 🔌 后端API: http://localhost:3000
echo.
echo 按任意键关闭此窗口（服务将继续运行）
pause >nul
