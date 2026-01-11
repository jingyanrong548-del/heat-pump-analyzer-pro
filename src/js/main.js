// src/js/main.js
// V9.0.0: Internationalization Support

import '../css/style.css'; 
import { initializeUI, readAllInputs, renderDashboard } from './ui.js';
import { showGlobalNotification } from './ui-dashboard.js';
import { ENERGY_CONVERTERS } from './config.js';
import { initI18n, setLanguage, t, getCurrentLanguage } from './i18n.js';

// Import t function for use in calculateComparison
const getComparisonName = (type) => {
    const names = {
        gas: t('common.comparison.gas'),
        coal: t('common.comparison.coal'),
        fuel: t('common.comparison.fuel'),
        biomass: t('common.comparison.biomass'),
        electric: t('common.comparison.electric'),
        steam: t('common.comparison.steam')
    };
    return names[type] || type;
}; 

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
        priceTiers, gridFactor,
        // 混合动力参数
        isHybridMode, hybridLoadShare, hybridAuxHeaterCapex, hybridAuxHeaterType, hybridAuxHeaterOpex
    } = inputs;

    // 1. 计算加权平均电价
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

    // 2. 负荷分配
    // 热泵承担份额 (0-1)
    const shareRate = isHybridMode ? (hybridLoadShare / 100) : 1.0;
    const hpDemandKWh = annualHeatingDemandKWh * shareRate;
    const auxDemandKWh = annualHeatingDemandKWh * (1 - shareRate);

    // 3. 热泵部分计算
    const hpElecConsumption = hpDemandKWh / hpCop;
    const hpEnergyCost = hpElecConsumption * avgElecPrice;
    const hpCo2 = (hpElecConsumption * gridFactor) / 1000; // tCO2

    // 4. 辅热部分计算 (Flexible Aux Heater)
    let auxEnergyCost = 0;
    let auxCo2 = 0;
    
    if (isHybridMode && auxDemandKWh > 0) {
        let auxPrice = 0;      // 单价
        let auxEff = 1;        // 效率
        let auxCalorific = 0;  // 热值 (MJ/unit)
        let auxFactor = 0;     // 排放因子 (kg/unit)
        let unitType = 'ton';  // 计价单位类型 (ton, m3, kwh)

        // 根据选择的辅热类型，复用 input 中的参数
        switch (hybridAuxHeaterType) {
            case 'gas':
                auxPrice = inputs.gasPrice;
                auxEff = inputs.gasBoilerEfficiency;
                auxCalorific = normalizeToMJ(inputs.gasCalorificObj);
                auxFactor = inputs.gasFactor;
                unitType = 'm3';
                break;
            case 'coal':
                auxPrice = inputs.coalPrice;
                auxEff = inputs.coalBoilerEfficiency;
                auxCalorific = normalizeToMJ(inputs.coalCalorificObj);
                auxFactor = inputs.coalFactor;
                unitType = 'ton';
                break;
            case 'fuel':
                auxPrice = inputs.fuelPrice;
                auxEff = inputs.fuelBoilerEfficiency;
                auxCalorific = normalizeToMJ(inputs.fuelCalorificObj);
                auxFactor = inputs.fuelFactor;
                unitType = 'ton';
                break;
            case 'biomass':
                auxPrice = inputs.biomassPrice;
                auxEff = inputs.biomassBoilerEfficiency;
                auxCalorific = normalizeToMJ(inputs.biomassCalorificObj);
                auxFactor = inputs.biomassFactor;
                unitType = 'ton';
                break;
            case 'steam':
                auxPrice = inputs.steamPrice;
                auxEff = inputs.steamEfficiency; // 通常指换热效率
                auxCalorific = normalizeToMJ(inputs.steamCalorificObj);
                auxFactor = inputs.steamFactor;
                unitType = 'ton';
                break;
            case 'electric':
            default:
                auxPrice = avgElecPrice; // 用同样的电价
                auxEff = inputs.electricBoilerEfficiency;
                auxCalorific = 3.6; // 1 kWh = 3.6 MJ
                auxFactor = gridFactor;
                unitType = 'kwh';
                break;
        }

        // 计算辅热耗量与成本
        if (auxEff > 0 && auxCalorific > 0) {
            const auxDemandMJ = auxDemandKWh * 3.6;
            const auxConsumption = auxDemandMJ / (auxCalorific * auxEff); // 消耗量 (kg, m3, or kWh)
            
            // 计算费用
            if (unitType === 'ton') {
                auxEnergyCost = (auxConsumption / 1000) * auxPrice;
            } else {
                // m3 或 kWh 直接乘单价
                auxEnergyCost = auxConsumption * auxPrice;
            }

            // 计算排放
            auxCo2 = (auxConsumption * auxFactor) / 1000; // tCO2
        }
    }

    // 5. 汇总成本
    const totalInitialInvestment = hpHostCapex + hpStorageCapex + (isHybridMode ? hybridAuxHeaterCapex : 0);
    const totalAnnualEnergyCost = hpEnergyCost + auxEnergyCost;
    const totalAnnualOpex = hpOpexCost + (isHybridMode ? hybridAuxHeaterOpex : 0);
    const totalAnnualCost = totalAnnualEnergyCost + totalAnnualOpex;
    const totalCo2 = hpCo2 + auxCo2;

    // 6. LCC 现金流计算
    let totalNPV = totalInitialInvestment;
    let energyNPV = 0;
    let opexNPV = 0;
    
    for (let y = 1; y <= lccYears; y++) {
        const yearEnergyCost = totalAnnualEnergyCost * Math.pow(1 + energyInflationRate, y - 1);
        const yearOpexCost = totalAnnualOpex * Math.pow(1 + opexInflationRate, y - 1);
        const discountFactor = 1 / Math.pow(1 + discountRate, y);
        energyNPV += yearEnergyCost * discountFactor;
        opexNPV += yearOpexCost * discountFactor;
    }
    
    const salvageValue = totalInitialInvestment * hpSalvageRate;
    const salvageNPV = salvageValue / Math.pow(1 + discountRate, lccYears);
    totalNPV = totalNPV + energyNPV + opexNPV - salvageNPV;

    // 7. 核心指标
    const equivalentSteamTons = annualHeatingDemandKWh / KWH_PER_TON_STEAM;
    const unitSteamCost = equivalentSteamTons > 0 ? (totalAnnualCost / equivalentSteamTons) : 0;

    return {
        avgElecPrice, 
        initialInvestment: totalInitialInvestment,
        annualEnergyCost: totalAnnualEnergyCost,
        annualOpex: totalAnnualOpex,
        annualTotalCost: totalAnnualCost,
        co2: totalCo2,
        unitSteamCost: unitSteamCost, 
        // 细分数据供图表使用
        breakdown: {
            hpEnergy: hpEnergyCost,
            auxEnergy: auxEnergyCost,
            hpOpex: hpOpexCost,
            auxOpex: isHybridMode ? hybridAuxHeaterOpex : 0
        },
        lcc: { total: totalNPV, capex: totalInitialInvestment, energy: energyNPV, opex: opexNPV, residual: -salvageNPV }
    };
}

function calculateComparison(inputs, hpResult) {
    const comparisons = [];
    const equivalentSteamTons = inputs.annualHeatingDemandKWh / KWH_PER_TON_STEAM;

    const calcOne = (name, capex, eff, price, calorificInput, opex, factor, salvageRate, unitType) => {
        let calorificMJ = 0;
        if (typeof calorificInput === 'object') {
            calorificMJ = normalizeToMJ(calorificInput);
        } else {
            calorificMJ = calorificInput;
        }

        if (eff <= 0 || calorificMJ <= 0) return null;
        
        const demandMJ = inputs.annualHeatingDemandKWh * 3.6; 
        let consumption = demandMJ / (calorificMJ * eff); 
        
        let annualEnergyCost = 0;
        if (unitType === 'ton') {
            annualEnergyCost = (consumption / 1000) * price;
        } else {
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
            // 注意：这里 hpResult.annualEnergyCost 已经是混合动力后的总能源成本
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
            paybackPeriod: deltaI > 0 ? (deltaI / annualSaving).toFixed(1) + " " + t('dataTable.year') : t('dataTable.immediately'),
            dynamicPBP: dynamicPBP, 
            irr, lccSaving: lcc - hpResult.lcc.total, co2Reduction: co2 - hpResult.co2
        };
    };

    if (inputs.compare.gas) comparisons.push(calcOne(getComparisonName('gas'), inputs.gasBoilerCapex, inputs.gasBoilerEfficiency, inputs.gasPrice, inputs.gasCalorificObj, inputs.gasOpexCost, inputs.gasFactor, inputs.gasSalvageRate, 'm3'));
    if (inputs.compare.coal) comparisons.push(calcOne(getComparisonName('coal'), inputs.coalBoilerCapex, inputs.coalBoilerEfficiency, inputs.coalPrice, inputs.coalCalorificObj, inputs.coalOpexCost, inputs.coalFactor, inputs.coalSalvageRate, 'ton'));
    if (inputs.compare.fuel) comparisons.push(calcOne(getComparisonName('fuel'), inputs.fuelBoilerCapex, inputs.fuelBoilerEfficiency, inputs.fuelPrice, inputs.fuelCalorificObj, inputs.fuelOpexCost, inputs.fuelFactor, inputs.fuelSalvageRate, 'ton'));
    if (inputs.compare.biomass) comparisons.push(calcOne(getComparisonName('biomass'), inputs.biomassBoilerCapex, inputs.biomassBoilerEfficiency, inputs.biomassPrice, inputs.biomassCalorificObj, inputs.biomassOpexCost, inputs.biomassFactor, inputs.biomassSalvageRate, 'ton'));
    if (inputs.compare.electric) comparisons.push(calcOne(getComparisonName('electric'), inputs.electricBoilerCapex, inputs.electricBoilerEfficiency, hpResult.avgElecPrice, 3.6, inputs.electricOpexCost, inputs.gridFactor, inputs.electricSalvageRate, 'kwh'));
    if (inputs.compare.steam) comparisons.push(calcOne(getComparisonName('steam'), inputs.steamCapex, inputs.steamEfficiency, inputs.steamPrice, inputs.steamCalorificObj, inputs.steamOpexCost, inputs.steamFactor, inputs.steamSalvageRate, 'ton'));

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
    const results = { inputs, hp: hpResult, comparisons, isHybridMode: inputs.isHybridMode };
    renderDashboard(results);
}

// Language switch handler
let currentHandleCalculate = null;

function updateUIForLanguage() {
    if (currentHandleCalculate) {
        initializeUI(currentHandleCalculate);
        setTimeout(() => currentHandleCalculate(), 500);
    }
}

function setupLanguageSwitch() {
    const langBtn = document.getElementById('lang-switch-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const currentLang = getCurrentLanguage();
            const newLang = currentLang === 'zh' ? 'en' : 'zh';
            setLanguage(newLang);
            updateHTMLStaticText();
            updateUIForLanguage();
        });
    }
}

function updateHTMLStaticText() {
    // Update static HTML text elements
    const elements = {
        'page-title': 'page.title',
        'sidebar-title': 'page.benefitAnalysis',
        'sidebar-subtitle': 'page.subtitle',
        'dashboard-title': 'page.dashboard',
        'enable-comparison-label': 'button.enableComparison',
        'calculate-btn-text': 'button.calculate',
        'save-scenario-btn-text': 'button.saveScenario',
        'mobile-config-btn-text': 'button.config',
        'export-btn-text-short': 'button.export',
        'export-btn-text-full': 'button.exportReport',
        'card-annual-saving-label': 'card.annualSaving',
        'card-irr-label': 'card.irr',
        'card-pbp-label': 'card.pbp',
        'card-co2-label': 'card.co2Reduction',
        'placeholder-text': 'message.pleaseConfig',
        'chart-cost-title': 'chart.annualCostComparison',
        'chart-lcc-title': 'chart.lccBreakdown'
    };
    
    Object.entries(elements).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = t(key);
        }
    });
    
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.textContent = t(key);
        }
    });
    
    // Update select options with data-i18n attribute
    document.querySelectorAll('option[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.textContent = t(key);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Heat Pump Analyzer V9.0.0 (i18n) Initializing...');
    initI18n();
    updateHTMLStaticText();
    currentHandleCalculate = handleCalculate;
    initializeUI(handleCalculate);
    setupLanguageSwitch();
    setTimeout(() => handleCalculate(), 500);
});