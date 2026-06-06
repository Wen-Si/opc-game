// ============================================================
// OPC 创业模拟RPG - 财务系统
// ============================================================

import { GameState, CompanyState, LoanInfo } from '../types';

/** 基础生活费用（每月） */
const BASE_LIVING_COST = 3000;

/** 办公室租金（按等级） */
const OFFICE_RENT: Record<number, number> = {
  1: 0,       // 在家办公
  2: 1500,    // 共享工位
  3: 5000,    // 小办公室
  4: 15000,   // 中型办公室
  5: 40000,   // 大型办公室
};

/** 员工平均薪资（每月） */
const AVG_SALARY = 8000;

/** 外包费用（每次） */
const OUTSOURCING_COST = 3000;

/** 税率 */
const TAX_RATE = 0.05; // 5% 简化税率

/** 贷款利率（年化） */
const LOAN_INTEREST_RATE = 0.08;

/** 每月贷款还款系数 */
const LOAN_MONTHLY_FACTOR = 0.09; // 约等于8%年化/12月 * 1.35

/**
 * 每日财务结算
 */
export function dailyFinanceSettlement(state: GameState): GameState {
  const newState = { ...state };

  // 每日自然恢复（精力恢复）
  const energyRecovery = calculateDailyEnergyRecovery(state);
  newState.character = {
    ...newState.character,
    energy: Math.min(100, newState.character.energy + energyRecovery),
  };

  // 每日自然消耗（基本生活成本分摊到每天）
  const dailyLivingCost = BASE_LIVING_COST / 30;
  newState.company = {
    ...newState.company,
    cash: newState.company.cash - dailyLivingCost,
  };

  return newState;
}

/**
 * 每月财务结算
 */
export function monthlyFinanceSettlement(state: GameState): GameState {
  const newState = { ...state };
  const company = { ...newState.company };

  // 1. 计算月收入
  const monthlyIncome = calculateMonthlyIncome(company);
  company.monthlyRevenue = monthlyIncome;

  // 2. 计算月支出
  const monthlyCost = calculateMonthlyExpense(company);
  company.monthlyExpense = monthlyCost;

  // 3. 计算税
  const tax = Math.max(0, Math.floor(monthlyIncome * TAX_RATE));

  // 4. 计算净利润
  const netProfit = monthlyIncome - monthlyCost - tax;
  company.cash += netProfit;
  company.totalProfit += netProfit;

  // 5. 贷款还款
  // （简化处理，贷款信息存储在gameLog中）
  // 如果有贷款，每月扣除还款额
  const loanPayment = calculateLoanPayment(state);
  if (loanPayment > 0) {
    company.cash -= loanPayment;
  }

  newState.company = company;

  // 添加财务日志
  const logEntry = {
    day: newState.currentDay,
    type: 'system' as const,
    message: `[财务] 月度结算 - 收入: ¥${monthlyIncome.toLocaleString()}, 支出: ¥${monthlyCost.toLocaleString()}, 税费: ¥${tax.toLocaleString()}, 净利润: ¥${netProfit.toLocaleString()}, 现金余额: ¥${company.cash.toLocaleString()}`,
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  // 现金流预警
  if (company.cash < 0) {
    const warningEntry = {
      day: newState.currentDay,
      type: 'system' as const,
      message: `[警告] 现金流为负！公司现金余额: ¥${company.cash.toLocaleString()}。请立即采取措施！`,
    };
    newState.gameLog = [...newState.gameLog, warningEntry];
  } else if (company.cash < 10000) {
    const warningEntry = {
      day: newState.currentDay,
      type: 'system' as const,
      message: `[提醒] 现金储备不足 ¥10,000，请注意现金流管理。`,
    };
    newState.gameLog = [...newState.gameLog, warningEntry];
  }

  // 检查是否破产
  if (company.cash < -50000) {
    newState.isGameOver = true;
    newState.gameOverReason = '公司资金链断裂，宣告破产。你的创业旅程到此结束……';
    const gameOverEntry = {
      day: newState.currentDay,
      type: 'system' as const,
      message: `[游戏结束] ${newState.gameOverReason}`,
    };
    newState.gameLog = [...newState.gameLog, gameOverEntry];
  }

  return newState;
}

/**
 * 计算月收入
 * 基于客户数、产品质量、市场占有率
 */
export function calculateMonthlyIncome(company: CompanyState): number {
  // 基础收入 = 客户数 * 基础客单价
  const basePricePerClient = 5000;

  // 产品质量加成
  const qualityMultiplier = 0.5 + (company.productQuality / 100) * 1.0;

  // 市场占有率加成
  const marketMultiplier = 0.7 + (company.marketShare / 100) * 0.8;

  // 团队效率加成
  const teamEfficiency = Math.min(1.5, 1 + company.teamSize * 0.05);

  const income = Math.floor(
    company.clients * basePricePerClient * qualityMultiplier * marketMultiplier * teamEfficiency
  );

  return Math.max(0, income);
}

/**
 * 计算月支出
 */
export function calculateMonthlyExpense(company: CompanyState): number {
  let totalExpense = 0;

  // 办公室租金
  totalExpense += OFFICE_RENT[company.officeLevel] || 0;

  // 员工薪资
  const employeeCount = Math.max(0, company.teamSize - 1); // 减去创始人自己
  totalExpense += employeeCount * AVG_SALARY;

  // 基础运营费用（水电、网络、软件等）
  totalExpense += 2000;

  // 营销费用（基于市场占有率，占有率越高维护成本越高）
  totalExpense += Math.floor(company.marketShare * 50);

  return totalExpense;
}

/**
 * 计算每日精力恢复
 */
function calculateDailyEnergyRecovery(state: GameState): number {
  let recovery = 3; // 基础恢复

  // 心理健康高时恢复更多
  if (state.character.mentalHealth > 70) recovery += 2;
  else if (state.character.mentalHealth < 30) recovery -= 1;

  // 倦怠风险高时恢复减少
  if (state.character.burnoutRisk > 60) recovery -= 2;
  else if (state.character.burnoutRisk > 40) recovery -= 1;

  // 健康高时恢复更多
  if (state.character.health > 70) recovery += 1;

  return Math.max(0, recovery);
}

/**
 * 计算贷款月供
 */
function calculateLoanPayment(state: GameState): number {
  // 简化处理：从gameLog中查找贷款记录
  const loanLogs = state.gameLog.filter(
    log => log.message.includes('[贷款]')
  );
  if (loanLogs.length === 0) return 0;

  // 解析最后一次贷款金额
  const lastLoanLog = loanLogs[loanLogs.length - 1];
  const match = lastLoanLog.message.match(/金额:\s*¥([\d,]+)/);
  if (!match) return 0;

  const loanAmount = parseInt(match[1].replace(/,/g, ''), 10);
  return Math.floor(loanAmount * LOAN_MONTHLY_FACTOR);
}

/**
 * 申请贷款
 */
export function takeLoan(state: GameState, amount: number): GameState {
  const newState = { ...state };
  newState.company = {
    ...newState.company,
    cash: newState.company.cash + amount,
  };

  const monthlyPayment = Math.floor(amount * LOAN_MONTHLY_FACTOR);
  const totalRepayment = Math.floor(amount * (1 + LOAN_INTEREST_RATE));

  const logEntry = {
    day: newState.currentDay,
    type: 'system' as const,
    message: `[贷款] 成功申请贷款 ¥${amount.toLocaleString()}，年利率 ${(LOAN_INTEREST_RATE * 100).toFixed(0)}%，月供约 ¥${monthlyPayment.toLocaleString()}，总还款额 ¥${totalRepayment.toLocaleString()}`,
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 获取贷款信息
 */
export function getLoanInfo(state: GameState): LoanInfo | null {
  const loanLogs = state.gameLog.filter(
    log => log.message.includes('[贷款]')
  );
  if (loanLogs.length === 0) return null;

  const lastLoanLog = loanLogs[loanLogs.length - 1];
  const match = lastLoanLog.message.match(/金额:\s*¥([\d,]+)/);
  if (!match) return null;

  const amount = parseInt(match[1].replace(/,/g, ''), 10);
  return {
    amount,
    interestRate: LOAN_INTEREST_RATE,
    remainingDebt: amount,
    monthlyPayment: Math.floor(amount * LOAN_MONTHLY_FACTOR),
  };
}

/**
 * 获取财务摘要
 */
export function getFinanceSummary(state: GameState) {
  const company = state.company;
  const monthlyIncome = calculateMonthlyIncome(company);
  const monthlyExpense = calculateMonthlyExpense(company);
  const tax = Math.floor(monthlyIncome * TAX_RATE);
  const netProfit = monthlyIncome - monthlyExpense - tax;
  const runway = monthlyExpense > 0 ? Math.floor(company.cash / monthlyExpense) : Infinity;

  return {
    cash: company.cash,
    monthlyIncome,
    monthlyExpense,
    tax,
    netProfit,
    totalProfit: company.totalProfit,
    runway: runway === Infinity ? '无限' : `${runway} 个月`,
    officeRent: OFFICE_RENT[company.officeLevel] || 0,
    employeeCost: Math.max(0, company.teamSize - 1) * AVG_SALARY,
    loanInfo: getLoanInfo(state),
  };
}

/**
 * 升级办公室
 */
export function upgradeOffice(state: GameState): GameState {
  const newState = { ...state };
  const currentLevel = newState.company.officeLevel;

  if (currentLevel >= 5) {
    return state; // 已经是最高级
  }

  const upgradeCosts: Record<number, number> = {
    1: 2000,   // 共享工位
    2: 8000,   // 小办公室
    3: 30000,  // 中型办公室
    4: 100000, // 大型办公室
  };

  const cost = upgradeCosts[currentLevel] || 0;

  if (newState.company.cash < cost) {
    return state; // 资金不足
  }

  newState.company = {
    ...newState.company,
    cash: newState.company.cash - cost,
    officeLevel: currentLevel + 1,
  };

  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: `[升级] 办公室升级到 ${getOfficeName(currentLevel + 1)}，花费 ¥${cost.toLocaleString()}`,
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/** 获取办公室名称 */
export function getOfficeName(level: number): string {
  const names: Record<number, string> = {
    1: '在家办公',
    2: '共享工位',
    3: '小型办公室',
    4: '中型办公室',
    5: '大型办公室',
  };
  return names[level] || '未知';
}

/** 获取升级费用 */
export function getUpgradeCost(currentLevel: number): number {
  const costs: Record<number, number> = {
    1: 2000,
    2: 8000,
    3: 30000,
    4: 100000,
  };
  return costs[currentLevel] || 0;
}
