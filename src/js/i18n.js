// src/js/i18n.js
// V9.0.0: Internationalization (i18n) System

const STORAGE_KEY = 'heat_pump_lang';
const DEFAULT_LANG = 'zh';

// Translation dictionary
const translations = {
    zh: {
        // Page title and header
        page: {
            title: '工业热泵效益分析器',
            subtitle: 'V9.0.0 | 工业热泵',
            benefitAnalysis: '效益分析',
            dashboard: '实时评估看板'
        },
        
        // Language switcher
        lang: {
            zh: '中文',
            en: 'English',
            switch: '切换语言'
        },
        
        // Buttons
        button: {
            reset: '重置',
            enableComparison: '启用对比',
            calculate: '运行计算',
            saveScenario: '暂存当前方案',
            export: '导出',
            exportReport: '导出报告',
            config: '配置参数',
            confirm: '确认',
            cancel: '取消',
            close: '关闭',
            delete: '删除',
            clear: '清空',
            undo: '撤销',
            add: '添加',
            calc: '开始计算',
            apply: '应用结果'
        },
        
        // Cards
        card: {
            annualSaving: '年节省金额',
            irr: '内部收益率 (IRR)',
            pbp: '动态回收期',
            co2Reduction: '年碳减排'
        },
        
        // Tabs
        tab: {
            charts: '图表分析',
            dataTable: '详细数据',
            conclusion: '智能结论',
            scenarios: '方案对比'
        },
        
        // Accordion sections
        accordion: {
            project: '1. 项目与负荷',
            scheme: '2. 方案与投资',
            operating: '3. 运行参数',
            financial: '4. 财务模型'
        },
        
        // Project inputs
        project: {
            name: '项目名称',
            namePlaceholder: '示例项目',
            loadMode: '负荷计算模式',
            modeA: '模式 A',
            modeB: '模式 B',
            modeC: '模式 C',
            annualMethod: '年时法',
            totalMethod: '总量法',
            intermittentMethod: '间歇法',
            heatingLoad: '制热负荷 (设计值)',
            operatingHours: '年运行小时 (h)',
            annualHeating: '年总加热量',
            operatingHoursReverse: '年运行小时 (反推)',
            dailyHours: '日运行 (h)',
            annualDays: '年天数 (d)',
            loadFactor: '平均负荷率 (%)'
        },
        
        // Scheme inputs
        scheme: {
            systemMode: '系统模式 (System Mode)',
            pureHP: '1. 纯热泵',
            hybrid: '2. 混合动力',
            hpInvestment: '热泵投资 (万)',
            storageInvestment: '储能投资 (万)',
            hybridConfig: '混合动力配置',
            auxHeaterType: '辅助热源类型',
            hpLoadShare: '热泵承担负荷 (%)',
            auxLoadNote: '剩余由辅热承担',
            auxHeaterInvestment: '辅热投资 (万)',
            auxHeaterOpex: '辅热运维 (万)',
            comparisonConfig: '对比基准配置',
            electric: '电锅炉',
            gas: '天然气',
            coal: '燃煤',
            fuel: '燃油',
            biomass: '生物质',
            steam: '蒸汽',
            investment: '投资(万)'
        },
        
        // Operating inputs
        operating: {
            hpSPF: '工业热泵 SPF (能效)',
            keyIndicator: '关键指标',
            priceConfig: '电价配置 (元/kWh)',
            greenPower: '启用绿电 (零碳模式)',
            gasPrice: '气价 (元/m³)',
            coalPrice: '煤价 (元/t)',
            steamPrice: '汽价 (元/t)',
            fuelPrice: '油价 (元/t)',
            biomassPrice: '生物质 (元/t)',
            boilerEfficiency: '锅炉效率 (%)',
            advancedParams: '高级能源参数 (单位换算)',
            emission: '排放',
            calorific: '热值',
            opex: '运维成本 (万/年)',
            hpOpex: '工业热泵',
            electricAux: '电加热 (Electric)',
            gasBoiler: '天然气锅炉 (Gas)',
            coalBoiler: '燃煤锅炉 (Coal)',
            fuelBoiler: '燃油锅炉 (Fuel)',
            biomassBoiler: '生物质锅炉 (Biomass)',
            steamNetwork: '管网蒸汽 (Steam)',
            pipeSteam: '管道蒸汽',
            reverseCalc: '反推'
        },
        
        // Financial inputs
        financial: {
            businessModel: '投资模式 (Business Model)',
            selfInvest: '1. 业主自投',
            bot: '2. 能源托管/BOT',
            analysisYears: '分析年限 (年)',
            discountRate: '折现率 (%)',
            botParams: 'BOT 参数设置',
            annualRevenue: '年服务费收入 (万)',
            equityRatio: '自有资金比例 (%)',
            energyInflation: '能源涨幅(%)',
            opexInflation: '运维涨幅(%)',
            author: '创作：荆炎荣',
            usageCounter: '累计运行：{count} 次',
            disclaimer: '免责声明：本工具计算结果仅供参考，不作为最终投资决策依据。具体参数请咨询专业设计院。'
        },
        
        // Efficiency calculator
        effCalc: {
            title: '🔥 锅炉效率反推助手',
            fuelType: '燃料类型',
            fuelAmount: '燃料消耗量',
            outputType: '输出类型',
            hotWater: '热水',
            steam: '蒸汽',
            waterMass: '产水量 (吨)',
            waterInTemp: '进水温度 (℃)',
            waterOutTemp: '出水温度 (℃)',
            steamMass: '产汽量 (吨)',
            steamPressure: '蒸汽压力 (MPa)',
            feedTemp: '补水温度 (℃)',
            result: '计算效率结果'
        },
        
        // Table headers
        table: {
            scenarioName: '方案名称',
            unitSteamCost: '折算吨汽成本',
            savingRate: '综合节能率',
            investment: '投资(万)',
            annualTotalCost: '年总成本(万)',
            annualSaving: '年节省(万)',
            staticPayback: '静态回收期',
            dynamicPayback: '动态回收期',
            lccTotal: 'LCC(万)',
            co2Reduction: '碳减排(吨)',
            action: '操作',
            schemeName: '方案名称',
            lccTotalFull: 'LCC总值(万)'
        },
        
        // Data table
        dataTable: {
            hpScheme: '工业热泵 (本方案)',
            note1: '注：LCC (全生命周期成本) 已包含资金时间价值，折现率',
            note2: '折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。',
            year: '年',
            immediately: '立即',
            na: 'N/A',
            cannotRecover: '无法回收'
        },
        
        // Conclusion
        conclusion: {
            recommend: '🚀 推荐投资',
            average: '⚖️ 投资回报一般',
            compared: '相比于',
            hpScheme: '工业热泵方案预计每年可节省',
            yuan: '万元',
            savingRateText: '综合费用节能率达',
            hpCost: '您的热泵供热成本相当于',
            perTonSteam: '元/吨蒸汽',
            cost: '的成本为',
            perTon: '元/吨',
            lifetimeSaving: '全生命周期（{years}年）累计节省',
            dynamicPaybackText: '动态回收期为'
        },
        
        // Scenarios
        scenario: {
            empty: '暂无暂存方案',
            saved: '方案已暂存',
            savePrompt: '请先运行计算，再暂存方案。',
            clearConfirm: '确定要清空所有暂存方案吗？',
            scenario: '方案',
            modePure: '热泵',
            modeHybrid: '混合',
            modeBOT: '(BOT)'
        },
        
        // Charts
        chart: {
            annualCostComparison: '年度成本对比',
            lccBreakdown: 'LCC 成本构成',
            energyCost: '能源成本',
            opexCost: '运维成本',
            perYear: '万元/年',
            initialInvestment: '初始投资',
            lifetimeEnergy: '全周期能源',
            lifetimeOpex: '全周期运维',
            residualValue: '残值回收',
            total: '总计'
        },
        
        // Messages
        message: {
            welcome: '👋 欢迎使用！请在左侧配置参数，然后点击"运行计算"开启分析。',
            noData: '暂无分析数据',
            noDataPrompt: '请在左侧侧边栏输入项目参数，<br>并点击 <span class="font-bold text-blue-500">"运行计算"</span> 按钮。',
            pleaseConfig: '请点击配置参数...',
            pleaseCalculate: '请先进行计算',
            keepOneTier: '至少保留一个电价时段',
            resetConfirm: '确定要恢复默认参数吗？',
            pleaseCalculateFirst: '请先运行计算，再暂存方案。'
        },
        
        // Modal
        modal: {
            confirm: '确认',
            cancel: '取消'
        },
        
        // Common
        common: {
            unit: {
                year: '年',
                ton: '吨',
                tenThousand: '万',
                yuan: '元',
                percent: '%',
                yuanPerTonSteam: '元/吨蒸汽',
                yuanPerYear: '元/年'
            },
            comparison: {
                gas: '天然气锅炉',
                coal: '燃煤锅炉',
                fuel: '燃油锅炉',
                electric: '电锅炉',
                steam: '管网蒸汽',
                biomass: '生物质锅炉'
            },
            fuelShort: {
                gas: '气',
                coal: '煤',
                fuel: '油',
                biomass: '生物',
                steam: '蒸汽'
            },
            fuelName: {
                gas: '天然气',
                coal: '燃煤',
                fuel: '燃油',
                biomass: '生物质'
            }
        }
    },
    
    en: {
        // Page title and header
        page: {
            title: 'Industrial Heat Pump Benefit Analyzer',
            subtitle: 'V9.0.0 | Industrial Heat Pump',
            benefitAnalysis: 'Benefit Analysis',
            dashboard: 'Real-time Evaluation Dashboard'
        },
        
        // Language switcher
        lang: {
            zh: '中文',
            en: 'English',
            switch: 'Switch Language'
        },
        
        // Buttons
        button: {
            reset: 'Reset',
            enableComparison: 'Enable Comparison',
            calculate: 'Run Calculation',
            saveScenario: 'Save Current Scenario',
            export: 'Export',
            exportReport: 'Export Report',
            config: 'Configure Parameters',
            confirm: 'Confirm',
            cancel: 'Cancel',
            close: 'Close',
            delete: 'Delete',
            clear: 'Clear',
            undo: 'Undo',
            add: 'Add',
            calc: 'Calculate',
            apply: 'Apply Result'
        },
        
        // Cards
        card: {
            annualSaving: 'Annual Savings',
            irr: 'Internal Rate of Return (IRR)',
            pbp: 'Dynamic Payback Period',
            co2Reduction: 'Annual CO₂ Reduction'
        },
        
        // Tabs
        tab: {
            charts: 'Chart Analysis',
            dataTable: 'Detailed Data',
            conclusion: 'Smart Conclusion',
            scenarios: 'Scenario Comparison'
        },
        
        // Accordion sections
        accordion: {
            project: '1. Project & Load',
            scheme: '2. Scheme & Investment',
            operating: '3. Operating Parameters',
            financial: '4. Financial Model'
        },
        
        // Project inputs
        project: {
            name: 'Project Name',
            namePlaceholder: 'Sample Project',
            loadMode: 'Load Calculation Mode',
            modeA: 'Mode A',
            modeB: 'Mode B',
            modeC: 'Mode C',
            annualMethod: 'Annual Hours Method',
            totalMethod: 'Total Amount Method',
            intermittentMethod: 'Intermittent Method',
            heatingLoad: 'Heating Load (Design Value)',
            operatingHours: 'Annual Operating Hours (h)',
            annualHeating: 'Annual Total Heating Demand',
            operatingHoursReverse: 'Annual Operating Hours (Reverse)',
            dailyHours: 'Daily Operating (h)',
            annualDays: 'Annual Days (d)',
            loadFactor: 'Average Load Factor (%)'
        },
        
        // Scheme inputs
        scheme: {
            systemMode: 'System Mode',
            pureHP: '1. Pure Heat Pump',
            hybrid: '2. Hybrid System',
            hpInvestment: 'Heat Pump Investment (10k CNY)',
            storageInvestment: 'Storage Investment (10k CNY)',
            hybridConfig: 'Hybrid System Configuration',
            auxHeaterType: 'Auxiliary Heat Source Type',
            hpLoadShare: 'Heat Pump Load Share (%)',
            auxLoadNote: 'Remaining by Auxiliary Heater',
            auxHeaterInvestment: 'Aux Heater Investment (10k CNY)',
            auxHeaterOpex: 'Aux Heater O&M (10k CNY)',
            comparisonConfig: 'Comparison Baseline Configuration',
            electric: 'Electric Boiler',
            gas: 'Natural Gas',
            coal: 'Coal',
            fuel: 'Fuel Oil',
            biomass: 'Biomass',
            steam: 'Steam',
            investment: 'Investment (10k CNY)'
        },
        
        // Operating inputs
        operating: {
            hpSPF: 'Industrial Heat Pump SPF (Efficiency)',
            keyIndicator: 'Key Indicator',
            priceConfig: 'Electricity Price Configuration (CNY/kWh)',
            greenPower: 'Enable Green Power (Zero Carbon Mode)',
            gasPrice: 'Gas Price (CNY/m³)',
            coalPrice: 'Coal Price (CNY/t)',
            steamPrice: 'Steam Price (CNY/t)',
            fuelPrice: 'Fuel Price (CNY/t)',
            biomassPrice: 'Biomass (CNY/t)',
            boilerEfficiency: 'Boiler Efficiency (%)',
            advancedParams: 'Advanced Energy Parameters (Unit Conversion)',
            emission: 'Emission',
            calorific: 'Calorific Value',
            opex: 'O&M Cost (10k CNY/year)',
            hpOpex: 'Industrial Heat Pump',
            electricAux: 'Electric Heating',
            gasBoiler: 'Natural Gas Boiler',
            coalBoiler: 'Coal Boiler',
            fuelBoiler: 'Fuel Oil Boiler',
            biomassBoiler: 'Biomass Boiler',
            steamNetwork: 'Steam Network',
            pipeSteam: 'Pipeline Steam',
            reverseCalc: 'Reverse Calc'
        },
        
        // Financial inputs
        financial: {
            businessModel: 'Business Model',
            selfInvest: '1. Owner Investment',
            bot: '2. Energy Management/BOT',
            analysisYears: 'Analysis Period (years)',
            discountRate: 'Discount Rate (%)',
            botParams: 'BOT Parameter Settings',
            annualRevenue: 'Annual Service Revenue (10k CNY)',
            equityRatio: 'Equity Ratio (%)',
            energyInflation: 'Energy Inflation Rate (%)',
            opexInflation: 'O&M Inflation Rate (%)',
            author: 'Created by: Jing Yanrong',
            usageCounter: 'Total Runs: {count}',
            disclaimer: 'Disclaimer: The calculation results of this tool are for reference only and do not constitute the final investment decision basis. Please consult professional design institutes for specific parameters.'
        },
        
        // Efficiency calculator
        effCalc: {
            title: '🔥 Boiler Efficiency Calculator',
            fuelType: 'Fuel Type',
            fuelAmount: 'Fuel Consumption',
            outputType: 'Output Type',
            hotWater: 'Hot Water',
            steam: 'Steam',
            waterMass: 'Water Output (ton)',
            waterInTemp: 'Inlet Temperature (℃)',
            waterOutTemp: 'Outlet Temperature (℃)',
            steamMass: 'Steam Output (ton)',
            steamPressure: 'Steam Pressure (MPa)',
            feedTemp: 'Feed Water Temperature (℃)',
            result: 'Efficiency Result'
        },
        
        // Table headers
        table: {
            scenarioName: 'Scenario Name',
            unitSteamCost: 'Unit Steam Cost',
            savingRate: 'Energy Saving Rate',
            investment: 'Investment (10k CNY)',
            annualTotalCost: 'Annual Total Cost (10k CNY)',
            annualSaving: 'Annual Saving (10k CNY)',
            staticPayback: 'Static Payback Period',
            dynamicPayback: 'Dynamic Payback Period',
            lccTotal: 'LCC (10k CNY)',
            co2Reduction: 'CO₂ Reduction (ton)',
            action: 'Action',
            schemeName: 'Scheme Name',
            lccTotalFull: 'LCC Total (10k CNY)'
        },
        
        // Data table
        dataTable: {
            hpScheme: 'Industrial Heat Pump (This Scheme)',
            note1: '* Note: LCC (Life Cycle Cost) includes time value of money, discount rate',
            note2: '* Unit steam cost is calculated based on standard steam calorific value (approx. 698kWh/ton).',
            year: 'years',
            immediately: 'Immediate',
            na: 'N/A',
            cannotRecover: 'Cannot Recover'
        },
        
        // Conclusion
        conclusion: {
            recommend: '🚀 Recommended Investment',
            average: '⚖️ Average Return on Investment',
            compared: 'Compared to',
            hpScheme: 'the industrial heat pump scheme is expected to save',
            yuan: '10k CNY',
            savingRateText: 'per year, with a comprehensive energy saving rate of',
            hpCost: 'Your heat pump heating cost is equivalent to',
            perTonSteam: 'CNY/ton steam',
            cost: ', while',
            perTon: 'cost is',
            lifetimeSaving: 'CNY/ton. The cumulative savings over the full life cycle ({years} years) is',
            dynamicPaybackText: '10k CNY. The dynamic payback period is'
        },
        
        // Scenarios
        scenario: {
            empty: 'No Saved Scenarios',
            saved: 'Scenario Saved',
            savePrompt: 'Please run calculation first, then save scenario.',
            clearConfirm: 'Are you sure you want to clear all saved scenarios?',
            scenario: 'Scenario',
            modePure: 'Heat Pump',
            modeHybrid: 'Hybrid',
            modeBOT: '(BOT)'
        },
        
        // Charts
        chart: {
            annualCostComparison: 'Annual Cost Comparison',
            lccBreakdown: 'LCC Cost Breakdown',
            energyCost: 'Energy Cost',
            opexCost: 'O&M Cost',
            perYear: '10k CNY/year',
            initialInvestment: 'Initial Investment',
            lifetimeEnergy: 'Lifetime Energy',
            lifetimeOpex: 'Lifetime O&M',
            residualValue: 'Residual Value',
            total: 'Total'
        },
        
        // Messages
        message: {
            welcome: '👋 Welcome! Please configure parameters on the left, then click "Run Calculation" to start analysis.',
            noData: 'No Analysis Data',
            noDataPrompt: 'Please enter project parameters in the left sidebar,<br>and click the <span class="font-bold text-blue-500">"Run Calculation"</span> button.',
            pleaseConfig: 'Please click to configure parameters...',
            pleaseCalculate: 'Please calculate first',
            keepOneTier: 'Keep at least one electricity price tier',
            resetConfirm: 'Are you sure you want to reset to default parameters?',
            pleaseCalculateFirst: 'Please run calculation first, then save scenario.'
        },
        
        // Modal
        modal: {
            confirm: 'Confirm',
            cancel: 'Cancel'
        },
        
        // Common
        common: {
            unit: {
                year: 'years',
                ton: 'ton',
                tenThousand: '10k',
                yuan: 'CNY',
                percent: '%',
                yuanPerTonSteam: 'CNY/ton steam',
                yuanPerYear: 'CNY/year'
            },
            comparison: {
                gas: 'Natural Gas Boiler',
                coal: 'Coal Boiler',
                fuel: 'Fuel Oil Boiler',
                electric: 'Electric Boiler',
                steam: 'Steam Network',
                biomass: 'Biomass Boiler'
            }
        }
    }
};

// Current language
let currentLang = DEFAULT_LANG;

// Get translation function
export function t(key, params = {}) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }
    
    // Handle template strings
    if (typeof value === 'string' && Object.keys(params).length > 0) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
            return params[paramKey] !== undefined ? params[paramKey] : match;
        });
    }
    
    return value || key;
}

// Set language
export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
        return true;
    }
    return false;
}

// Get current language
export function getCurrentLanguage() {
    return currentLang;
}

// Initialize i18n system
export function initI18n() {
    const savedLang = localStorage.getItem(STORAGE_KEY);
    const lang = savedLang && translations[savedLang] ? savedLang : DEFAULT_LANG;
    setLanguage(lang);
}

// Export translations for direct access (if needed)
export { translations };
