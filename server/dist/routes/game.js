"use strict";
// ============================================================
// OPC 创业模拟RPG - 游戏API路由
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const storySystem_1 = require("../engine/storySystem");
const eventSystem_1 = require("../engine/eventSystem");
const financeSystem_1 = require("../engine/financeSystem");
const growthSystem_1 = require("../engine/growthSystem");
const router = (0, express_1.Router)();
// ============================================================
// POST /api/game/create - 创建新游戏
// ============================================================
router.post('/create', (req, res) => {
    try {
        const { userId, characterName, companyName, industry } = req.body;
        if (!userId || !characterName || !companyName) {
            res.status(400).json({ error: '缺少必要参数: userId, characterName, companyName' });
            return;
        }
        // 检查是否已有游戏
        if ((0, db_1.gameExists)(userId)) {
            res.status(409).json({ error: '该用户已有游戏存档' });
            return;
        }
        // 创建用户
        (0, db_1.createUser)(userId, characterName);
        // 初始化游戏状态
        const initialState = createInitialState(userId, characterName, companyName, industry || '科技');
        // 保存
        (0, db_1.saveGame)(userId, initialState);
        res.status(201).json({
            success: true,
            message: '游戏创建成功！梦想启航……',
            data: initialState,
        });
    }
    catch (error) {
        console.error('[API] 创建游戏失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// GET /api/game/:userId - 获取游戏状态
// ============================================================
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const state = (0, db_1.loadGame)(userId);
        if (!state) {
            res.status(404).json({ error: '未找到游戏存档' });
            return;
        }
        // 附加计算信息（不保存）
        const levelProgress = (0, growthSystem_1.getLevelProgress)(state.character);
        const financeSummary = (0, financeSystem_1.getFinanceSummary)(state);
        const chapter = (0, storySystem_1.getChapterByDay)(state.currentDay);
        const learnableSkills = (0, growthSystem_1.getLearnableSkills)(state);
        res.json({
            success: true,
            data: {
                ...state,
                levelProgress,
                financeSummary,
                currentChapter: chapter,
                learnableSkills,
            },
        });
    }
    catch (error) {
        console.error('[API] 获取游戏状态失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// POST /api/game/:userId/action - 执行行动
// ============================================================
router.post('/:userId/action', (req, res) => {
    try {
        const { userId } = req.params;
        const { action, choiceId, params } = req.body;
        const state = (0, db_1.loadGame)(userId);
        if (!state) {
            res.status(404).json({ error: '未找到游戏存档' });
            return;
        }
        if (state.isGameOver) {
            res.status(400).json({ error: '游戏已结束', gameOverReason: state.gameOverReason });
            return;
        }
        let newState = { ...state };
        // 处理不同行动
        switch (action) {
            case 'rest':
                newState = (0, growthSystem_1.restAction)(newState);
                break;
            case 'work':
                newState = (0, growthSystem_1.workAction)(newState);
                break;
            case 'network':
                newState = (0, growthSystem_1.networkAction)(newState);
                break;
            case 'upgrade_office':
                newState = (0, financeSystem_1.upgradeOffice)(newState);
                break;
            case 'hire':
                newState = (0, growthSystem_1.hireAction)(newState);
                break;
            case 'marketing_campaign':
                newState = (0, growthSystem_1.marketingAction)(newState);
                break;
            case 'develop_product':
                newState = (0, growthSystem_1.developProductAction)(newState);
                break;
            case 'seek_investment':
                newState = handleSeekInvestment(newState);
                break;
            case 'take_loan': {
                const amount = params?.amount || 50000;
                newState = (0, financeSystem_1.takeLoan)(newState, amount);
                break;
            }
            case 'research_market':
                newState = (0, growthSystem_1.researchMarketAction)(newState);
                break;
            case 'train_skill':
                newState = (0, growthSystem_1.trainSkillAction)(newState);
                break;
            case 'handle_event': {
                if (!newState.pendingEvent || !choiceId) {
                    res.status(400).json({ error: '没有待处理事件或未选择选项' });
                    return;
                }
                const event = newState.pendingEvent;
                const choice = event.choices.find(c => c.id === choiceId);
                if (!choice) {
                    res.status(400).json({ error: '无效的选择ID' });
                    return;
                }
                // 检查属性要求
                const availableChoices = (0, eventSystem_1.getAvailableChoices)(event, newState.character.stats);
                if (!availableChoices.find(c => c.id === choiceId)) {
                    res.status(400).json({ error: '不满足该选择的属性要求' });
                    return;
                }
                // 应用事件效果
                newState = (0, eventSystem_1.applyEventEffects)(newState, event, choice);
                // 添加经验
                newState = (0, growthSystem_1.addExperience)(newState, 20);
                break;
            }
            default:
                res.status(400).json({ error: `未知行动: ${action}` });
                return;
        }
        // 检查成就
        const achievementResult = (0, growthSystem_1.checkAchievements)(newState);
        newState = achievementResult.state;
        // 保存
        (0, db_1.saveGame)(userId, newState);
        res.json({
            success: true,
            message: '行动执行成功',
            data: newState,
            newAchievements: achievementResult.newAchievements,
        });
    }
    catch (error) {
        console.error('[API] 执行行动失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// GET /api/game/:userId/events - 获取当前可用事件
// ============================================================
router.get('/:userId/events', (req, res) => {
    try {
        const { userId } = req.params;
        const state = (0, db_1.loadGame)(userId);
        if (!state) {
            res.status(404).json({ error: '未找到游戏存档' });
            return;
        }
        if (state.isGameOver) {
            res.status(400).json({ error: '游戏已结束' });
            return;
        }
        // 如果有待处理事件，返回该事件
        if (state.pendingEvent) {
            const availableChoices = (0, eventSystem_1.getAvailableChoices)(state.pendingEvent, state.character.stats);
            res.json({
                success: true,
                data: {
                    pendingEvent: state.pendingEvent,
                    availableChoices,
                    allChoices: state.pendingEvent.choices,
                },
            });
            return;
        }
        // 检查今天是否触发新事件
        const event = (0, eventSystem_1.checkDailyEvent)(state);
        if (event) {
            // 设置为待处理事件
            state.pendingEvent = event;
            (0, db_1.saveGame)(userId, state);
            const availableChoices = (0, eventSystem_1.getAvailableChoices)(event, state.character.stats);
            res.json({
                success: true,
                data: {
                    newEvent: event,
                    availableChoices,
                    allChoices: event.choices,
                },
            });
        }
        else {
            res.json({
                success: true,
                data: {
                    newEvent: null,
                    message: '今天没有事件发生',
                },
            });
        }
    }
    catch (error) {
        console.error('[API] 获取事件失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// POST /api/game/:userId/skill - 学习技能
// ============================================================
router.post('/:userId/skill', (req, res) => {
    try {
        const { userId } = req.params;
        const { skillId } = req.body;
        if (!skillId) {
            res.status(400).json({ error: '缺少技能ID' });
            return;
        }
        const state = (0, db_1.loadGame)(userId);
        if (!state) {
            res.status(404).json({ error: '未找到游戏存档' });
            return;
        }
        if (state.isGameOver) {
            res.status(400).json({ error: '游戏已结束' });
            return;
        }
        const newState = (0, growthSystem_1.learnSkill)(state, skillId);
        // 检查是否成功学习
        if (newState === state) {
            res.status(400).json({
                error: '无法学习该技能',
                reason: getSkillFailureReason(state, skillId),
            });
            return;
        }
        // 检查成就
        const achievementResult = (0, growthSystem_1.checkAchievements)(newState);
        (0, db_1.saveGame)(userId, achievementResult.state);
        res.json({
            success: true,
            message: '技能学习成功',
            data: achievementResult.state,
            newAchievements: achievementResult.newAchievements,
        });
    }
    catch (error) {
        console.error('[API] 学习技能失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// POST /api/game/:userId/next-day - 推进到下一天
// ============================================================
router.post('/:userId/next-day', (req, res) => {
    try {
        const { userId } = req.params;
        const state = (0, db_1.loadGame)(userId);
        if (!state) {
            res.status(404).json({ error: '未找到游戏存档' });
            return;
        }
        if (state.isGameOver) {
            res.status(400).json({ error: '游戏已结束', gameOverReason: state.gameOverReason });
            return;
        }
        let newState = { ...state };
        // 推进一天
        newState.currentDay += 1;
        // 更新月份/年份
        const totalDays = newState.currentDay;
        newState.currentMonth = ((totalDays - 1) % 30) + 1;
        newState.currentYear = Math.floor((totalDays - 1) / 360) + 1;
        // 更新章节
        const newChapter = (0, storySystem_1.getChapterByDay)(newState.currentDay);
        if (newChapter.number !== newState.chapter) {
            newState.chapter = newChapter.number;
            const chapterLog = {
                day: newState.currentDay,
                type: 'system',
                message: `[章节] 进入第${newChapter.number}章：${newChapter.title} - ${newChapter.description}`,
            };
            newState.gameLog = [...newState.gameLog, chapterLog];
        }
        // 每日财务结算
        newState = (0, financeSystem_1.dailyFinanceSettlement)(newState);
        // 更新倦怠
        newState = (0, growthSystem_1.updateBurnout)(newState);
        // 每月结算（每30天）
        if (newState.currentDay % 30 === 0) {
            newState = (0, financeSystem_1.monthlyFinanceSettlement)(newState);
        }
        // 检查随机事件
        const event = (0, eventSystem_1.checkDailyEvent)(newState);
        if (event) {
            newState.pendingEvent = event;
        }
        // 检查成就
        const achievementResult = (0, growthSystem_1.checkAchievements)(newState);
        newState = achievementResult.state;
        // 保存
        (0, db_1.saveGame)(userId, newState);
        res.json({
            success: true,
            message: `第 ${newState.currentDay} 天开始`,
            data: newState,
            newEvent: event || null,
            newAchievements: achievementResult.newAchievements,
        });
    }
    catch (error) {
        console.error('[API] 推进天数失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// GET /api/game/:userId/history - 获取历史记录
// ============================================================
router.get('/:userId/history', (req, res) => {
    try {
        const { userId } = req.params;
        const state = (0, db_1.loadGame)(userId);
        if (!state) {
            res.status(404).json({ error: '未找到游戏存档' });
            return;
        }
        // 分页参数
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const type = req.query.type;
        let logs = [...state.gameLog];
        // 按类型过滤
        if (type) {
            logs = logs.filter(log => log.type === type);
        }
        // 按天数倒序
        logs = logs.reverse();
        // 分页
        const total = logs.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedLogs = logs.slice(start, end);
        res.json({
            success: true,
            data: {
                logs: paginatedLogs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        console.error('[API] 获取历史记录失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// GET /api/game/:userId/skills - 获取技能树
// ============================================================
router.get('/:userId/skills', (req, res) => {
    try {
        const { userId } = req.params;
        const state = (0, db_1.loadGame)(userId);
        if (!state) {
            res.status(404).json({ error: '未找到游戏存档' });
            return;
        }
        const learnableSkills = (0, growthSystem_1.getLearnableSkills)(state);
        res.json({
            success: true,
            data: {
                allSkills: state.skills,
                learnableSkills,
                skillPoints: state.character.skillPoints,
            },
        });
    }
    catch (error) {
        console.error('[API] 获取技能树失败:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// ============================================================
// GET /api/game/chapters - 获取章节列表
// ============================================================
router.get('/chapters/info', (_req, res) => {
    res.json({
        success: true,
        data: storySystem_1.CHAPTERS,
    });
});
// ============================================================
// 辅助函数
// ============================================================
/** 创建初始游戏状态 */
function createInitialState(userId, characterName, companyName, industry) {
    // 随机初始属性（总和在40-55之间）
    const stats = generateRandomStats();
    return {
        userId,
        character: {
            name: characterName,
            health: 80,
            energy: 90,
            morale: 70,
            reputation: 10,
            experience: 0,
            level: 1,
            skillPoints: 3,
            stats,
            mentalHealth: 75,
            burnoutRisk: 5,
        },
        company: {
            name: companyName,
            phase: 'idea',
            cash: 100000, // 初始资金10万
            monthlyRevenue: 0,
            monthlyExpense: 3000, // 基本生活费用
            productQuality: 20,
            marketShare: 0,
            teamSize: 1,
            officeLevel: 1,
            clients: 0,
            completedProjects: 0,
            failedProjects: 0,
            totalProfit: 0,
            industry,
        },
        currentDay: 1,
        currentMonth: 1,
        currentYear: 1,
        chapter: 1,
        phase: 'idea',
        skills: (0, growthSystem_1.initializeSkillTree)(),
        eventHistory: [],
        achievements: [],
        gameLog: [
            {
                day: 1,
                type: 'system',
                message: `[开始] ${characterName}的创业之旅开始了！公司「${companyName}」正式成立。行业：${industry}。初始资金：¥100,000。加油，未来的企业家！`,
            },
            {
                day: 1,
                type: 'system',
                message: `[章节] 第1章：梦想启航 — 一切从零开始。你怀揣着改变世界的梦想，踏上了创业的征途。`,
            },
        ],
        isGameOver: false,
    };
}
/** 生成随机初始属性 */
function generateRandomStats() {
    const base = 15;
    const range = 15;
    return {
        leadership: base + Math.floor(Math.random() * range),
        technical: base + Math.floor(Math.random() * range),
        marketing: base + Math.floor(Math.random() * range),
        finance: base + Math.floor(Math.random() * range),
        creativity: base + Math.floor(Math.random() * range),
        resilience: base + Math.floor(Math.random() * range),
        networking: base + Math.floor(Math.random() * range),
    };
}
/** 获取技能学习失败原因 */
function getSkillFailureReason(state, skillId) {
    const skill = state.skills.find(s => s.id === skillId);
    if (!skill)
        return '技能不存在';
    if (skill.currentLevel >= skill.maxLevel)
        return '该技能已达到最高等级';
    if (skill.prerequisite) {
        const prereq = state.skills.find(s => s.id === skill.prerequisite);
        if (!prereq || prereq.currentLevel < 1) {
            return `需要先学习前置技能「${prereq?.name || '未知'}」`;
        }
    }
    if (state.character.skillPoints < skill.cost) {
        return `技能点不足（需要${skill.cost}点，当前${state.character.skillPoints}点）`;
    }
    return '未知原因';
}
/** 处理寻求投资行动 */
function handleSeekInvestment(state) {
    let newState = { ...state };
    newState.character = { ...newState.character };
    // 消耗精力
    newState.character.energy = Math.max(0, newState.character.energy - 20);
    // 基于人脉和营销能力判断投资成功率
    const successChance = 0.2 +
        (newState.character.stats.networking / 100) * 0.3 +
        (newState.character.stats.marketing / 100) * 0.2 +
        (newState.character.reputation / 100) * 0.2;
    if (Math.random() < successChance) {
        // 成功获得投资
        const investmentAmount = 50000 + Math.floor(Math.random() * 150000); // 5-20万
        newState.company = {
            ...newState.company,
            cash: newState.company.cash + investmentAmount,
        };
        newState.character.reputation = Math.min(100, newState.character.reputation + 5);
        newState = (0, growthSystem_1.addExperience)(newState, 30);
        const logEntry = {
            day: newState.currentDay,
            type: 'action',
            message: `[投资] 恭喜！成功获得 ¥${investmentAmount.toLocaleString()} 的投资！精力-20，经验+30，声望+5。`,
        };
        newState.gameLog = [...newState.gameLog, logEntry];
    }
    else {
        // 投资失败
        newState.character.morale = Math.max(0, newState.character.morale - 10);
        newState = (0, growthSystem_1.addExperience)(newState, 10);
        const logEntry = {
            day: newState.currentDay,
            type: 'action',
            message: `[投资] 遗憾，投资人暂时没有兴趣。精力-20，士气-10，经验+10。不要气馁，继续努力！`,
        };
        newState.gameLog = [...newState.gameLog, logEntry];
    }
    return newState;
}
exports.default = router;
//# sourceMappingURL=game.js.map