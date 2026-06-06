import { GameState, CompanyState, LoanInfo } from '../types';
/**
 * 每日财务结算
 */
export declare function dailyFinanceSettlement(state: GameState): GameState;
/**
 * 每月财务结算
 */
export declare function monthlyFinanceSettlement(state: GameState): GameState;
/**
 * 计算月收入
 * 基于客户数、产品质量、市场占有率
 */
export declare function calculateMonthlyIncome(company: CompanyState): number;
/**
 * 计算月支出
 */
export declare function calculateMonthlyExpense(company: CompanyState): number;
/**
 * 申请贷款
 */
export declare function takeLoan(state: GameState, amount: number): GameState;
/**
 * 获取贷款信息
 */
export declare function getLoanInfo(state: GameState): LoanInfo | null;
/**
 * 获取财务摘要
 */
export declare function getFinanceSummary(state: GameState): {
    cash: number;
    monthlyIncome: number;
    monthlyExpense: number;
    tax: number;
    netProfit: number;
    totalProfit: number;
    runway: string;
    officeRent: number;
    employeeCost: number;
    loanInfo: LoanInfo | null;
};
/**
 * 升级办公室
 */
export declare function upgradeOffice(state: GameState): GameState;
/** 获取办公室名称 */
export declare function getOfficeName(level: number): string;
/** 获取升级费用 */
export declare function getUpgradeCost(currentLevel: number): number;
//# sourceMappingURL=financeSystem.d.ts.map