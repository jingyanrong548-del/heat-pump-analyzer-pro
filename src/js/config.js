// src/js/config.js
// V18.5: Corrected Defaults & Unit Conversion Constants

/**
 * 能量单位换算系数 (统一转为 MJ)
 */
export const ENERGY_CONVERTERS = {
    'MJ': 1,
    'kJ': 0.001,
    'kcal': 0.004186,  // 1 kcal ≈ 4.186 kJ
    'kWh': 3.6         // 1 kWh = 3.6 MJ
};

/**
 * 排放因子单位换算系数 (统一转为 kgCO2)
 * 通常输入就是 kgCO2/单位，这里保留扩展能力
 */
export const EMISSION_CONVERTERS = {
    'kg': 1,
    't': 1000 // 如果用户输入 吨CO2/单位
};

export const converters = [
    {
        selectId: 'heatingLoadUnit', inputId: 'heatingLoad',
        conversions: { 'kW': 1, 'kcal/h': 1/1.163 }
    },
    {
        selectId: 'annualHeatingUnit', inputId: 'annualHeating',
        conversions: { 'kWh': 1, 'GJ': 277.78, '万大卡': 11.63 }
    }
];

/**
 * 修正后的能源基准参数
 * 价格单位：电力(元/kWh), 气体(元/m³), 固体/液体/蒸汽(元/吨)
 * 热值单位：默认 MJ
 */
export const ENERGY_DEFAULTS = {
    hp: { cop: 3.0, opex: 2.5 },
    electric: { 
        price: 0.7, 
        calorific: 3.6, // 1 kWh = 3.6 MJ
        factor: 0.57,   // 电网平均 kgCO2/kWh
        boilerEff: 98, opex: 0.4, capex: 50 
    },
    gas: { 
        price: 4.2, 
        calorific: 36,  // ~8600 kcal/m³
        factor: 1.97,   // kgCO2/m³
        boilerEff: 92, opex: 1.8, capex: 80 
    },
    coal: { 
        price: 1000, 
        calorific: 21,  // 动力煤 ~5000 kcal/kg (注意：原29为标煤，工业动力煤通常较低)
        factor: 2.42,   // kgCO2/kg
        boilerEff: 80, opex: 6.8, capex: 60 
    },
    fuel: { 
        price: 8000, 
        calorific: 42,  // ~10000 kcal/kg
        factor: 3.1,    // kgCO2/kg
        boilerEff: 90, opex: 1.9, capex: 70 
    },
    biomass: { 
        price: 850, 
        calorific: 15,  // ~3600 kcal/kg
        factor: 0, 
        boilerEff: 85, opex: 6.3, capex: 75 
    },
    steam: { 
        price: 280, 
        calorific: 2.8, // ~670 kcal/kg (焓值)
        factor: 0.35,   // 折算排放
        boilerEff: 95, opex: 0, capex: 0 
    }
};

export const EFF_CALC_DEFAULTS = {
    water: { mass: 100, tempIn: 15, tempOut: 60 },
    steam: { mass: 10, pressure: 0.8, feedTemp: 20 }
};

export const defaultParameters = {
  'projectName': '示例项目',
  'heatingLoad': '1000', 'operatingHours': '2000', 'annualHeating': '2000000',
  'hpCapex': '200', 'storageCapex': '0', 'hpSalvageRate': '5',
  
  // 价格
  'simple_avg_price': ENERGY_DEFAULTS.electric.price,
  'gasPrice': ENERGY_DEFAULTS.gas.price,
  'coalPrice': ENERGY_DEFAULTS.coal.price,
  'fuelPrice': ENERGY_DEFAULTS.fuel.price,
  'biomassPrice': ENERGY_DEFAULTS.biomass.price,
  'steamPrice': ENERGY_DEFAULTS.steam.price,

  // 热值
  'gasCalorific': ENERGY_DEFAULTS.gas.calorific,
  'coalCalorific': ENERGY_DEFAULTS.coal.calorific,
  'fuelCalorific': ENERGY_DEFAULTS.fuel.calorific,
  'biomassCalorific': ENERGY_DEFAULTS.biomass.calorific,
  'steamCalorific': ENERGY_DEFAULTS.steam.calorific,

  // 因子
  'gridFactor': ENERGY_DEFAULTS.electric.factor,
  'gasFactor': ENERGY_DEFAULTS.gas.factor,
  'coalFactor': ENERGY_DEFAULTS.coal.factor,
  'fuelFactor': ENERGY_DEFAULTS.fuel.factor,
  'biomassFactor': ENERGY_DEFAULTS.biomass.factor,
  'steamFactor': ENERGY_DEFAULTS.steam.factor,
  
  // 效率 & 运维
  'hpCop': ENERGY_DEFAULTS.hp.cop, 'hpOpexCost': ENERGY_DEFAULTS.hp.opex,
  'gasBoilerEfficiency': ENERGY_DEFAULTS.gas.boilerEff, 'gasOpexCost': ENERGY_DEFAULTS.gas.opex,
  'coalBoilerEfficiency': ENERGY_DEFAULTS.coal.boilerEff, 'coalOpexCost': ENERGY_DEFAULTS.coal.opex,
  'fuelBoilerEfficiency': ENERGY_DEFAULTS.fuel.boilerEff, 'fuelOpexCost': ENERGY_DEFAULTS.fuel.opex,
  'biomassBoilerEfficiency': ENERGY_DEFAULTS.biomass.boilerEff, 'biomassOpexCost': ENERGY_DEFAULTS.biomass.opex,
  'electricBoilerEfficiency': ENERGY_DEFAULTS.electric.boilerEff, 'electricOpexCost': ENERGY_DEFAULTS.electric.opex,
  'steamCapex': 0, 'steamOpexCost': 0,

  // 财务
  'discountRate': '8', 'lccYears': '15', 'energyInflationRate': '3', 'opexInflationRate': '5',
  
  // 资本支出
  'gasBoilerCapex': ENERGY_DEFAULTS.gas.capex,
  'coalBoilerCapex': ENERGY_DEFAULTS.coal.capex,
  'fuelBoilerCapex': ENERGY_DEFAULTS.fuel.capex,
  'biomassBoilerCapex': ENERGY_DEFAULTS.biomass.capex,
  'electricBoilerCapex': ENERGY_DEFAULTS.electric.capex
};

export const ALL_INPUT_IDS = Object.keys(defaultParameters);