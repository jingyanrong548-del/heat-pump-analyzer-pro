// src/js/utils.js
// V18.3.3 Fix: Physics Formula Unit Correction (Ton -> Kg)

// ==========================================
// 1. 数值格式化函数 (Formatter)
// ==========================================

/**
 * 将数值格式化为“万元”字符串
 */
export function fWan(val, decimals = 2) {
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return (num / 10000).toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * 将数值格式化为“元”字符串
 */
export function fYuan(val, decimals = 2) {
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return num.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * 格式化整数
 */
export function fInt(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return Math.round(num).toLocaleString('zh-CN');
}

/**
 * 通用数字格式化
 */
export function fNum(val, decimals = 2) {
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return num.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * 格式化吨数
 */
export function fTon(val) {
    return fNum(val, 1);
}

/**
 * 格式化 COP/SPF
 */
export function fCop(val) {
    return fNum(val, 2);
}

/**
 * 格式化百分比
 */
export function fPercent(val, decimals = 1) {
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return (num * 100).toFixed(decimals) + '%';
}

/**
 * 格式化年限
 */
export function fYears(val) {
    if (typeof val === 'string' && val.includes('>')) return val; 
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return num.toFixed(1);
}

// ==========================================
// 2. 物理计算辅助函数 (Physics) - [已修复]
// ==========================================

/**
 * 计算锅炉运行效率
 * 修复说明：之前计算 Output 时直接使用了吨数 (mass)，导致结果小了1000倍。
 * 修正后：mass * 1000 将吨转换为千克。
 */
export function calculateBoilerEfficiency(fuelType, fuelAmount, calorificValue, outputType, params) {
    // 1. 计算总投入能量 (Input Energy) - 单位转换为 GJ
    // calorificValue 单位假设：gas为MJ/m3, 固体液体为MJ/kg
    if (!fuelAmount || !calorificValue) {
        return { error: "请输入有效的燃料消耗量和热值" };
    }

    // Input (GJ) = Amount * MJ/unit / 1000
    const inputEnergyGJ = (fuelAmount * calorificValue) / 1000;

    // 2. 计算总产出能量 (Output Energy) - 单位转换为 GJ
    let outputEnergyGJ = 0;

    if (outputType === 'water') {
        // 热水: Q = c * m * Δt
        // c ≈ 4.186 kJ/(kg·℃)
        // mass (吨) -> mass * 1000 (kg)
        // Q (kJ) = 4.186 * (mass * 1000) * (tempOut - tempIn)
        // Output (GJ) = Q / 1,000,000
        
        const { mass, tempIn, tempOut } = params;
        if (!mass || tempIn === undefined || !tempOut) return { error: "请输入完整的热水参数" };
        
        const deltaT = tempOut - tempIn;
        // [修复] 乘以 1000 (吨转千克)
        outputEnergyGJ = (4.186 * (mass * 1000) * deltaT) / 1000000;
        
    } else if (outputType === 'steam') {
        // 蒸汽: Q = m * (h_steam - h_feedwater)
        // 饱和蒸汽焓值 h_g (0.8MPa) ≈ 2770 kJ/kg
        // 补水焓值 h_f ≈ 4.186 * feedTemp
        
        const { mass, pressure, feedTemp } = params;
        if (!mass || !pressure || feedTemp === undefined) return { error: "请输入完整的蒸汽参数" };

        const steamEnthalpy = 2770; 
        const waterEnthalpy = 4.186 * feedTemp;
        
        // [修复] 乘以 1000 (吨转千克)
        // Output (GJ) = (mass * 1000 * (h_steam - h_water)) / 1,000,000
        outputEnergyGJ = ((mass * 1000) * (steamEnthalpy - waterEnthalpy)) / 1000000;
    }

    if (inputEnergyGJ <= 0) return { error: "计算得出的投入能量无效" };

    const efficiency = (outputEnergyGJ / inputEnergyGJ) * 100;

    return {
        efficiency,
        inputEnergy: inputEnergyGJ,
        outputEnergy: outputEnergyGJ,
        error: null
    };
}