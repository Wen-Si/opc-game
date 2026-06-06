#!/bin/bash
# OPC 创业模拟 RPG 游戏启动脚本
# 使用方法: bash start.sh

echo "╔══════════════════════════════════════════════╗"
echo "║   OPC 创业模拟 RPG - 一键启动               ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js，请先安装 Node.js >= 18"
    exit 1
fi

# 安装后端依赖
echo "📦 检查后端依赖..."
cd server
if [ ! -d "node_modules" ]; then
    echo "   安装后端依赖中..."
    npm install
fi
cd ..

# 安装前端依赖
echo "📦 检查前端依赖..."
cd client
if [ ! -d "node_modules" ]; then
    echo "   安装前端依赖中..."
    npm install
fi
cd ..

# 启动后端
echo ""
echo "🚀 启动后端服务器 (端口: 3001)..."
cd server
npx ts-node src/index.ts &
SERVER_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端
echo "🚀 启动前端开发服务器 (端口: 5173)..."
cd client
npx vite --host 0.0.0.0 &
CLIENT_PID=$!
cd ..

# 等待前端启动
sleep 3

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   🎮 游戏已启动！                            ║"
echo "║   前端地址: http://localhost:5173             ║"
echo "║   后端API:  http://localhost:3001              ║"
echo "║                                              ║"
echo "║   按 Ctrl+C 停止所有服务                      ║"
echo "╚══════════════════════════════════════════════╝"

# 捕获退出信号
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo ''; echo '游戏已停止。'; exit" SIGINT SIGTERM

# 等待
wait
