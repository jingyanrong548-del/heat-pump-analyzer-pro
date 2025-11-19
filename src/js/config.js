// src/js/config.js

/**
 * 燃料油（柴油、重油、渣油）的默认数据
 * 包含价格、热值、排放因子及对应的工具提示
 */
export const fuelData = {
    diesel: {
        price: 8900,
        calorific: 42.6,
        factor: 3090,
        priceTooltip: '<b>默认值: 8900 元/吨</b><br>参考国内0号柴油市场价格及密度（约0.84kg/L）折算。',
        calorificTooltip: '<b>默认值: 42.6 MJ/kg</b><br>国标中0号柴油的典型低位发热量参考值。',
        factorTooltip: '<b>默认值: 3090 kgCO₂/吨</b><br>参考《省级温室气体清单编制指南》中柴油的排放因子。'
    },
    heavy_oil: {
        price: 6500,
        calorific: 41.8,
        factor: 3170,
        priceTooltip: '<b>默认值: 6500 元/吨</b><br>参考国内燃料油（重油）市场平均价格。',
        calorificTooltip: '<b>默认值: 41.8 MJ/kg</b><br>国标中燃料油（5-7号）的典型低位发热量参考值。',
        factorTooltip: '<b>默认值: 3170 kgCO₂/吨</b><br>参考《省级温室气体清单编制指南》中燃料油的排放因子。'
    },
    residual_oil: {
        price: 5500,
        calorific: 40.2,
        factor: 3250,
        priceTooltip: '<b>默认值: 5500 元/吨</b><br>参考国内渣油市场平均价格。',
        calorificTooltip: '<b>默认值: 40.2 MJ/kg</b><br>国标中渣油的典型低位发热量参考值。',
        factorTooltip: '<b>默认值: 3250 kgCO₂/吨</b><br>参考《省级温室气体清单编制指南》中渣油的排放因子。'
    }
};

/**
 * 1 大卡 (kcal) 对应的兆焦耳 (MJ)
 * 1 kcal = 4184 J = 0.004184 MJ
 */
export const MJ_PER_KCAL = 0.004184;

/**
 * 1 kWh (千瓦时) 对应的大卡 (kcal)
 * 1 kWh = 860.42 kcal
 */
export const KCAL_PER_KWH = 860.42;


/**
 * 单位换算器配置
 * 定义了所有输入框 (input) 和下拉框 (select) 之间的换算关系
 * 'dynamicConversions' 用于依赖其他输入值（如热值）的动态换算
 */
export const converters = [
    {
        selectId: 'heatingLoadUnit', inputId: 'heatingLoad',
        conversions: { 'kW': 1, 'kcal/h': KCAL_PER_KWH }
    },
    {
        selectId: 'annualHeatingUnit', inputId: 'annualHeating',
        conversions: { 
            'kWh': 1, 
            'KJ': 3600,
            'MJ': 3.6,
            'GJ': 0.0036,
            'TJ': 0.0000036,
            '万大卡': KCAL_PER_KWH / 10000,
            'Mkcal': KCAL_PER_KWH / 1000000
        }
    },
    {
        selectId: 'gridFactorUnit', inputId: 'gridFactor',
        conversions: { 'kgCO2/kWh': 1, 'tCO2/MWh': 1 }
    },
    {
        selectId: 'steamFactorUnit', inputId: 'steamFactor',
        conversions: { 'kgCO2/kWh': 1, 'tCO2/MWh': 1, 'kgCO2/GJ': 1 / (3.6 / 1000) }
    },
    {
        selectId: 'gasFactorUnit', inputId: 'gasFactor',
        dynamicConversions: () => {
            const gasCalorific = parseFloat(document.getElementById('gasCalorific').dataset.baseValue) || 35.57;
            return { 'kgCO2/m3': 1, 'kgCO2/GJ': 1 / (gasCalorific / 1000) };
        }
    },
     {
        selectId: 'fuelFactorUnit', inputId: 'fuelFactor',
        dynamicConversions: () => {
            const fuelCalorific = parseFloat(document.getElementById('fuelCalorific').dataset.baseValue) || 42.6;
            return { 'kgCO2/t': 1, 'kgCO2/kg': 1 / 1000, 'kgCO2/GJ': 1000 / fuelCalorific };
        }
    },
    {
        selectId: 'coalFactorUnit', inputId: 'coalFactor',
        dynamicConversions: () => {
            const coalCalorific = parseFloat(document.getElementById('coalCalorific').dataset.baseValue) || 29.3;
            return { 'kgCO2/t': 1, 'kgCO2/kg': 1 / 1000, 'kgCO2/GJ': 1000 / coalCalorific };
        }
    },
    {
        selectId: 'biomassFactorUnit', inputId: 'biomassFactor',
        dynamicConversions: () => {
            const biomassCalorific = parseFloat(document.getElementById('biomassCalorific').dataset.baseValue) || 16.32;
            return { 'kgCO2/t': 1, 'kgCO2/kg': 1 / 1000, 'kgCO2/GJ': 1000 / biomassCalorific };
        }
    },
    {
        selectId: 'gasCalorificUnit', inputId: 'gasCalorific',
        conversions: { 
            'MJ/m3': 1, 
            'kWh/m3': 1 / 3.6, 
            'GJ/m3': 1 / 1000,
            'kcal/m3': 1 / MJ_PER_KCAL 
        }
    },
     {
        selectId: 'fuelCalorificUnit', inputId: 'fuelCalorific',
        conversions: { 
            'MJ/kg': 1, 
            'GJ/t': 1, 
            'kWh/kg': 1 / 3.6,
            'kcal/kg': 1 / MJ_PER_KCAL
        }
    },
    {
        selectId: 'coalCalorificUnit', inputId: 'coalCalorific',
        conversions: { 
            'MJ/kg': 1, 
            'GJ/t': 1, 
            'kWh/kg': 1 / 3.6,
            'kcal/kg': 1 / MJ_PER_KCAL
        }
    },
    {
        selectId: 'biomassCalorificUnit', inputId: 'biomassCalorific',
        conversions: { 
            'MJ/kg': 1, 
            'kcal/kg': 1 / MJ_PER_KCAL, 
            'GJ/t': 1, 
            'kWh/kg': 1 / 3.6 
        }
    },
    {
        selectId: 'steamCalorificUnit', inputId: 'steamCalorific',
        conversions: { 'kWh/t': 1, 'GJ/t': 3.6 / 1 }
    }
];

// **** UPDATED MODULE: 更完整的“一键重置”功能数据源 ****
/**
 * 定义并导出一组默认参数，用于“一键重置”功能。
 * 键名 (key) 必须与HTML中对应元素的 id 完全匹配。
 * 对于 radio 和 checkbox，值为 true 表示默认选中。
 */
export const defaultParameters = {
  // --- 步骤 1: 项目基础 ---
  'projectName': '示例项目',
  'calcModeAnnualHours': true, // For radio button
  'heatingLoad': '1000',
  'operatingHours': '2000',
  'annualHeating': '2000000',
  'dailyHours': '8',
  'annualDays': '300',
  'loadFactor': '70',
  
  // --- 步骤 2: 方案配置 ---
  'modeStandard': true, // For radio button
  'hpCapex': '200',
  'storageCapex': '0',
  'hpSalvageRate': '5',
  'hybridLoadShare': '50',
  'hybridAuxHeaterType': 'electric',
  'hybridAuxHeaterCapex': '30',
  'hybridAuxHeaterOpex': '0.5',
  'botAnnualRevenue': '150',
  'botAnnualEnergyCost': '60',
  'botAnnualOpexCost': '5',
  'botEquityRatio': '30',
  'botLoanInterestRate': '5',
  'botDepreciationYears': '10',
  'botVatRate': '13',
  'botSurtaxRate': '12',
  'botIncomeTaxRate': '25',
  'compare_gas': true, 'gasBoilerCapex': '80', 'gasSalvageRate': '5',
  'compare_fuel': true, 'fuelBoilerCapex': '70', 'fuelSalvageRate': '5',
  'compare_coal': true, 'coalBoilerCapex': '60', 'coalSalvageRate': '5',
  'compare_biomass': true, 'biomassBoilerCapex': '75', 'biomassSalvageRate': '5',
  'compare_electric': true, 'electricBoilerCapex': '50', 'electricSalvageRate': '5',
  'compare_steam': true, 'steamCapex': '0', 'steamSalvageRate': '0',
  
  // --- 步骤 3: 运行参数 ---
  'hpCop': '3.0',
  'gasBoilerEfficiency': '92',
  'fuelBoilerEfficiency': '90',
  'coalBoilerEfficiency': '80',
  'biomassBoilerEfficiency': '85',
  'electricBoilerEfficiency': '98',
  'steamEfficiency': '98',
  'gasCalorific': '35.57',
  'fuelCalorific': '42.6',
  'coalCalorific': '29.3',
  'biomassCalorific': '16.32',
  'steamCalorific': '700',
  'gridFactor': '0.57',
  'gasPrice': '4.2',
  'fuelPrice': '8900',
  'coalPrice': '1000',
  'biomassPrice': '850',
  'steamPrice': '300',
  'gasFactor': '1.97',
  'fuelFactor': '3090',
  'coalFactor': '2420',
  'biomassFactor': '0',
  'steamFactor': '0.35',
  'hpOpexCost': '2.5',
  'gasOpexCost': '1.8',
  'fuelOpexCost': '1.9',
  'coalOpexCost': '6.8',
  'biomassOpexCost': '6.3',
  'electricOpexCost': '0.4',
  'steamOpexCost': '0',

  // --- 步骤 4: 财务模型 ---
  'lccYears': '15',
  'discountRate': '8',
  'energyInflationRate': '3',
  'opexInflationRate': '5'
};
// [新增] 自动生成所有需要管理的输入框ID列表
export const ALL_INPUT_IDS = Object.keys(defaultParameters);