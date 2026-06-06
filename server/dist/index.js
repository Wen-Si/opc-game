"use strict";
// ============================================================
// OPC 创业模拟RPG - 服务器入口
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const game_1 = __importDefault(require("./routes/game"));
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
// ============================================================
// 中间件
// ============================================================
// CORS 跨域支持
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'https://*.github.io',
        'https://*.onrender.com',
    ],
    credentials: true,
}));
// JSON 解析
app.use(express_1.default.json({ limit: '5mb' }));
// 请求日志
app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});
// ============================================================
// 路由
// ============================================================
// API 路由
app.use('/api/game', game_1.default);
// 健康检查
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'OPC Game Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// API 根路径
app.get('/api', (_req, res) => {
    res.json({
        service: 'OPC 创业模拟RPG 游戏服务器',
        version: '1.0.0',
        endpoints: {
            'POST /api/game/create': '创建新游戏',
            'GET /api/game/:userId': '获取游戏状态',
            'POST /api/game/:userId/action': '执行行动',
            'GET /api/game/:userId/events': '获取当前可用事件',
            'POST /api/game/:userId/skill': '学习技能',
            'GET /api/game/:userId/skills': '获取技能树',
            'POST /api/game/:userId/next-day': '推进到下一天',
            'GET /api/game/:userId/history': '获取历史记录',
            'GET /api/game/chapters/info': '获取章节列表',
            'GET /api/health': '健康检查',
        },
    });
});
// 静态文件服务（生产环境）
if (process.env.NODE_ENV === 'production') {
    const clientPath = path_1.default.join(__dirname, '..', 'public');
    app.use(express_1.default.static(clientPath));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(clientPath, 'index.html'));
    });
}
// 404 处理
app.use((_req, res) => {
    res.status(404).json({
        error: '接口不存在',
        hint: '请访问 /api 查看可用接口列表',
    });
});
// 全局错误处理
app.use((err, _req, res, _next) => {
    console.error('[服务器错误]', err);
    res.status(500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// ============================================================
// 启动服务器
// ============================================================
function startServer() {
    // 初始化数据库
    (0, db_1.initDatabase)();
    app.listen(PORT, () => {
        console.log('');
        console.log('╔══════════════════════════════════════════════╗');
        console.log('║   OPC 创业模拟RPG 游戏服务器已启动            ║');
        console.log(`║   地址: http://localhost:${PORT}                  ║`);
        console.log('║   API文档: http://localhost:' + PORT + '/api            ║');
        console.log('╚══════════════════════════════════════════════╝');
        console.log('');
    });
}
// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n[服务器] 正在关闭...');
    (0, db_1.closeDatabase)();
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\n[服务器] 正在关闭...');
    (0, db_1.closeDatabase)();
    process.exit(0);
});
// 未捕获的异常处理
process.on('uncaughtException', (error) => {
    console.error('[未捕获异常]', error);
});
process.on('unhandledRejection', (reason) => {
    console.error('[未处理的Promise拒绝]', reason);
});
// 启动
startServer();
//# sourceMappingURL=index.js.map