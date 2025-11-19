// src/js/core/core-calculator.js

import { calculateNPV, calculateCashFlowNPV, findIRR, calculateDynamicPBP } from './utils.js';

/**
 * 主计算函数 (原 runAnalysis)
 * @param {object} inputs - 从 ui-setup.js 读取的完整输入对象
 * @returns {object} 包含所有计算结果的 results 对象
 */
export function calculate(inputs) {
    const { analysisMode } = inputs;
    
    // 1. (所有模式通用) 计算基础数据
    const lccParams = { 
        lccYears: inputs.lccYears, 
        discountRate: inputs.discountRate, 
        energyInflationRate: inputs.energyInflationRate, 
        opexInflationRate: inputs.opexInflationRate 
    };
    
    const { annualHeatingDemandKWh } = inputs; 

    // 2. 根据模式路由到不同的分析函数
    if (analysisMode === 'bot') {
        return runBotFinancialAnalysis(
            inputs, 
            lccParams, 
            inputs.botAnnualEnergyCost, 
            inputs.botAnnualOpexCost
        );
    } else {
        const totalHpElec_FullLoad = (inputs.hpCop > 0) ? (annualHeatingDemandKWh / inputs.hpCop) : 0;
        let hpEnergyCost_FullLoad = 0;
        const hpEnergyCostDetails_FullLoad = { tiers: [] };
        
        inputs.priceTiers.forEach(tier => {
            const dist_f = tier.dist / 100;
            const elec_n = totalHpElec_FullLoad * dist_f;
            const cost_n = elec_n * tier.price;
            hpEnergyCost_FullLoad += cost_n;
            hpEnergyCostDetails_FullLoad.tiers.push({ name: tier.name, elec: elec_n, price: tier.price, cost: cost_n });
        });
        
        let weightedAvgElecPrice = 0;
        if (totalHpElec_FullLoad > 0) {
            weightedAvgElecPrice = hpEnergyCost_FullLoad / totalHpElec_FullLoad;
        } else if (inputs.priceTiers.length > 0) {
            let totalWeight = 0;
            inputs.priceTiers.forEach(t => { weightedAvgElecPrice += t.price * t.dist; totalWeight += t.dist; });
            if (totalWeight > 0) weightedAvgElecPrice = weightedAvgElecPrice / totalWeight;
            else if (inputs.priceTiers.length === 1) weightedAvgElecPrice = inputs.priceTiers[0].price;
        }
        
        return runCostComparisonAnalysis(inputs, lccParams, weightedAvgElecPrice, hpEnergyCost_FullLoad, hpEnergyCostDetails_FullLoad, annualHeatingDemandKWh, analysisMode, totalHpElec_FullLoad);
    }
}


function runBotFinancialAnalysis(inputs, lccParams, botEnergyCost_Year1, botOpexCost_Year1) {
    const { lccYears, discountRate, energyInflationRate, opexInflationRate } = lccParams;
    
    const totalInvestment = inputs.hpHostCapex + inputs.hpStorageCapex;
    const equity = totalInvestment * inputs.botEquityRatio;
    const loan = totalInvestment - equity;
    const salvageValue = totalInvestment * inputs.hpSalvageRate;

    const cashFlows = {
        years: [], revenue: [], vat: [], revenueNetVat: [], surtax: [],
        energyCost: [], opexCost: [], depreciation: [], interest: [],
        totalCost: [], profitBeforeTax: [], incomeTax: [], netProfit: [],
        cf_TotalInvestment: [], cf_Equity: [],
    };
    
    const annualPrincipalRepayment = (inputs.botDepreciationYears > 0) ? (loan / inputs.botDepreciationYears) : 0;
    
    for (let n = 1; n <= lccYears; n++) {
        cashFlows.years.push(n);
        
        const revenue = inputs.botAnnualRevenue;
        const revenueNetVat = revenue / (1 + inputs.botVatRate);
        const vat = revenue - revenueNetVat;
        const surtax = vat * inputs.botSurtaxRate;
        const energyCost = botEnergyCost_Year1 * Math.pow(1 + energyInflationRate, n - 1);
        const opexCost = botOpexCost_Year1 * Math.pow(1 + opexInflationRate, n - 1);
        const depreciation = (n <= inputs.botDepreciationYears) ? ((totalInvestment * (1 - inputs.hpSalvageRate)) / inputs.botDepreciationYears) : 0;
        
        let interest = 0;
        if (n <= inputs.botDepreciationYears) {
            const outstandingLoan = loan - (annualPrincipalRepayment * (n - 1));
            interest = outstandingLoan * inputs.botLoanInterestRate;
        }
        
        const totalCost = energyCost + opexCost + depreciation + interest + surtax;
        const profitBeforeTax = revenueNetVat - totalCost;
        const incomeTax = Math.max(0, profitBeforeTax) * inputs.botIncomeTaxRate;
        const netProfit = profitBeforeTax - incomeTax;
        
        cashFlows.revenue.push(revenue); cashFlows.vat.push(vat); cashFlows.revenueNetVat.push(revenueNetVat);
        cashFlows.surtax.push(surtax); cashFlows.energyCost.push(energyCost); cashFlows.opexCost.push(opexCost);
        cashFlows.depreciation.push(depreciation); cashFlows.interest.push(interest); cashFlows.totalCost.push(totalCost);
        cashFlows.profitBeforeTax.push(profitBeforeTax); cashFlows.incomeTax.push(incomeTax); cashFlows.netProfit.push(netProfit);
        
        const EBIT = profitBeforeTax + interest;
        const NOPAT = EBIT * (1 - inputs.botIncomeTaxRate);
        let cf_total_n = NOPAT + depreciation;
        
        let principalRepayment_n = (n <= inputs.botDepreciationYears) ? annualPrincipalRepayment : 0;
        let cf_equity_n = netProfit + depreciation - principalRepayment_n;

        if (n === lccYears) {
            cf_total_n += salvageValue;
            cf_equity_n += salvageValue;
        }
        
        cashFlows.cf_TotalInvestment.push(cf_total_n);
        cashFlows.cf_Equity.push(cf_equity_n);
    }
    
    const cf_Total_Stream = [-totalInvestment, ...cashFlows.cf_TotalInvestment];
    const cf_Equity_Stream = [-equity, ...cashFlows.cf_Equity];

    const summary = {
        investment: totalInvestment / 10000, equity: equity / 10000, loan: loan / 10000,
        irr: findIRR(cf_Total_Stream), npv: calculateCashFlowNPV(cf_Total_Stream, discountRate) / 10000,
        pbp: calculateDynamicPBP(cf_Total_Stream, discountRate, lccYears),
        equityIRR: findIRR(cf_Equity_Stream), equityNPV: calculateCashFlowNPV(cf_Equity_Stream, discountRate) / 10000,
        equityPBP: calculateDynamicPBP(cf_Equity_Stream, discountRate, lccYears),
    };

    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const avg = (arr) => (arr.length > 0) ? (sum(arr) / arr.length / 10000) : 0;
    
    const annualAvg = {
        revenue: avg(cashFlows.revenue), vat: avg(cashFlows.vat), revenueNetVat: avg(cashFlows.revenueNetVat),
        surtax: avg(cashFlows.surtax), energyCost: avg(cashFlows.energyCost), opexCost: avg(cashFlows.opexCost),
        depreciation: avg(cashFlows.depreciation), interest: avg(cashFlows.interest), totalCost: avg(cashFlows.totalCost),
        profitBeforeTax: avg(cashFlows.profitBeforeTax), incomeTax: avg(cashFlows.incomeTax), netProfit: avg(cashFlows.netProfit),
    };

    return {
        analysisMode: 'bot', inputs: inputs, lccParams: lccParams,
        botAnalysis: { summary: summary, annualAvg: annualAvg, cashFlows: cashFlows }
    };
}

function runCostComparisonAnalysis(inputs, lccParams, weightedAvgElecPrice, hpEnergyCost_FullLoad, hpEnergyCostDetails_FullLoad, annualHeatingDemandKWh, analysisMode, totalHpElec_FullLoad) {
    
    const results = {};
    const { 
        lccYears, discountRate, energyInflationRate, opexInflationRate, priceTiers, 
        isHybridMode, gridFactor 
    } = inputs;
    
    results.inputs = inputs; results.lccParams = lccParams; results.isHybridMode = isHybridMode;
    results.annualHeatingDemandKWh = annualHeatingDemandKWh; results.weightedAvgElecPrice = weightedAvgElecPrice;

    const STEAM_KWH_PER_TON = 700;
    
    let hpSystemDetails; 
    const hpTotalCapex = inputs.hpHostCapex + inputs.hpStorageCapex;

    if (isHybridMode) {
        const { hybridLoadShare, hybridAuxHeaterType, hybridAuxHeaterCapex, hybridAuxHeaterOpex } = inputs;
        results.hybridInputs = { hybridLoadShare, hybridAuxHeaterType, hybridAuxHeaterCapex, hybridAuxHeaterOpex };
        
        const hpHeatingDemandKWh = annualHeatingDemandKWh * hybridLoadShare;
        const auxHeatingDemandKWh = annualHeatingDemandKWh * (1.0 - hybridLoadShare);

        const totalHpElec_Hybrid = (inputs.hpCop > 0) ? (hpHeatingDemandKWh / inputs.hpCop) : 0;
        let hpEnergyCost_Hybrid = 0;
        const hpEnergyCostDetails_Hybrid = { tiers: [] };
        priceTiers.forEach(tier => {
            const dist_f = tier.dist / 100;
            const elec_n = totalHpElec_Hybrid * dist_f;
            const cost_n = elec_n * tier.price;
            hpEnergyCost_Hybrid += cost_n;
            hpEnergyCostDetails_Hybrid.tiers.push({ name: tier.name, elec: elec_n, price: tier.price, cost: cost_n });
        });
        const hpOpex_Year1_Hybrid = hpEnergyCost_Hybrid + inputs.hpOpexCost;
        const hpCo2_Hybrid = totalHpElec_Hybrid * gridFactor;
        
        const hpEnergyNPV_Hybrid = calculateNPV(hpEnergyCost_Hybrid, lccYears, discountRate, energyInflationRate);
        const hpOpexNPV_Hybrid = calculateNPV(inputs.hpOpexCost, lccYears, discountRate, opexInflationRate);
        
        const hpSalvageValue_Undiscounted = hpTotalCapex * inputs.hpSalvageRate;
        const hpSalvageNPV_Hybrid = hpSalvageValue_Undiscounted / Math.pow(1 + discountRate, lccYears);
        const hpLCC_Hybrid = hpTotalCapex + hpEnergyNPV_Hybrid + hpOpexNPV_Hybrid - hpSalvageNPV_Hybrid;

        const hpDetails = {
            isHybridPart: true, name: "工业热泵 (混合)", energyCost: hpEnergyCost_Hybrid, energyCostDetails: hpEnergyCostDetails_Hybrid,
            opexCost: inputs.hpOpexCost, opex: hpOpex_Year1_Hybrid, co2: hpCo2_Hybrid,
            lcc: {
                capex: hpTotalCapex, capex_host: inputs.hpHostCapex, capex_storage: inputs.hpStorageCapex,
                energyNPV: hpEnergyNPV_Hybrid, opexNPV: hpOpexNPV_Hybrid,
                salvageRate: inputs.hpSalvageRate, salvageNPV: hpSalvageNPV_Hybrid,
                salvageValue: hpSalvageValue_Undiscounted, total: hpLCC_Hybrid
            }
        };
        results.hp = hpDetails;
        
        const auxDetails = calculateBoilerDetails(hybridAuxHeaterType, auxHeatingDemandKWh, hybridAuxHeaterCapex, hybridAuxHeaterOpex, lccParams, inputs, gridFactor, weightedAvgElecPrice);
        results.hybrid_aux = auxDetails; 

        const total_steam_equivalent_hybrid = (annualHeatingDemandKWh > 0) ? (annualHeatingDemandKWh / STEAM_KWH_PER_TON) : 0;
        
        const hybridSystem = {
            isHybrid: true, name: "混合系统 (工业热泵 + " + auxDetails.name + ")",
            energyCost: hpDetails.energyCost + auxDetails.energyCost, opexCost: hpDetails.opexCost + auxDetails.opexCost,
            opex: hpDetails.opex + auxDetails.opex, co2: hpDetails.co2 + auxDetails.co2,
            cost_per_kwh_heat: annualHeatingDemandKWh > 0 ? ((hpDetails.energyCost + auxDetails.energyCost) / annualHeatingDemandKWh) : 0,
            electricity_per_steam_ton: (total_steam_equivalent_hybrid > 0) ? totalHpElec_Hybrid / total_steam_equivalent_hybrid : 0,
            cost_per_steam_ton: (total_steam_equivalent_hybrid > 0) ? (hpDetails.energyCost + auxDetails.energyCost) / total_steam_equivalent_hybrid : 0,
            lcc: {
                capex: hpDetails.lcc.capex + auxDetails.lcc.capex, energyNPV: hpDetails.lcc.energyNPV + auxDetails.lcc.energyNPV,
                opexNPV: hpDetails.lcc.opexNPV + auxDetails.lcc.opexNPV, salvageNPV: hpDetails.lcc.salvageNPV + auxDetails.lcc.salvageNPV,
                salvageValue: hpDetails.lcc.salvageValue + auxDetails.lcc.salvageValue, total: hpDetails.lcc.total + auxDetails.lcc.total
            }
        };
        results.hybridSystem = hybridSystem;
        hpSystemDetails = hybridSystem;

    } else {
        const hpOpex_Year1 = hpEnergyCost_FullLoad + inputs.hpOpexCost;
        const hpCo2 = totalHpElec_FullLoad * gridFactor; 
        
        const hpEnergyNPV = calculateNPV(hpEnergyCost_FullLoad, lccYears, discountRate, energyInflationRate);
        const hpOpexNPV = calculateNPV(inputs.hpOpexCost, lccYears, discountRate, opexInflationRate);
        
        const hpSalvageValue_Undiscounted = hpTotalCapex * inputs.hpSalvageRate;
        const hpSalvageNPV = hpSalvageValue_Undiscounted / Math.pow(1 + discountRate, lccYears);
        const hpLCC = hpTotalCapex + hpEnergyNPV + hpOpexNPV - hpSalvageNPV;

        const total_steam_equivalent = (annualHeatingDemandKWh > 0) ? (annualHeatingDemandKWh / STEAM_KWH_PER_TON) : 0;
        
        const hpDetails = {
            isHybrid: false,
            name: "工业热泵系统",
            consumption: totalHpElec_FullLoad,
            consumptionUnit: 'kWh',
            energyCost: hpEnergyCost_FullLoad, energyCostDetails: hpEnergyCostDetails_FullLoad,
            opexCost: inputs.hpOpexCost, opex: hpOpex_Year1, co2: hpCo2,
            cost_per_kwh_heat: (inputs.hpCop > 0) ? (weightedAvgElecPrice / inputs.hpCop) : 0, 
            electricity_per_steam_ton: (total_steam_equivalent > 0) ? totalHpElec_FullLoad / total_steam_equivalent : 0,
            cost_per_steam_ton: (total_steam_equivalent > 0) ? hpEnergyCost_FullLoad / total_steam_equivalent : 0,
            lcc: {
                capex: hpTotalCapex, capex_host: inputs.hpHostCapex, capex_storage: inputs.hpStorageCapex,
                energyNPV: hpEnergyNPV, opexNPV: hpOpexNPV,
                salvageRate: inputs.hpSalvageRate, salvageNPV: hpSalvageNPV,
                salvageValue: hpSalvageValue_Undiscounted, total: hpLCC
            }
        };
        results.hp = hpDetails;
        hpSystemDetails = hpDetails;
    }

    const comparisons = [];
    
    if (inputs.compare.gas) comparisons.push(calculateBoilerDetails('gas', annualHeatingDemandKWh, inputs.gasBoilerCapex, inputs.gasOpexCost, lccParams, inputs, gridFactor, weightedAvgElecPrice));
    if (inputs.compare.fuel) comparisons.push(calculateBoilerDetails('fuel', annualHeatingDemandKWh, inputs.fuelBoilerCapex, inputs.fuelOpexCost, lccParams, inputs, gridFactor, weightedAvgElecPrice));
    if (inputs.compare.coal) comparisons.push(calculateBoilerDetails('coal', annualHeatingDemandKWh, inputs.coalBoilerCapex, inputs.coalOpexCost, lccParams, inputs, gridFactor, weightedAvgElecPrice));
    if (inputs.compare.biomass) comparisons.push(calculateBoilerDetails('biomass', annualHeatingDemandKWh, inputs.biomassBoilerCapex, inputs.biomassOpexCost, lccParams, inputs, gridFactor, weightedAvgElecPrice));
    if (inputs.compare.electric) comparisons.push(calculateBoilerDetails('electric', annualHeatingDemandKWh, inputs.electricBoilerCapex, inputs.electricOpexCost, lccParams, inputs, gridFactor, weightedAvgElecPrice));
    if (inputs.compare.steam) comparisons.push(calculateBoilerDetails('steam', annualHeatingDemandKWh, inputs.steamCapex, inputs.steamOpexCost, lccParams, inputs, gridFactor, weightedAvgElecPrice));
    
    comparisons.forEach(boiler => { results[boiler.key] = boiler; });

    results.comparisons = comparisons.map(boiler => {
        const energyCostSaving = boiler.energyCost - hpSystemDetails.energyCost;
        let energyCostSavingRate = (boiler.energyCost > 0) ? (energyCostSaving / boiler.energyCost) : (hpSystemDetails.energyCost <= 0 ? 0 : -Infinity);
        
        let electricalPriceRatio = (hpSystemDetails.cost_per_kwh_heat > 0 && boiler.cost_per_kwh_heat > 0)
            ? boiler.cost_per_kwh_heat / hpSystemDetails.cost_per_kwh_heat
            : null;
        
        const investmentDiff = hpSystemDetails.lcc.capex - boiler.lcc.capex;
        const opexSaving = boiler.opex - hpSystemDetails.opex;
        
        let paybackPeriod = "无法收回投资";
        if (opexSaving > 0 && investmentDiff > 0) paybackPeriod = (investmentDiff / opexSaving).toFixed(2) + " 年";
        else if (investmentDiff <=0 && opexSaving > 0) paybackPeriod = "无需额外投资";
        else if (investmentDiff <=0 && opexSaving <= 0) paybackPeriod = "无额外投资/无节省";
        
        let simpleROI = (investmentDiff > 0 && opexSaving > 0) ? (opexSaving / investmentDiff) : null;
        
        const co2Reduction = (boiler.co2 - hpSystemDetails.co2);
        const treesPlanted = co2Reduction > 0 ? (co2Reduction / 18.3) : 0;
        const lccSaving = boiler.lcc.total - hpSystemDetails.lcc.total;
        const npv = lccSaving; 

        const cash_flows = [-investmentDiff];
        for (let n = 1; n <= lccYears; n++) {
            const hpEnergyCost_n = hpSystemDetails.energyCost * Math.pow(1 + energyInflationRate, n - 1);
            const boilerEnergyCost_n = boiler.energyCost * Math.pow(1 + energyInflationRate, n - 1);
            const hpOpexCost_n = hpSystemDetails.opexCost * Math.pow(1 + opexInflationRate, n - 1);
            const boilerOpexCost_n = boiler.opexCost * Math.pow(1 + opexInflationRate, n - 1);
            const annualSaving_n = (boilerEnergyCost_n + boilerOpexCost_n) - (hpEnergyCost_n + hpOpexCost_n);
            cash_flows.push(annualSaving_n);
        }
        
        const deltaSalvage = hpSystemDetails.lcc.salvageValue - boiler.lcc.salvageValue;
        cash_flows[lccYears] += deltaSalvage;
        
        const irr = findIRR(cash_flows);
        const dynamicPBP = calculateDynamicPBP(cash_flows, discountRate, lccYears);

        return {
            key: boiler.key, name: boiler.name, opex: boiler.opex, opexSaving,
            investmentDiff, paybackPeriod, co2Reduction, treesPlanted, lcc: boiler.lcc.total,
            lccSaving, npv, irr, dynamicPBP, simpleROI, electricalPriceRatio,
            energyCostSaving, energyCostSavingRate, consumption: boiler.consumption,
            consumptionUnit: boiler.consumptionUnit
        };
    });

    results.analysisMode = analysisMode;
    return results;
}

function calculateBoilerDetails(boilerKey, heatingDemandKWh, capex, opexCost, lccParams, inputs, gridFactor, weightedAvgElecPrice) {
    const { lccYears, discountRate, energyInflationRate, opexInflationRate } = lccParams;
    const annualHeatingDemandMJ = heatingDemandKWh * 3.6;
    
    let energyCost = 0, co2 = 0, consumption = 0, salvageRate = 0;
    let name = "未知", cost_per_kwh_heat = 0, consumptionUnit = '';

    switch (boilerKey) {
        case 'gas':
            name = "天然气锅炉"; salvageRate = inputs.gasSalvageRate; consumptionUnit = 'm³';
            if (inputs.gasBoilerEfficiency > 0 && inputs.gasCalorific > 0) {
                consumption = (annualHeatingDemandMJ / inputs.gasBoilerEfficiency) / inputs.gasCalorific;
                energyCost = consumption * inputs.gasPrice; co2 = consumption * inputs.gasFactor;
                cost_per_kwh_heat = inputs.gasPrice / ((inputs.gasCalorific / 3.6) * inputs.gasBoilerEfficiency);
            }
            break;
        case 'fuel':
            name = "燃油锅炉"; salvageRate = inputs.fuelSalvageRate; consumptionUnit = '吨';
            if (inputs.fuelBoilerEfficiency > 0 && inputs.fuelCalorific > 0) {
                consumption = ((annualHeatingDemandMJ / inputs.fuelBoilerEfficiency) / inputs.fuelCalorific) / 1000;
                energyCost = consumption * inputs.fuelPrice; co2 = consumption * inputs.fuelFactor;
                cost_per_kwh_heat = (inputs.fuelPrice / 1000) / ((inputs.fuelCalorific / 3.6) * inputs.fuelBoilerEfficiency);
            }
            break;
        case 'coal':
            name = "燃煤锅炉"; salvageRate = inputs.coalSalvageRate; consumptionUnit = '吨';
            if (inputs.coalBoilerEfficiency > 0 && inputs.coalCalorific > 0) {
                consumption = ((annualHeatingDemandMJ / inputs.coalBoilerEfficiency) / inputs.coalCalorific) / 1000;
                energyCost = consumption * inputs.coalPrice; co2 = consumption * inputs.coalFactor;
                cost_per_kwh_heat = (inputs.coalPrice / 1000) / ((inputs.coalCalorific / 3.6) * inputs.coalBoilerEfficiency);
            }
            break;
        case 'biomass':
            name = "生物质锅炉"; salvageRate = inputs.biomassSalvageRate; consumptionUnit = '吨';
            if (inputs.biomassBoilerEfficiency > 0 && inputs.biomassCalorific > 0) {
                consumption = ((annualHeatingDemandMJ / inputs.biomassBoilerEfficiency) / inputs.biomassCalorific) / 1000;
                energyCost = consumption * inputs.biomassPrice; co2 = consumption * inputs.biomassFactor;
                cost_per_kwh_heat = (inputs.biomassPrice / 1000) / ((inputs.biomassCalorific / 3.6) * inputs.biomassBoilerEfficiency);
            }
            break;
        case 'electric':
            name = "电锅炉"; salvageRate = inputs.electricSalvageRate; consumptionUnit = 'kWh';
            if (inputs.electricBoilerEfficiency > 0) {
                consumption = heatingDemandKWh / inputs.electricBoilerEfficiency;
                energyCost = consumption * weightedAvgElecPrice; co2 = consumption * gridFactor;
                cost_per_kwh_heat = weightedAvgElecPrice / inputs.electricBoilerEfficiency;
            }
            break;
        case 'steam':
            name = "管网蒸汽"; salvageRate = inputs.steamSalvageRate; consumptionUnit = '吨';
            if (inputs.steamEfficiency > 0 && inputs.steamCalorific > 0) {
                const steamRequiredKwh = heatingDemandKWh / inputs.steamEfficiency;
                consumption = steamRequiredKwh / inputs.steamCalorific;
                energyCost = consumption * inputs.steamPrice; co2 = steamRequiredKwh * inputs.steamFactor;
                cost_per_kwh_heat = inputs.steamPrice / (inputs.steamCalorific * inputs.steamEfficiency);
            }
            break;
    }

    const opex_Year1 = energyCost + opexCost;
    const energyNPV = calculateNPV(energyCost, lccYears, discountRate, energyInflationRate);
    const opexNPV = calculateNPV(opexCost, lccYears, discountRate, opexInflationRate);
    const salvageValue = capex * salvageRate;
    const salvageNPV = salvageValue / Math.pow(1 + discountRate, lccYears);
    const lcc = capex + energyNPV + opexNPV - salvageNPV;

    return {
        key: boilerKey, name: name, energyCost: energyCost, opexCost: opexCost,
        opex: opex_Year1, co2: co2, consumption: consumption, consumptionUnit: consumptionUnit,
        cost_per_kwh_heat: cost_per_kwh_heat,
        lcc: {
            capex: capex, energyNPV: energyNPV, opexNPV: opexNPV,
            salvageRate: salvageRate, salvageNPV: salvageNPV,
            salvageValue: salvageValue, total: lcc
        }
    };
}