#!/bin/bash

echo "🚀 方案 A 部署脚本 - 推送代码到 GitHub"
echo "================================================"
echo ""

# 仓库信息
GITHUB_USER="tuobaye0711"
REPO_NAME="delta"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "📋 仓库信息："
echo "   GitHub 用户名: ${GITHUB_USER}"
echo "   仓库名称: ${REPO_NAME}"
echo "   远程地址: ${REMOTE_URL}"
echo ""

# 切换到项目目录
cd /workspace/projects/workspace/delta-force-bullet-tracker

# 检查是否已有 .git 目录
if [ -d ".git" ]; then
    echo "⚠️  检测到已存在的 Git 仓库"
    echo "   是否重新初始化？(y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        rm -rf .git
        echo "✅ 已删除旧的 Git 仓库"
    else
        echo "❌ 取消操作"
        exit 1
    fi
fi

# 初始化 Git
echo ""
echo "📝 步骤 1/5: 初始化 Git 仓库..."
git init

# 添加所有文件
echo ""
echo "📦 步骤 2/5: 添加所有文件..."
git add .

# 提交
echo ""
echo "✍️  步骤 3/5: 提交代码..."
git commit -m "Initial commit: Delta Force Bullet Tracker - Ready for deployment"

# 添加远程仓库
echo ""
echo "🔗 步骤 4/5: 添加远程仓库..."
git remote add origin ${REMOTE_URL}

# 推送代码
echo ""
echo "🚀 步骤 5/5: 推送代码到 GitHub..."
echo ""
echo "⚠️  注意：首次推送可能需要输入 GitHub 用户名和密码/Token"
echo ""

git branch -M main
git push -u origin main

# 检查推送结果
if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✅ 代码推送成功！"
    echo "================================================"
    echo ""
    echo "📊 仓库地址: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    echo "🎯 下一步：在 Vercel 和 Render 导入这个仓库"
    echo ""
else
    echo ""
    echo "================================================"
    echo "❌ 代码推送失败"
    echo "================================================"
    echo ""
    echo "💡 可能的原因："
    echo "   1. 仓库不存在（需要在 GitHub 先创建）"
    echo "   2. 用户名或仓库名错误"
    echo "   3. 网络连接问题"
    echo "   4. 需要认证（输入 GitHub 用户名和密码/Token）"
    echo ""
    echo "🔧 解决方法："
    echo "   1. 先访问 https://github.com/new 创建仓库"
    echo "   2. 仓库名填写: ${REPO_NAME}"
    echo "   3. 点击 'Create repository'"
    echo "   4. 重新运行此脚本"
    echo ""
fi
