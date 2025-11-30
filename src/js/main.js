// src/js/main.js
// V18.5: Unit Normalization Engine & Green Power Logic

import '../css/style.css'; 
import { initializeUI, readAllInputs, renderDashboard } from './ui.js';
import { showGlobalNotification } from './ui-dashboard.js';
import { ENERGY_CONVERTERS } from './config.js'; // 导入换算系数

const KWH_PER_TON_STEAM = 697.8;

/**
 * 辅助：将用户输入的 {value, unit} 转换为标准 MJ
 */
function normalizeToMJ(inputObj) {
    if (!inputObj || !inputObj.value) return 0;
    const factor = ENERGY_CONVERTERS[inputObj.unit] || 1;
    return inputObj.value * factor;
}

function calculateLCC(inputs) {
    const {
        heatingLoad, operatingHours, annualHeatingDemandKWh,
        lccYears, discountRate, energyInflationRate, opexInflationRate,
        hpHostCapex, hpStorageCapex, hpSalvageRate, hpCop, hpOpexCost,
        priceTiers, gridFactor
    } = inputs;

    let avgElecPrice = 0;
    if (priceTiers && priceTiers.length > 0) {
        let totalWeight = 0;
        let weightedSum = 0;
        priceTiers.forEach(t => {
            weightedSum += t.price * t.dist;
            totalWeight += t.dist;
        });
        avgElecPrice = totalWeight > 0 ? weightedSum / totalWeight : 0.7;
    } else {
        avgElecPrice = 0.7; 
    }

    const hpElecConsumption = annualHeatingDemandKWh / hpCop;
    const hpAnnualEnergyCost = hpElecConsumption * avgElecPrice;
    
    // gridFactor 已经由 ui.js 根据绿电开关处理过（如果是绿电则为0）
    const hpCo2 = (hpElecConsumption * gridFactor) / 1000; 
    
    const annualTotalCost = hpAnnualEnergyCost + hpOpexCost;

    const totalCapex = hpHostCapex + hpStorageCapex;
    let totalNPV = totalCapex;
    let energyNPV = 0;
    let opexNPV = 0;
    
    for (let y = 1; y <= lccYears; y++) {
        const yearEnergyCost = hpAnnualEnergyCost * Math.pow(1 + energyInflationRate, y - 1);
        const yearOpexCost = hpOpexCost * Math.pow(1 + opexInflationRate, y - 1);
        const discountFactor = 1 / Math.pow(1 + discountRate, y);
        energyNPV += yearEnergyCost * discountFactor;
        opexNPV += yearOpexCost * discountFactor;
    }
    
    const salvageValue = totalCapex * hpSalvageRate;
    const salvageNPV = salvageValue / Math.pow(1 + discountRate, lccYears);
    totalNPV = totalNPV + energyNPV + opexNPV - salvageNPV;

    const equivalentSteamTons = annualHeatingDemandKWh / KWH_PER_TON_STEAM;
    const unitSteamCost = equivalentSteamTons > 0 ? (annualTotalCost / equivalentSteamTons) : 0;

    return {
        avgElecPrice, 
        initialInvestment: totalCapex,
        annualEnergyCost: hpAnnualEnergyCost,
        annualOpex: hpOpexCost,
        annualTotalCost: annualTotalCost,
        co2: hpCo2,
        unitSteamCost: unitSteamCost, 
        lcc: { total: totalNPV, capex: totalCapex, energy: energyNPV, opex: opexNPV, residual: -salvageNPV }
    };
}

function calculateComparison(inputs, hpResult) {
    const comparisons = [];
    const equivalentSteamTons = inputs.annualHeatingDemandKWh / KWH_PER_TON_STEAM;

    // 通用计算函数：支持单位归一化
    // calorificInput: 可以是单纯数值(旧逻辑兼容)或 {value, unit} 对象
    const calcOne = (name, capex, eff, price, calorificInput, opex, factor, salvageRate, unitType) => {
        
        // 1. 热值归一化 (全部转为 MJ)
        let calorificMJ = 0;
        if (typeof calorificInput === 'object') {
            calorificMJ = normalizeToMJ(calorificInput);
        } else {
            calorificMJ = calorificInput; // 兼容电(3.6)等直接传值的
        }

        if (eff <= 0 || calorificMJ <= 0) return null;
        
        // 2. 能耗计算 (需求 MJ / (热值 MJ * 效率))
        const demandMJ = inputs.annualHeatingDemandKWh * 3.6; 
        let consumption = demandMJ / (calorificMJ * eff); 
        
        // 3. 成本计算
        // 注意：config.js 中定义的 Gas 价格是 元/m³，固体是 元/吨
        // consumption 这里的单位取决于 calorific 的分母
        // 如果 calorific 是 MJ/kg，consumption 就是 kg
        // 如果 calorific 是 MJ/m³，consumption 就是 m³
        
        let annualEnergyCost = 0;
        if (unitType === 'ton') {
            // 固体/液体：price 是 元/吨，consumption 是 kg
            // cost = (kg / 1000) * (元/吨)
            annualEnergyCost = (consumption / 1000) * price;
        } else if (unitType === 'm3') {
            // 气体：price 是 元/m³，consumption 是 m³
            annualEnergyCost = consumption * price;
        } else {
            // 电：price 是 元/kWh，consumption 是 kWh (如果传入的是电热值3.6MJ)
            annualEnergyCost = consumption * price;
        }

        const co2 = (consumption * factor) / 1000; 
        const annualTotalCost = annualEnergyCost + opex;

        let lcc = capex;
        for (let y = 1; y <= inputs.lccYears; y++) {
            const e = annualEnergyCost * Math.pow(1 + inputs.energyInflationRate, y - 1);
            const o = opex * Math.pow(1 + inputs.opexInflationRate, y - 1);
            lcc += (e + o) / Math.pow(1 + inputs.discountRate, y);
        }
        lcc -= (capex * salvageRate) / Math.pow(1 + inputs.discountRate, inputs.lccYears);

        const deltaI = hpResult.initialInvestment - capex;
        const annualSaving = annualTotalCost - hpResult.annualTotalCost;
        
        const savingsStream = [-deltaI]; 
        let dynamicPBP = "> " + inputs.lccYears;
        let cumulativeDCF = -deltaI;
        let recovered = false;
        let totalRawSavings = 0;

        for (let y = 1; y <= inputs.lccYears; y++) {
            const costBoiler = annualEnergyCost * Math.pow(1 + inputs.energyInflationRate, y-1) + opex * Math.pow(1 + inputs.opexInflationRate, y-1);
            const costHP = hpResult.annualEnergyCost * Math.pow(1 + inputs.energyInflationRate, y-1) + hpResult.annualOpex * Math.pow(1 + inputs.opexInflationRate, y-1);
            const saving = costBoiler - costHP;
            
            savingsStream.push(saving);
            totalRawSavings += saving;
            
            const dcf = saving / Math.pow(1 + inputs.discountRate, y);
            const prevDCF = cumulativeDCF;
            cumulativeDCF += dcf;
            
            if (!recovered && cumulativeDCF >= 0) {
                const fraction = Math.abs(prevDCF) / dcf;
                dynamicPBP = ((y - 1) + fraction).toFixed(1); 
                recovered = true;
            }
        }

        let irr = null;
        if (deltaI > 0) {
             if (totalRawSavings < deltaI) { irr = null; } else { irr = calculateIRR(savingsStream); }
        } else {
            if (hpResult.annualTotalCost < annualTotalCost) { irr = 9.99; } else { irr = null; }
        }
        
        const savingRate = annualTotalCost > 0 ? (annualSaving / annualTotalCost) : 0;
        const unitSteamCost = equivalentSteamTons > 0 ? (annualTotalCost / equivalentSteamTons) : 0;

        return {
            name, initialInvestment: capex, annualEnergyCost, annualOpex: opex, 
            annualTotalCost: annualTotalCost,
            co2, lccTotal: lcc, annualSaving: annualSaving,
            savingRate: savingRate,     
            unitSteamCost: unitSteamCost, 
            paybackPeriod: deltaI > 0 ? (deltaI / annualSaving).toFixed(1) + " 年" : "立即",
            dynamicPBP: dynamicPBP, 
            irr, lccSaving: lcc - hpResult.lcc.total, co2Reduction: co2 - hpResult.co2
        };
    };

    // 注意：传入 calorificObj 对象
    if (inputs.compare.gas) comparisons.push(calcOne('天然气锅炉', inputs.gasBoilerCapex, inputs.gasBoilerEfficiency, inputs.gasPrice, inputs.gasCalorificObj, inputs.gasOpexCost, inputs.gasFactor, inputs.gasSalvageRate, 'm3'));
    if (inputs.compare.coal) comparisons.push(calcOne('燃煤锅炉', inputs.coalBoilerCapex, inputs.coalBoilerEfficiency, inputs.coalPrice, inputs.coalCalorificObj, inputs.coalOpexCost, inputs.coalFactor, inputs.coalSalvageRate, 'ton'));
    if (inputs.compare.fuel) comparisons.push(calcOne('燃油锅炉', inputs.fuelBoilerCapex, inputs.fuelBoilerEfficiency, inputs.fuelPrice, inputs.fuelCalorificObj, inputs.fuelOpexCost, inputs.fuelFactor, inputs.fuelSalvageRate, 'ton'));
    if (inputs.compare.biomass) comparisons.push(calcOne('生物质锅炉', inputs.biomassBoilerCapex, inputs.biomassBoilerEfficiency, inputs.biomassPrice, inputs.biomassCalorificObj, inputs.biomassOpexCost, inputs.biomassFactor, inputs.biomassSalvageRate, 'ton'));
    if (inputs.compare.electric) comparisons.push(calcOne('电锅炉', inputs.electricBoilerCapex, inputs.electricBoilerEfficiency, hpResult.avgElecPrice, 3.6, inputs.electricOpexCost, inputs.gridFactor, inputs.electricSalvageRate, 'kwh'));
    if (inputs.compare.steam) comparisons.push(calcOne('管网蒸汽', inputs.steamCapex, inputs.steamEfficiency, inputs.steamPrice, inputs.steamCalorificObj, inputs.steamOpexCost, inputs.steamFactor, inputs.steamSalvageRate, 'ton')); // 蒸汽也是按吨计价

    return comparisons.filter(c => c !== null);
}

function calculateIRR(cashFlows, guess = 0.1) {
    const maxIter = 100; const tol = 1e-6; let x = guess;
    for (let i = 0; i < maxIter; i++) {
        let f = 0; let df = 0;
        for (let t = 0; t < cashFlows.length; t++) {
            f += cashFlows[t] / Math.pow(1 + x, t);
            df -= t * cashFlows[t] / Math.pow(1 + x, t + 1);
        }
        const newX = x - f / df;
        if (Math.abs(newX - x) < tol) return newX;
        x = newX;
    }
    return null; 
}

function handleCalculate() {
    const inputs = readAllInputs((msg) => alert(msg));
    if (!inputs) return;
    const hpResult = calculateLCC(inputs);
    const comparisons = calculateComparison(inputs, hpResult);
    const results = { inputs, hp: hpResult, comparisons, isHybridMode: false };
    renderDashboard(results);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Phoenix Plan V18.5 Engine (Corrected Units) Initializing...');
    initializeUI(handleCalculate);
    setTimeout(() => handleCalculate(), 500);
});