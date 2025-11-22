// src/js/core/utils.js (V15.7 - Complete Utilities)

/**
 * 格式化为“万元”，保留2位小数
 */
export function fWan(num) {
    if (num === null || num === undefined) return '-';
    return (num / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * 格式化为金额（元），保留0位小数（整数）
 */
export function fYuan(num) {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * 格式化为整数，每三位加逗号
 */
export function fInt(num) {
    if (num === null || num === undefined) return '-';
    return Math.round(num).toLocaleString('zh-CN');
}

/**
 * 格式化为普通数字，保留指定小数位
 */
export function fNum(num, digits = 2) {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('zh-CN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/**
 * 格式化为吨，保留1位小数
 */
export function fTon(num) {
    return fNum(num, 1);
}

/**
 * 格式化 COP，保留2位小数
 */
export function fCop(num) {
    return fNum(num, 2);
}

/**
 * 格式化百分比
 */
export function fPercent(num, digits = 2) {
    if (num === null || num === undefined || !isFinite(num)) return '-';
    return (num * 100).toFixed(digits) + '%';
}

/**
 * 格式化年份
 */
export function fYears(num) {
    if (num === null || num === undefined) return '-';
    return num.toFixed(1) + ' 年';
}

/**
 * 格式化投资额 (保留整数)
 */
export function fInvest(num) {
    return fInt(num);
}

// --- 财务计算函数 (本次修复补全) ---

/**
 * 计算净现值 (NPV)
 * @param {number} rate - 折现率
 * @param {Array<number>} values - 现金流数组 (第0年是初始投资，通常为负)
 */
export function NPV(rate, values) {
    let npv = 0;
    for (let i = 0; i < values.length; i++) {
        npv += values[i] / Math.pow(1 + rate, i);
    }
    return npv;
}

/**
 * 计算年金 (PMT) - 用于贷款计算
 * @param {number} rate - 利率
 * @param {number} nper - 期数
 * @param {number} pv - 现值
 */
export function PMT(rate, nper, pv) {
    if (rate === 0) return -(pv / nper);
    const pvif = Math.pow(1 + rate, nper);
    return -(rate * pv * pvif) / (pvif - 1);
}