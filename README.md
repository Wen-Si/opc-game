# OPC 创业模拟 RPG

> 一款沉浸式一人公司（OPC）创业模拟RPG游戏

## 🎮 游戏简介

你将扮演一位勇敢的创业者，从零开始创立并经营一家一人公司。在540天的虚拟创业旅程中，你将经历从梦想启航到传奇终章的完整创业历程。

## ✨ 核心特色

- **7大章节剧情**：梦想启航 → 艰难起步 → 初见曙光 → 至暗时刻 → 浴火重生 → 王者归来 → 传奇终章
- **40+随机事件**：每个事件2-3个选择，影响游戏走向
- **21个技能节点**：7大类别技能树，策略性成长
- **完整财务系统**：收入/支出/税务/融资/贷款
- **角色成长RPG**：经验值、等级、属性、心理健康、倦怠风险
- **多结局系统**：根据你的选择决定最终命运

## 🛠 技术架构

- **前端**：React + TypeScript + Tailwind CSS + Vite
- **后端**：Node.js + Express + TypeScript
- **数据库**：SQLite (better-sqlite3)
- **架构**：前后端分离，REST API，支持多用户多实例

## 🚀 快速开始

### 方式一：一键启动
```bash
bash start.sh
```

### 方式二：分别启动

1. 启动后端：
```bash
cd server
npm install
npx ts-node src/index.ts
```

2. 启动前端（新终端）：
```bash
cd client
npm install
npm run dev
```

3. 打开浏览器访问：http://localhost:5173

## 📁 项目结构

```
opc-game/
├── server/                  # 后端
│   ├── src/
│   │   ├── index.ts         # 服务器入口
│   │   ├── db.ts            # 数据库
│   │   ├── types.ts         # 类型定义
│   │   ├── routes/
│   │   │   └── game.ts      # API路由
│   │   └── engine/
│   │       ├── storySystem.ts    # 剧情系统（7章40+事件）
│   │       ├── eventSystem.ts    # 事件引擎
│   │       ├── financeSystem.ts   # 财务系统
│   │       └── growthSystem.ts    # 成长/技能系统
│   └── package.json
├── client/                  # 前端
│   ├── src/
│   │   ├── App.tsx          # 主应用
│   │   ├── api.ts           # API封装
│   │   ├── types.ts         # 类型定义
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx    # 登录页
│   │   │   └── GamePage.tsx     # 游戏主页
│   │   ├── components/
│   │   │   ├── StatusBars.tsx       # 状态栏
│   │   │   ├── CharacterPanel.tsx   # 角色面板
│   │   │   ├── CompanyPanel.tsx     # 公司面板
│   │   │   ├── EventCard.tsx        # 事件卡片
│   │   │   ├── ActionPanel.tsx      # 行动面板
│   │   │   ├── SkillTree.tsx        # 技能树
│   │   │   ├── DashboardView.tsx    # 仪表盘
│   │   │   ├── BottomBar.tsx        # 底部操作栏
│   │   │   ├── ChapterProgress.tsx  # 章节进度
│   │   │   ├── GameOverModal.tsx    # 游戏结束
│   │   │   └── NotificationToast.tsx # 通知
│   │   └── hooks/
│   │       ├── useGameState.ts      # 游戏状态Hook
│   │       └── useNotification.ts   # 通知Hook
│   └── package.json
└── start.sh                 # 一键启动脚本
```

## 🎯 游戏玩法

1. **创建角色**：输入ID、角色名、公司名，选择行业
2. **面对事件**：每个事件有多个选择，不同选择影响不同属性
3. **执行行动**：产品开发、营销推广、招聘、社交、休息等
4. **学习技能**：用技能点提升角色能力
5. **管理财务**：关注现金流，适时融资
6. **关注健康**：保持心理健康，避免倦怠
7. **推进时间**：点击"下一天"推进游戏

## ⚠️ 游戏结束条件

- 生命值归零 → 创业失败
- 现金低于 -100,000 → 破产
- 倦怠风险达到100 → 身心崩溃
- 完成540天 → 根据成就决定结局

## 📄 License

MIT
