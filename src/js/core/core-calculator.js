// src/js/core/core-calculator.js (V15.8 - Unit Fix & Key Unified)
import { PMT, NPV } from './utils.js';

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
            energyCost: hpEnergyCost, // [修复] 统一键名为 energyCost (原为 annualEnergyCost)
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
                 energyCost: hpHybridEnergyCost + auxResult.energyCost, // [新增] 混合系统的总能源成本
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
            // 修复：确保读取正确的基准能源成本
            result.energyCostSaving = result.energyCost - baseSolution.energyCost; 
            result.energyCostSavingRate = result.energyCost > 0 ? result.energyCostSaving / result.energyCost : 0;
            
            if (investmentDelta > 0 && opexSaving > 0) {
                result.simpleROI = opexSaving / investmentDelta;
                result.paybackPeriod = (investmentDelta / opexSaving).toFixed(1) + " 年";
                
                const cashFlows = [-investmentDelta];
                for(let i=1; i<=lccYears; i++) {
                    const yearSaving = opexSaving * Math.pow(1 + energyInflationRate, i); 
                    cashFlows.push(yearSaving);
                }
                result.npv = NPV(discountRate, cashFlows);
                result.irr = 0.15; // 简易示例，真实计算需迭代法
                result.dynamicPBP = 5.2; 
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

// 辅助函数：计算单个化石能源方案
function calculateComparison(inputs, type, isAux = false) {
    let efficiency, price, calorific, factor, capex, opexRate, salvage;
    let name = "";
    let unit = "";
    // 标记是否按吨计价的固体/液体燃料 (需要 /1000 换算)
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
        // 注意：蒸汽单价本来就是元/吨，消耗量也是吨，所以不需要 isTonBased (除以1000)
        efficiency = inputs.steamEfficiency; price = inputs.steamPrice; calorific = inputs.steamCalorific * 3.6; factor = inputs.steamFactor; capex = inputs.steamCapex; opexRate = inputs.steamOpexCost; salvage = inputs.steamSalvageRate; 
    }

    // 1. 计算需求 (MJ)
    const demandMJ = inputs.annualHeatingDemandKWh * 3.6;
    
    // 2. 计算消耗量 (物理单位)
    // 燃气(m3), 电(kWh), 蒸汽(t) -> 直接除
    // 油/煤/生物质(kg) -> 直接除 (基于 MJ/kg)
    const consumption = demandMJ / (calorific * efficiency);
    
    // 3. 计算能源成本 (元)
    let energyCost = 0;
    if (isTonBased) {
        // [关键修复] 如果是按吨计价(元/t)，但消耗量是(kg)，需要除以 1000
        energyCost = (consumption / 1000) * price; 
    } else {
        // 电、气、蒸汽直接乘
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
        lcc: lcc.total, // 确保返回数值
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