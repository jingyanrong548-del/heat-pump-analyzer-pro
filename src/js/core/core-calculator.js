// src/js/core/core-calculator.js (V15.10 - Real Financial Algorithms)
import { NPV } from './utils.js';

/**
 * 核心计算函数
 */
export function calculate(inputs) {
    const {
        lccYears, discountRate, energyInflationRate, opexInflationRate,
        hpHostCapex, hpStorageCapex, hpSalvageRate, hpCop, hpOpexCost,
        annualHeatingDemandKWh, isHybridMode, hybridLoadShare,
        hybridAuxHeaterCapex, hybridAuxHeaterOpex, hybridAuxHeaterType,
        compare, analysisMode
    } = inputs;

    // 1. 计算工业热泵 (HP)
    let hpResults = {};
    let hybridResults = {};
    const steamTonsPerYear = annualHeatingDemandKWh / 700;

    if (analysisMode === 'bot') {
        hpResults = { type: 'hp', name: 'BOT项目', lcc: 0, opex: 0, energyCost: 0 };
    } else {
        // 1.1 纯热泵
        const hpElecConsumption = annualHeatingDemandKWh / hpCop;
        const hpEnergyCost = calculateEnergyCost(hpElecConsumption, inputs, 'electricity');
        const hpTotalOpex = hpEnergyCost + hpOpexCost;
        const hpUnitCost = hpTotalOpex / steamTonsPerYear;

        const hpLcc = calculateLCC({
            capex: hpHostCapex + hpStorageCapex,
            salvageRate: hpSalvageRate,
            opex: hpTotalOpex,
            years: lccYears,
            discountRate, energyInflationRate, opexInflationRate
        });

        hpResults = {
            type: 'hp',
            name: '工业热泵',
            initialInvestment: hpHostCapex + hpStorageCapex,
            energyCost: hpEnergyCost, 
            annualOpex: hpOpexCost,
            opex: hpTotalOpex,
            consumption: hpElecConsumption,
            consumptionUnit: 'kWh',
            co2: calculateCO2(hpElecConsumption, inputs, 'electricity'),
            lcc: hpLcc,
            cost_per_steam_ton: hpUnitCost, 
            electricity_per_steam_ton: hpElecConsumption / steamTonsPerYear,
            cost_per_kwh_heat: hpTotalOpex / annualHeatingDemandKWh
        };

        // 1.2 混合模式
        if (isHybridMode) {
             const hpHybridHeat = annualHeatingDemandKWh * hybridLoadShare;
             const auxHybridHeat = annualHeatingDemandKWh * (1 - hybridLoadShare);
             
             const hpHybridElec = hpHybridHeat / hpCop;
             const hpHybridEnergyCost = calculateEnergyCost(hpHybridElec, inputs, 'electricity');
             
             const auxResult = calculateComparison({
                 ...inputs, 
                 annualHeatingDemandKWh: auxHybridHeat
             }, hybridAuxHeaterType, true);

             const hybridTotalOpex = hpHybridEnergyCost + inputs.hpOpexCost + auxResult.opex;
             
             const hybridLcc = calculateLCC({
                 capex: (hpHostCapex + hpStorageCapex) + hybridAuxHeaterCapex,
                 salvageRate: hpSalvageRate,
                 opex: hybridTotalOpex,
                 years: lccYears,
                 discountRate, energyInflationRate, opexInflationRate
             });

             hybridResults = {
                 isHybrid: true,
                 name: '混合系统',
                 type: 'hybrid',
                 opex: hybridTotalOpex,
                 energyCost: hpHybridEnergyCost + auxResult.energyCost,
                 co2: calculateCO2(hpHybridElec, inputs, 'electricity') + auxResult.co2,
                 lcc: hybridLcc,
                 cost_per_steam_ton: hybridTotalOpex / steamTonsPerYear,
                 initialInvestment: (hpHostCapex + hpStorageCapex) + hybridAuxHeaterCapex
             };
        }
    }

    // 2. 计算对比方案
    const comparisons = [];
    const activeComparisons = inputs.compare;
    const baseSolution = isHybridMode ? hybridResults : hpResults;

    Object.keys(activeComparisons).forEach(key => {
        if (activeComparisons[key]) {
            const result = calculateComparison(inputs, key);
            
            const compUnitCost = result.opex / steamTonsPerYear;
            result.cost_per_steam_ton = compUnitCost;

            const investmentDelta = baseSolution.initialInvestment - result.initialInvestment;
            const opexSaving = result.opex - baseSolution.opex;
            
            result.opexSaving = opexSaving;
            result.energyCostSaving = result.energyCost - baseSolution.energyCost; 
            result.energyCostSavingRate = result.energyCost > 0 ? result.energyCostSaving / result.energyCost : 0;
            
            if (investmentDelta > 0 && opexSaving > 0) {
                // 静态 ROI & PBP
                result.simpleROI = opexSaving / investmentDelta;
                result.paybackPeriod = (investmentDelta / opexSaving).toFixed(1) + " 年";
                
                // 构建现金流用于计算高级指标
                // Year 0: 负的投资差额
                const cashFlows = [-investmentDelta];
                
                // [修复] 动态回收期计算逻辑
                let cumulativeDiscountedCashFlow = -investmentDelta;
                let dynamicPaybackYear = null;

                for(let i=1; i<=lccYears; i++) {
                    // 考虑能源通胀带来的节省增加 (Nominal Saving)
                    const nominalSaving = opexSaving * Math.pow(1 + energyInflationRate, i); 
                    cashFlows.push(nominalSaving);

                    // 计算当年折现后的现金流 (Discounted CF)
                    const discountedCF = nominalSaving / Math.pow(1 + discountRate, i);
                    
                    const prevCumulative = cumulativeDiscountedCashFlow;
                    cumulativeDiscountedCashFlow += discountedCF;

                    // 如果尚未回本，且当前累计现金流转正，则进行插值计算
                    if (dynamicPaybackYear === null && cumulativeDiscountedCashFlow >= 0) {
                        const fraction = Math.abs(prevCumulative) / discountedCF;
                        dynamicPaybackYear = (i - 1) + fraction;
                    }
                }

                // [修复] 真实计算 NPV
                result.npv = NPV(discountRate, cashFlows);
                
                // [修复] 真实计算 IRR (使用二分法迭代)
                result.irr = calculateIRR(cashFlows);
                
                // [修复] 赋值动态回收期
                result.dynamicPBP = dynamicPaybackYear ? dynamicPaybackYear : null; 

            } else {
                result.simpleROI = null;
                result.paybackPeriod = "无法计算";
                result.npv = baseSolution.lcc.total - result.lcc.total;
                result.irr = null;
                result.dynamicPBP = null;
            }

            result.co2Reduction = Math.max(0, result.co2 - baseSolution.co2);
            result.treesPlanted = result.co2Reduction * 50;

            comparisons.push(result);
        }
    });

    return {
        hp: hpResults,
        hybridSystem: hybridResults,
        isHybridMode,
        comparisons,
        lccParams: { lccYears, discountRate },
        analysisMode,
        solutions: [hpResults, ...comparisons]
    };
}

// --- 内部财务工具函数 ---

/**
 * 计算内部收益率 (IRR)
 * 使用二分法逼近，寻找 NPV = 0 时的折现率
 */
function calculateIRR(cashFlows, guess = 0.1) {
    let min = -0.99;
    let max = 2.0; // 假设最大 IRR 为 200%
    let iter = 0;
    
    while(iter < 100) { // 最多迭代100次防止死循环
        const mid = (min + max) / 2;
        let npv = 0;
        for(let i=0; i<cashFlows.length; i++) {
            npv += cashFlows[i] / Math.pow(1 + mid, i);
        }
        
        if(Math.abs(npv) < 1) return mid; // 精度满足
        
        if(npv > 0) {
            min = mid; // 利率太低，导致NPV为正，提高下限
        } else {
            max = mid; // 利率太高，导致NPV为负，降低上限
        }
        iter++;
    }
    return (min + max) / 2;
}

// 辅助函数：计算单个化石能源方案
function calculateComparison(inputs, type, isAux = false) {
    let efficiency, price, calorific, factor, capex, opexRate, salvage;
    let name = "";
    let unit = "";
    let isTonBased = false; 

    if (type === 'gas') { 
        name = '天然气锅炉'; unit = 'm³'; 
        efficiency = inputs.gasBoilerEfficiency; price = inputs.gasPrice; calorific = inputs.gasCalorific; factor = inputs.gasFactor; capex = inputs.gasBoilerCapex; opexRate = inputs.gasOpexCost; salvage = inputs.gasSalvageRate; 
    }
    else if (type === 'fuel') { 
        name = '燃油锅炉'; unit = 'kg'; isTonBased = true;
        efficiency = inputs.fuelBoilerEfficiency; price = inputs.fuelPrice; calorific = inputs.fuelCalorific; factor = inputs.fuelFactor; capex = inputs.fuelBoilerCapex; opexRate = inputs.fuelOpexCost; salvage = inputs.fuelSalvageRate; 
    }
    else if (type === 'coal') { 
        name = '燃煤锅炉'; unit = 'kg'; isTonBased = true;
        efficiency = inputs.coalBoilerEfficiency; price = inputs.coalPrice; calorific = inputs.coalCalorific; factor = inputs.coalFactor; capex = inputs.coalBoilerCapex; opexRate = inputs.coalOpexCost; salvage = inputs.coalSalvageRate; 
    }
    else if (type === 'biomass') { 
        name = '生物质锅炉'; unit = 'kg'; isTonBased = true;
        efficiency = inputs.biomassBoilerEfficiency; price = inputs.biomassPrice; calorific = inputs.biomassCalorific; factor = inputs.biomassFactor; capex = inputs.biomassBoilerCapex; opexRate = inputs.biomassOpexCost; salvage = inputs.biomassSalvageRate; 
    }
    else if (type === 'electric') { 
        name = '电锅炉'; unit = 'kWh'; 
        efficiency = inputs.electricBoilerEfficiency; price = inputs.priceTiers?.[0]?.price || 0.7; calorific = 3.6; factor = inputs.gridFactor; capex = inputs.electricBoilerCapex; opexRate = inputs.electricOpexCost; salvage = inputs.electricSalvageRate; 
    }
    else if (type === 'steam') { 
        name = '管网蒸汽'; unit = 't'; 
        efficiency = inputs.steamEfficiency; price = inputs.steamPrice; calorific = inputs.steamCalorific * 3.6; factor = inputs.steamFactor; capex = inputs.steamCapex; opexRate = inputs.steamOpexCost; salvage = inputs.steamSalvageRate; 
    }

    const demandMJ = inputs.annualHeatingDemandKWh * 3.6;
    const consumption = demandMJ / (calorific * efficiency);
    
    let energyCost = 0;
    if (isTonBased) {
        energyCost = (consumption / 1000) * price; 
    } else {
        energyCost = consumption * price;
    }

    const opexCost = isAux ? 0 : opexRate; 
    const totalOpex = energyCost + opexCost;
    const co2 = (consumption * factor) / 1000; 

    const lcc = calculateLCC({
        capex: capex,
        salvageRate: salvage,
        opex: totalOpex,
        years: inputs.lccYears,
        discountRate: inputs.discountRate,
        energyInflationRate: inputs.energyInflationRate,
        opexInflationRate: inputs.opexInflationRate
    });

    return {
        key: type,
        name,
        initialInvestment: capex,
        energyCost,
        opex: totalOpex,
        consumption,
        consumptionUnit: unit,
        co2,
        lcc: lcc.total, 
        electricalPriceRatio: (type === 'electric' || type === 'hp') ? 1 : (inputs.priceTiers?.[0]?.price / (price / (calorific/3.6)))
    };
}

function calculateEnergyCost(consumption, inputs, type) {
    if (type === 'electricity') {
        const avgPrice = inputs.priceTiers ? inputs.priceTiers.reduce((acc, t) => acc + (t.price * t.dist / 100), 0) : 0.7;
        return consumption * avgPrice;
    }
    return 0;
}

function calculateCO2(consumption, inputs, type) {
    if (type === 'electricity') {
         return (consumption * inputs.gridFactor) / 1000;
    }
    return 0;
}

function calculateLCC(params) {
    const { capex, salvageRate, opex, years, discountRate, energyInflationRate, opexInflationRate } = params;
    let totalNPV = capex;
    const realRate = (1 + discountRate) / (1 + energyInflationRate) - 1;
    const pviwa = (1 - Math.pow(1 + realRate, -years)) / realRate;
    const opexNPV = opex * pviwa;
    const salvageValue = capex * salvageRate;
    const salvagePV = salvageValue / Math.pow(1 + discountRate, years);
    totalNPV = totalNPV + opexNPV - salvagePV;
    return {
        total: totalNPV,
        capex: capex,
        opexNPV: opexNPV
    };
}