// src/js/ui.js
// V19.8 FIXED: Mobile Cutoff Issues & Responsive Typography

import { ENERGY_DEFAULTS, EFF_CALC_DEFAULTS } from './config.js'; 
import { validateInput } from './ui-validator.js';
import { calculateBoilerEfficiency, fWan, fYuan, fInt, fNum, fTon, fCop, fPercent, fYears } from './utils.js';
import * as Dashboard from './ui-dashboard.js';
import { createCostChart, createLccChart, destroyCharts } from './ui-chart.js';

let latestResults = null;
const defAttr = (val) => `value="${val}" data-default="${val}"`;

// --- 内置单位换算系数 ---
const LOCAL_CONVERTERS = { 'MJ': 1, 'kJ': 0.001, 'kcal': 0.004186, 'kWh': 3.6 };

// --- 样式常量 (响应式微调：手机端更紧凑) ---
const INPUT_STYLE = "w-full px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg text-base md:text-lg font-bold text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder-gray-400 h-10 md:h-12 shadow-sm";
const LABEL_STYLE = "block text-sm font-bold text-gray-600 mb-1 md:mb-2 tracking-wide";
const GROUP_STYLE = "bg-white p-1 mb-4 md:mb-6";

// ==========================================
// 1. HTML 生成器
// ==========================================

function generateProjectInputsHTML() {
    return `
        <div class="${GROUP_STYLE}">
            <label class="${LABEL_STYLE}">项目名称</label>
            <input type="text" id="projectName" ${defAttr("示例项目")} class="${INPUT_STYLE}">
        </div>

        <div class="pt-4 md:pt-6 border-t border-gray-200">
            <label class="${LABEL_STYLE} mb-3 md:mb-4">计算模式</label>
            <div class="grid grid-cols-3 gap-2 md:gap-3">
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="annual" class="peer sr-only" checked>
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-sm md:text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 A</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">年时法</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="total" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-sm md:text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 B</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">总量法</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="daily" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-sm md:text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 C</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">间歇法</span>
                    </div>
                </label>
            </div>
        </div>

        <div id="input-group-load" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${LABEL_STYLE} !mb-0">制热负荷 (设计值)</label>
                    <select id="heatingLoadUnit" class="text-xs md:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </div>
                <input type="number" id="heatingLoad" ${defAttr("1000")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-hours-a" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <label class="${LABEL_STYLE}">年运行小时 (h)</label>
                <input type="number" id="operatingHours" ${defAttr("2000")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-total" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${LABEL_STYLE} !mb-0">年总加热量</label>
                    <select id="annualHeatingUnit" class="text-xs md:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </div>
                <input type="number" id="annualHeating" ${defAttr("2000000")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
            <div>
                <label class="${LABEL_STYLE}">年运行小时 (反推)</label>
                <input type="number" id="operatingHours_B" ${defAttr("2000")} class="${INPUT_STYLE}" placeholder="自动计算">
            </div>
        </div>

        <div id="input-group-daily" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${LABEL_STYLE}">日运行 (h)</label>
                    <input type="number" id="dailyHours" ${defAttr("8")} class="${INPUT_STYLE}">
                </div>
                <div>
                    <label class="${LABEL_STYLE}">年天数 (d)</label>
                    <input type="number" id="annualDays" ${defAttr("300")} class="${INPUT_STYLE}">
                </div>
            </div>
            <div>
                <label class="${LABEL_STYLE}">平均负荷率 (%)</label>
                <input type="number" id="loadFactor" ${defAttr("70")} class="${INPUT_STYLE}">
            </div>
        </div>
    `;
}

function generateSchemeInputsHTML() {
    return `
        <div class="hidden"><input type="radio" id="modeStandard" name="schemeAMode" value="standard" checked></div>
        <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <div>
                <label class="${LABEL_STYLE}">热泵投资 (万)</label>
                <input type="number" id="hpCapex" ${defAttr(ENERGY_DEFAULTS.hp.capex || "200")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
            <div>
                <label class="${LABEL_STYLE}">储能投资 (万)</label>
                <input type="number" id="storageCapex" ${defAttr("0")} class="${INPUT_STYLE}">
            </div>
        </div>
        <div class="pt-4 md:pt-6 border-t border-gray-200">
             <label class="block text-base font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                <span class="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></span>对比基准配置
             </label>
             <div class="space-y-2 md:space-y-3">
                ${[
                    {k:'gas', n:'天然气'}, {k:'coal', n:'燃煤'}, {k:'electric', n:'电锅炉'}, 
                    {k:'steam', n:'蒸汽'}, {k:'fuel', n:'燃油'}, {k:'biomass', n:'生物质'}
                ].map(item => {
                    const defCapex = ENERGY_DEFAULTS[item.k].capex;
                    return `
                    <div class="flex items-center justify-between group related-to-${item.k} transition-all duration-200 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${item.k}" data-target="${item.k}" class="comparison-toggle w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" checked>
                            <label for="compare_${item.k}" class="ml-3 text-sm md:text-base font-bold text-gray-700 cursor-pointer select-none">${item.n}</label>
                        </div>
                        <div class="flex items-center gap-2 md:gap-3">
                            <span class="text-xs text-gray-400 font-bold hidden md:inline">投资(万)</span>
                            <div class="relative w-20 md:w-24">
                                <input type="number" id="${item.k}BoilerCapex" ${defAttr(defCapex)} class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm md:text-base font-bold text-right focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 outline-none transition-all text-gray-700" placeholder="0">
                            </div>
                            <input type="hidden" id="${item.k}SalvageRate" value="${item.k === 'steam' ? 0 : 5}">
                        </div>
                    </div>
                    `;
                }).join('')}
             </div>
        </div>
    `;
}

function generateOperatingInputsHTML() {
    return `
        <div>
            <label class="${LABEL_STYLE} flex justify-between items-center">
                <span>工业热泵 SPF (能效)</span>
                <span class="text-blue-600 text-[10px] md:text-xs font-bold bg-blue-100 px-2 py-0.5 rounded">关键指标</span>
            </label>
            <input type="number" id="hpCop" ${defAttr(ENERGY_DEFAULTS.hp.cop)} step="0.1" class="${INPUT_STYLE} !text-xl md:!text-2xl !text-blue-700" data-validation="isStrictlyPositive">
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200 space-y-4 md:space-y-6">
             <div>
                <div class="flex justify-between items-center mb-2 md:mb-4">
                    <label class="${LABEL_STYLE} !mb-0">电价配置 (元/kWh)</label>
                    <button type="button" id="addPriceTierBtn" class="text-[10px] md:text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg transition">+ 添加</button>
                </div>
                <div id="priceTiersContainer" class="space-y-2 md:space-y-3 mb-2 md:mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${ENERGY_DEFAULTS.electric.price}" class="track-change"> 
                <label class="flex items-center cursor-pointer p-2 md:p-3 bg-green-50/50 border border-green-200 rounded-xl hover:border-green-300 transition">
                    <input type="checkbox" id="greenPowerToggle" class="w-4 h-4 md:w-5 md:h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 track-change">
                    <span class="ml-2 md:ml-3 text-sm md:text-base font-bold text-green-800">启用绿电 (零碳模式)</span>
                </label>
             </div>
             <div class="grid grid-cols-2 gap-3 md:gap-4">
                 <div class="related-to-gas"><label class="${LABEL_STYLE}">气价 (元/m³)</label><input type="number" id="gasPrice" ${defAttr(ENERGY_DEFAULTS.gas.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-coal"><label class="${LABEL_STYLE}">煤价 (元/t)</label><input type="number" id="coalPrice" ${defAttr(ENERGY_DEFAULTS.coal.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-steam"><label class="${LABEL_STYLE}">汽价 (元/t)</label><input type="number" id="steamPrice" ${defAttr(ENERGY_DEFAULTS.steam.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-fuel"><label class="${LABEL_STYLE}">油价 (元/t)</label><input type="number" id="fuelPrice" ${defAttr(ENERGY_DEFAULTS.fuel.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-biomass"><label class="${LABEL_STYLE}">生物质 (元/t)</label><input type="number" id="biomassPrice" ${defAttr(ENERGY_DEFAULTS.biomass.price)} class="${INPUT_STYLE}"></div>
             </div>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${LABEL_STYLE} mb-2 md:mb-4">锅炉效率 (%)</label>
            <div class="space-y-2 md:space-y-3">
                ${[
                    {id:'gas', label:'气', val:ENERGY_DEFAULTS.gas.boilerEff}, {id:'coal', label:'煤', val:ENERGY_DEFAULTS.coal.boilerEff}, 
                    {id:'fuel', label:'油', val:ENERGY_DEFAULTS.fuel.boilerEff}, {id:'biomass', label:'生物', val:ENERGY_DEFAULTS.biomass.boilerEff}
                ].map(item => `
                    <div class="flex items-center justify-between related-to-${item.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-10 md:w-12">${item.label}</span>
                        <div class="flex-1 flex items-center space-x-2">
                            <input type="number" id="${item.id}BoilerEfficiency" ${defAttr(item.val)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-base md:text-lg font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all text-center h-9 md:h-10">
                            <button type="button" class="eff-calc-btn text-blue-600 bg-blue-50 hover:bg-blue-100 text-[10px] md:text-xs font-bold px-2 md:px-3 py-2 rounded-lg border border-blue-100 transition-colors whitespace-nowrap" data-target="${item.id}BoilerEfficiency" data-fuel="${item.id}">反推</button>
                        </div>
                    </div>
                `).join('')}
                <div class="hidden"><input type="number" id="electricBoilerEfficiency" value="98"><input type="number" id="steamEfficiency" value="98"></div>
            </div>
        </div>
        <div class="mt-4 md:mt-6 pt-4 border-t border-dashed border-gray-200">
            <details class="group">
                <summary class="flex justify-between items-center font-bold cursor-pointer list-none text-gray-500 hover:text-blue-600 transition-colors text-sm md:text-base select-none py-2 bg-gray-50 rounded-lg px-3">
                    <span>⚙️ 高级能源参数 (单位换算)</span>
                    <span class="transition group-open:rotate-180"><svg fill="none" height="20" width="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span>
                </summary>
                <div class="text-gray-500 mt-3 grid grid-cols-1 gap-3 animate-fadeIn">
                    <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200">
                        <span class="text-xs md:text-sm font-bold text-gray-700">电 (Electric)</span>
                        <div class="flex items-center"><span class="text-[10px] md:text-xs mr-2 font-bold">排放</span><input id="gridFactor" type="number" ${defAttr(ENERGY_DEFAULTS.electric.factor)} class="w-16 md:w-20 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-xs md:text-sm"><span class="ml-1 md:ml-2 text-[10px] md:text-xs font-bold">kg/kWh</span></div>
                    </div>
                    ${['gas|气|m³', 'coal|煤|kg', 'fuel|油|kg', 'biomass|生物|kg', 'steam|蒸汽|kg'].map(item => {
                        const [k, n, u] = item.split('|');
                        return `
                        <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200 related-to-${k}">
                            <span class="text-xs md:text-sm font-bold text-gray-700">${n}</span>
                            <div class="flex items-center gap-1 md:gap-2">
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold">热值</span>
                                    <input id="${k}Calorific" type="number" ${defAttr(ENERGY_DEFAULTS[k].calorific)} class="w-12 md:w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-[10px] md:text-sm">
                                    <select id="${k}CalorificUnit" class="ml-0.5 md:ml-1 p-1 border border-gray-300 rounded bg-white text-[10px] md:text-xs font-bold w-12 md:w-16 track-change unit-converter" data-target-input="${k}Calorific">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                    </select>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold hidden lg:inline">排放</span>
                                    <input id="${k}Factor" type="number" ${defAttr(ENERGY_DEFAULTS[k].factor)} class="w-12 md:w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-[10px] md:text-sm">
                                    <span class="text-[10px] md:text-xs font-bold text-gray-500 ml-0.5">kg</span>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </details>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${LABEL_STYLE} mb-3 md:mb-4">运维成本 (万/年)</label>
            <div class="space-y-3 md:space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm md:text-base font-bold text-blue-600 w-20 md:w-24">工业热泵</span>
                    <input type="number" id="hpOpexCost" ${defAttr(ENERGY_DEFAULTS.hp.opex)} class="flex-1 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-base md:text-lg font-bold text-blue-800 text-center h-10 md:h-12 shadow-sm">
                </div>
                ${[
                    {id:'gas', label:'天然气', val:ENERGY_DEFAULTS.gas.opex}, {id:'coal', label:'燃煤', val:ENERGY_DEFAULTS.coal.opex},
                    {id:'electric', label:'电锅炉', val:ENERGY_DEFAULTS.electric.opex}, {id:'steam', label:'蒸汽', val:ENERGY_DEFAULTS.steam.opex},
                    {id:'fuel', label:'燃油', val:ENERGY_DEFAULTS.fuel.opex}, {id:'biomass', label:'生物质', val:ENERGY_DEFAULTS.biomass.opex}
                ].map(item => `
                    <div class="flex items-center justify-between related-to-${item.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-20 md:w-24">${item.label}</span>
                        <input type="number" id="${item.id}OpexCost" ${defAttr(item.val)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-base md:text-lg font-bold text-gray-700 text-center h-10 md:h-12">
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-200 text-center pb-24">
            <p class="text-sm font-bold text-gray-600">编者：荆炎荣 | AI 策划</p>
            <p class="text-xs text-gray-400 mt-2 leading-tight px-4">免责声明：本工具计算结果仅供参考，不作为最终投资决策依据。</p>
        </div>
    `;
}

function generateFinancialInputsHTML() {
    return `
        <div class="space-y-4 md:space-y-6">
            <div>
                <label class="${LABEL_STYLE}">分析年限 (年)</label>
                <input type="number" id="lccYears" ${defAttr("15")} class="${INPUT_STYLE}">
            </div>
            <div>
                <label class="${LABEL_STYLE}">折现率 (%)</label>
                <input type="number" id="discountRate" ${defAttr("8")} class="${INPUT_STYLE}">
            </div>
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${LABEL_STYLE}">能源涨幅(%)</label>
                    <input type="number" id="energyInflationRate" ${defAttr("3")} class="${INPUT_STYLE}">
                </div>
                <div>
                    <label class="${LABEL_STYLE}">运维涨幅(%)</label>
                    <input type="number" id="opexInflationRate" ${defAttr("5")} class="${INPUT_STYLE}">
                </div>
            </div>
            <div class="h-20 md:hidden"></div>
        </div>
    `;
}

// ==========================================
// 2. 初始化与逻辑处理
// ==========================================

export function initializeUI(handleCalculate) {
    injectAccordionContent('accordion-project', '1. 项目与负荷', generateProjectInputsHTML());
    injectAccordionContent('accordion-scheme', '2. 方案与投资', generateSchemeInputsHTML());
    injectAccordionContent('accordion-operating', '3. 运行参数', generateOperatingInputsHTML());
    injectAccordionContent('accordion-financial', '4. 财务模型', generateFinancialInputsHTML());

    Dashboard.initializeDashboard();
    setupInputMonitoring(); 
    setupUnitAutoConverters(); // 启动单位自动换算

    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) calcBtn.addEventListener('click', () => handleCalculate());

    setupSimpleUnitConverter('heatingLoadUnit', 'heatingLoad', {'kW': 1, 'kcal/h': 1/1.163}); 

    const modeRadios = document.querySelectorAll('input[name="calcMode"]');
    modeRadios.forEach(r => r.addEventListener('change', updateCalcModeUI));
    updateCalcModeUI(); 

    const toggles = document.querySelectorAll('.comparison-toggle');
    toggles.forEach(t => t.addEventListener('change', updateComparisonStyles));
    updateComparisonStyles();

    const addTierBtn = document.getElementById('addPriceTierBtn');
    if (addTierBtn) {
        addTierBtn.addEventListener('click', () => {
            addNewPriceTier();
            handleCalculate();
        });
    }
    addNewPriceTier("平均电价", ENERGY_DEFAULTS.electric.price, "100");

    setupEfficiencyCalculator();
    setupExportButton();

    const resetBtn = document.getElementById('btn-reset-params');
    if(resetBtn) resetBtn.addEventListener('click', resetParams);
    
    const scenarioToggle = document.getElementById('enableScenarioComparison');
    if (scenarioToggle) {
        scenarioToggle.addEventListener('change', () => {
            const saveBtn = document.getElementById('saveScenarioBtn');
            const scenarioTab = document.querySelector('.tab-link[data-tab="scenarios"]');
            if(scenarioToggle.checked) {
                if(saveBtn) saveBtn.classList.remove('hidden');
                if(scenarioTab) scenarioTab.classList.remove('hidden');
            } else {
                if(saveBtn) saveBtn.classList.add('hidden');
                if(scenarioTab) scenarioTab.classList.add('hidden');
            }
        });
        scenarioToggle.dispatchEvent(new Event('change'));
    }
    
    window.updateSimplePriceTier = function(val) {}; 
}

// 自动换算逻辑
function setupUnitAutoConverters() {
    document.querySelectorAll('.unit-converter').forEach(select => {
        select.dataset.prevUnit = select.value;
        select.addEventListener('change', (e) => {
            const targetId = select.dataset.targetInput;
            const inputEl = document.getElementById(targetId);
            const newUnit = select.value;
            const oldUnit = select.dataset.prevUnit;
            
            if (inputEl && inputEl.value) {
                const val = parseFloat(inputEl.value);
                const factorOld = LOCAL_CONVERTERS[oldUnit];
                const factorNew = LOCAL_CONVERTERS[newUnit];
                
                if (factorOld && factorNew) {
                    const newVal = val * (factorOld / factorNew);
                    inputEl.value = parseFloat(newVal.toPrecision(5));
                    inputEl.classList.add('text-blue-600', 'font-bold');
                    inputEl.classList.remove('text-gray-900');
                }
            }
            select.dataset.prevUnit = newUnit;
        });
    });
}

function setupInputMonitoring() {
    document.querySelectorAll('input[data-default], select[data-default]').forEach(el => {
        el.addEventListener('input', () => {
            if(el.type === 'checkbox') return;
            const isModified = el.value != el.dataset.default;
            if(isModified) {
                el.classList.add('text-blue-600', 'border-blue-500');
                el.classList.remove('text-gray-900', 'border-gray-300');
            } else {
                el.classList.remove('text-blue-600', 'border-blue-500');
                el.classList.add('text-gray-900', 'border-gray-300');
            }
        });
    });
}

function addNewPriceTier(name = "", price = "", dist = "") {
    const container = document.getElementById('priceTiersContainer');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'price-tier-entry flex gap-2 items-center mb-2';
    div.innerHTML = `
        <input type="text" class="tier-name w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="时段" value="${name}">
        <input type="number" class="tier-price w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="价格" value="${price}">
        <span class="text-gray-400 text-base font-bold">@</span>
        <input type="number" class="tier-dist w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="%" value="${dist}">
        <button type="button" class="text-red-500 hover:text-red-700 px-2 text-xl font-bold remove-tier-btn transition">×</button>
    `;
    div.querySelector('.remove-tier-btn').addEventListener('click', () => {
        if (container.children.length > 1) { div.remove(); document.getElementById('calculateBtn')?.click(); } else { alert("至少保留一个电价时段"); }
    });
    div.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => document.getElementById('calculateBtn')?.click());
    });
    container.appendChild(div);
}

function injectAccordionContent(containerId, title, contentHTML) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <button class="accordion-header flex justify-between items-center w-full px-4 md:px-6 py-4 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200 cursor-pointer" type="button" aria-expanded="true" aria-controls="${containerId}-content">
            <span class="text-lg font-extrabold text-gray-900 tracking-wide">${title}</span>
            <svg class="accordion-icon w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div id="${containerId}-content" class="accordion-content open px-4 md:px-6 py-4 md:py-6 border-t border-gray-100">
            ${contentHTML}
        </div>
    `;
}

function updateCalcModeUI() {
    const mode = document.querySelector('input[name="calcMode"]:checked').value;
    document.getElementById('input-group-load').classList.toggle('hidden', mode === 'total');
    document.getElementById('input-group-hours-a').classList.toggle('hidden', mode !== 'annual');
    document.getElementById('input-group-total').classList.toggle('hidden', mode !== 'total');
    document.getElementById('input-group-daily').classList.toggle('hidden', mode !== 'daily');
}

function updateComparisonStyles() {
    document.querySelectorAll('.comparison-toggle').forEach(toggle => {
        const target = toggle.dataset.target;
        const containers = document.querySelectorAll(`.related-to-${target}`);
        containers.forEach(container => {
            const inputs = container.querySelectorAll('input:not(.comparison-toggle), button');
            if(!toggle.checked) {
                container.classList.add('opacity-40', 'grayscale');
                inputs.forEach(i => i.disabled = true);
            } else {
                container.classList.remove('opacity-40', 'grayscale');
                inputs.forEach(i => i.disabled = false);
            }
        });
    });
}

function setupSimpleUnitConverter(selectId, inputId, factors) {
    const sel = document.getElementById(selectId);
    const inp = document.getElementById(inputId);
    if(!sel || !inp) return;
    sel.addEventListener('change', () => {});
}

function resetParams() { if(confirm('确定要恢复默认参数吗？')) location.reload(); }

function setupExportButton() {
    const btn = document.getElementById('export-report-btn');
    if (btn) btn.addEventListener('click', () => { if (!latestResults) { alert("请先进行计算"); return; } buildPrintReport(latestResults); setTimeout(() => { window.print(); }, 500); });
}

// 核心功能：数据读取
export function readAllInputs(showErrorCallback) {
    const getVal = (id) => { const el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : 0; };
    const getValByUnit = (id, unitId) => {
        let val = getVal(id);
        const unitEl = document.getElementById(unitId);
        if (unitEl && val > 0) {
            return { value: val, unit: unitEl.value };
        }
        return { value: val, unit: 'MJ' }; 
    };

    const priceTiers = [];
    document.querySelectorAll('.price-tier-entry').forEach(entry => { priceTiers.push({ name: entry.querySelector('.tier-name').value, price: parseFloat(entry.querySelector('.tier-price').value) || 0, dist: parseFloat(entry.querySelector('.tier-dist').value) || 0 }); });
    if(priceTiers.length === 0) priceTiers.push({name:'默认', price:0.7, dist:100});
    const calcMode = document.querySelector('input[name="calcMode"]:checked').value;
    let heatingLoad = 0, operatingHours = 0, annualHeatingDemandKWh = 0;
    if (calcMode === 'annual') { heatingLoad = getVal('heatingLoad'); operatingHours = getVal('operatingHours'); annualHeatingDemandKWh = heatingLoad * operatingHours; } 
    else if (calcMode === 'total') { annualHeatingDemandKWh = getVal('annualHeating'); operatingHours = getVal('operatingHours_B'); heatingLoad = operatingHours > 0 ? annualHeatingDemandKWh / operatingHours : 0; } 
    else { heatingLoad = getVal('heatingLoad'); operatingHours = getVal('dailyHours') * getVal('annualDays') * (getVal('loadFactor')/100); annualHeatingDemandKWh = heatingLoad * operatingHours; }
    
    const isGreenPower = document.getElementById('greenPowerToggle')?.checked || false;

    return {
        projectName: document.getElementById('projectName').value, analysisMode: 'standard', isHybridMode: false, priceTiers, heatingLoad, operatingHours, annualHeatingDemandKWh,
        lccYears: getVal('lccYears'), discountRate: getVal('discountRate') / 100, energyInflationRate: getVal('energyInflationRate') / 100, opexInflationRate: getVal('opexInflationRate') / 100,
        hpHostCapex: getVal('hpCapex') * 10000, hpStorageCapex: getVal('storageCapex') * 10000, hpSalvageRate: getVal('hpSalvageRate') / 100, hpCop: getVal('hpCop'), hpOpexCost: getVal('hpOpexCost') * 10000,
        
        gasCalorificObj: getValByUnit('gasCalorific', 'gasCalorificUnit'),
        coalCalorificObj: getValByUnit('coalCalorific', 'coalCalorificUnit'),
        fuelCalorificObj: getValByUnit('fuelCalorific', 'fuelCalorificUnit'),
        biomassCalorificObj: getValByUnit('biomassCalorific', 'biomassCalorificUnit'),
        steamCalorificObj: getValByUnit('steamCalorific', 'steamCalorificUnit'),

        gridFactor: isGreenPower ? 0 : getVal('gridFactor'), 
        gasFactor: getVal('gasFactor'),
        coalFactor: getVal('coalFactor'),
        fuelFactor: getVal('fuelFactor'),
        biomassFactor: getVal('biomassFactor'),
        steamFactor: getVal('steamFactor'),

        gasBoilerCapex: getVal('gasBoilerCapex') * 10000, gasSalvageRate: 0.05, gasBoilerEfficiency: getVal('gasBoilerEfficiency') / 100, gasPrice: getVal('gasPrice'), gasOpexCost: getVal('gasOpexCost') * 10000,
        fuelBoilerCapex: getVal('fuelBoilerCapex') * 10000, fuelSalvageRate: 0.05, fuelBoilerEfficiency: getVal('fuelBoilerEfficiency') / 100, fuelPrice: getVal('fuelPrice'), fuelOpexCost: getVal('fuelOpexCost') * 10000,
        coalBoilerCapex: getVal('coalBoilerCapex') * 10000, coalSalvageRate: 0.05, coalBoilerEfficiency: getVal('coalBoilerEfficiency') / 100, coalPrice: getVal('coalPrice'), coalOpexCost: getVal('coalOpexCost') * 10000,
        steamCapex: getVal('steamBoilerCapex') * 10000, steamSalvageRate: 0, steamEfficiency: 0.98, steamPrice: getVal('steamPrice'), steamOpexCost: getVal('steamOpexCost') * 10000,
        compare: { gas: document.getElementById('compare_gas').checked, coal: document.getElementById('compare_coal').checked, fuel: document.getElementById('compare_fuel').checked, electric: document.getElementById('compare_electric').checked, steam: document.getElementById('compare_steam').checked, biomass: document.getElementById('compare_biomass').checked },
        biomassBoilerCapex: getVal('biomassBoilerCapex') * 10000, biomassSalvageRate: 0, biomassBoilerEfficiency: getVal('biomassBoilerEfficiency')/100, biomassPrice: getVal('biomassPrice'), biomassOpexCost: getVal('biomassOpexCost') * 10000,
        electricBoilerCapex: getVal('electricBoilerCapex') * 10000, electricSalvageRate: 0.05, electricBoilerEfficiency: getVal('electricBoilerEfficiency')/100, electricOpexCost: getVal('electricOpexCost') * 10000, isGreenElectricity: isGreenPower
    };
}

// 核心功能：数据渲染
export function renderDashboard(results) {
    latestResults = results;
    Dashboard.showResultsContent(); Dashboard.scrollToResults(); Dashboard.setExportButtonState(true);
    const bestComp = results.comparisons.sort((a, b) => b.annualSaving - a.annualSaving)[0];
    
    // [FIXED] 响应式字号，防止Cutoff
    const kpiClass = "text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black text-gray-800 mt-2 md:mt-3 tracking-tighter truncate";

    if (bestComp) {
        Dashboard.updateResultCard('annual-saving', `${fWan(bestComp.annualSaving)} 万`, kpiClass);
        let irrText = '--'; 
        if (bestComp.irr === null || bestComp.irr === -Infinity || bestComp.irr < -1) { irrText = '无法回收'; } 
        else { irrText = fPercent(bestComp.irr); }
        Dashboard.updateResultCard('irr', irrText, kpiClass);
        Dashboard.updateResultCard('pbp', `${bestComp.dynamicPBP} 年`, kpiClass);
        Dashboard.updateResultCard('co2-reduction', `${fNum(bestComp.co2Reduction, 1)} 吨`, kpiClass);
    } else {
        Dashboard.updateResultCard('annual-saving', '--', kpiClass); Dashboard.updateResultCard('irr', '--', kpiClass);
    }
    
    setTimeout(() => {
        destroyCharts();
        const labels = ['热泵', ...results.comparisons.map(c => c.name)];
        const eCosts = [results.hp.annualEnergyCost/10000, ...results.comparisons.map(c => c.annualEnergyCost/10000)];
        const oCosts = [results.hp.annualOpex/10000, ...results.comparisons.map(c => c.annualOpex/10000)];
        const ctxCost = document.getElementById('costComparisonChart');
        if(ctxCost) createCostChart(ctxCost, labels, eCosts, oCosts);
        const ctxLcc = document.getElementById('lccBreakdownChart');
        if(ctxLcc) { const d = results.hp.lcc; createLccChart(ctxLcc, [d.capex/10000, d.energy/10000, d.opex/10000, d.residual/10000]); }
    }, 100);

    const dataTab = document.getElementById('tab-data-table');
    if (dataTab) {
        // [FIXED] 表格文字调整为小一点，适应手机
        dataTab.innerHTML = `
            <div class="overflow-x-auto pb-6">
                <table class="min-w-full text-sm md:text-lg text-left text-gray-700">
                    <thead class="text-xs md:text-base font-extrabold text-gray-900 uppercase bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap">方案名称</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">折算吨汽成本</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">综合节能率</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">年总成本(万)</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">年节省(万)</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">动态回收期</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">IRR</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right hidden lg:table-cell">LCC总值(万)</th>
                            <th class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right hidden lg:table-cell">碳减排(吨)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr class="bg-blue-50/50 border-b border-gray-100 font-bold text-gray-900">
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap">工业热泵 (本方案)</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-blue-800">${fYuan(results.hp.unitSteamCost, 1)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">${fWan(results.hp.annualTotalCost)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right hidden lg:table-cell">${fWan(results.hp.lcc.total)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${results.comparisons.map(c => `
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap font-bold text-gray-800">${c.name}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right font-medium">${fYuan(c.unitSteamCost, 1)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right font-bold text-green-600">${fPercent(c.savingRate)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right font-medium">${fWan(c.annualTotalCost)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right font-bold text-green-600">${fWan(c.annualSaving)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-center font-medium">${c.dynamicPBP} 年</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-center font-bold text-blue-600">${
                                c.irr === null || c.irr < -1 ? '<span class="text-gray-400">N/A</span>' : fPercent(c.irr)
                            }</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right font-medium hidden lg:table-cell">${fWan(c.lccTotal)}</td>
                            <td class="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-green-600 font-bold hidden lg:table-cell">${fNum(c.co2Reduction, 1)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="text-sm text-gray-400 mt-4 md:mt-6">* 注：LCC (全生命周期成本) 已包含资金时间价值，折现率 ${fPercent(results.inputs.discountRate)}。<br>* 折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。</p>
        `;
    }
    
    const conclusionTab = document.getElementById('tab-conclusion');
    if (conclusionTab && bestComp) {
        const isGood = bestComp.irr > 0.08;
        conclusionTab.innerHTML = `
            <div class="p-6 md:p-8 ${isGood ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'} rounded-2xl">
                <h3 class="text-xl md:text-3xl font-extrabold ${isGood ? 'text-green-800' : 'text-yellow-800'} mb-4">${isGood ? '🚀 推荐投资' : '⚖️ 投资回报一般'}</h3>
                <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                    相比于 <strong>${bestComp.name}</strong>，工业热泵方案预计每年可节省 <strong>${fWan(bestComp.annualSaving)} 万元</strong>，综合费用节能率达 <strong>${fPercent(bestComp.savingRate)}</strong>。
                    <br><br>
                    您的热泵供热成本相当于 <strong>${fYuan(results.hp.unitSteamCost, 1)} 元/吨蒸汽</strong>，而${bestComp.name}的成本为 <strong>${fYuan(bestComp.unitSteamCost, 1)} 元/吨</strong>。
                    <br><br>
                    全生命周期（${results.inputs.lccYears}年）累计节省 <strong>${fWan(bestComp.lccSaving)} 万元</strong>。动态回收期为 ${bestComp.dynamicPBP} 年。
                </p>
            </div>
            <div class="mt-8 pt-4 border-t border-gray-200 text-center text-gray-400 text-xs">
                <p class="font-bold">编者：荆炎荣 | AI 策划</p>
                <p class="mt-1">免责声明：本工具计算结果仅供参考，不作为最终投资决策依据。具体参数请咨询专业设计院。</p>
            </div>
        `;
    }
}

let currentEfficiencyTargetId = null;
function setupEfficiencyCalculator() {
    const modal = document.getElementById('eff-calc-modal');
    const closeBtn = document.getElementById('eff-calc-close-btn');
    const calcBtn = document.getElementById('ec-calc-btn');
    const applyBtn = document.getElementById('ec-apply-btn');
    const fuelUnitLabel = document.getElementById('ec-fuel-unit');
    if (!modal) return; 
    
    const autoFillDefaults = (type) => {
        const defaults = EFF_CALC_DEFAULTS[type];
        if(!defaults) return;
        if(type === 'water') {
            document.getElementById('ec-water-mass').value = defaults.mass;
            document.getElementById('ec-water-in-temp').value = defaults.tempIn;
            document.getElementById('ec-water-out-temp').value = defaults.tempOut;
        } else {
            document.getElementById('ec-steam-mass').value = defaults.mass;
            document.getElementById('ec-steam-pressure').value = defaults.pressure;
            document.getElementById('ec-steam-feed-temp').value = defaults.feedTemp;
        }
    };

    const outputRadios = document.querySelectorAll('input[name="ec-output-type"]');
    outputRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            const waterParams = document.getElementById('ec-water-params');
            const steamParams = document.getElementById('ec-steam-params');
            if (val === 'water') {
                waterParams.classList.remove('hidden');
                steamParams.classList.add('hidden');
            } else {
                waterParams.classList.add('hidden');
                steamParams.classList.remove('hidden');
            }
            autoFillDefaults(val);
        });
    });

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.eff-calc-btn');
        if (btn) {
            e.preventDefault();
            const targetId = btn.dataset.target;
            const fuelType = btn.dataset.fuel;
            currentEfficiencyTargetId = targetId;
            const select = document.getElementById('ec-fuel-type');
            if(select) { 
                select.value = fuelType; 
                fuelUnitLabel.textContent = (fuelType === 'gas') ? 'm³' : 'kg'; 
            }
            document.querySelector('input[name="ec-output-type"][value="water"]').click();
            modal.classList.remove('hidden');
        }
    });
    if(closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    
    if(calcBtn) calcBtn.addEventListener('click', () => {
        const fuelType = document.getElementById('ec-fuel-type').value;
        const fuelAmount = parseFloat(document.getElementById('ec-fuel-amount').value);
        let calorificValue = 0;
        
        if (fuelType === 'gas') calorificValue = parseFloat(document.getElementById('gasCalorific').value);
        else if (fuelType === 'fuel') calorificValue = parseFloat(document.getElementById('fuelCalorific').value);
        else if (fuelType === 'coal') calorificValue = parseFloat(document.getElementById('coalCalorific').value);
        else if (fuelType === 'biomass') calorificValue = parseFloat(document.getElementById('biomassCalorific').value);
        
        const outputType = document.querySelector('input[name="ec-output-type"]:checked').value;
        let params = {};
        
        if (outputType === 'water') {
            params = { mass: parseFloat(document.getElementById('ec-water-mass').value), tempIn: parseFloat(document.getElementById('ec-water-in-temp').value), tempOut: parseFloat(document.getElementById('ec-water-out-temp').value) };
        } else {
            params = { mass: parseFloat(document.getElementById('ec-steam-mass').value), pressure: parseFloat(document.getElementById('ec-steam-pressure').value), feedTemp: parseFloat(document.getElementById('ec-steam-feed-temp').value) };
        }
        
        const result = calculateBoilerEfficiency(fuelType, fuelAmount, calorificValue, outputType, params);
        const display = document.getElementById('ec-result-display');
        
        if (result.error) { 
            display.textContent = "Error"; 
            display.className = "text-3xl font-black text-red-500 tracking-tight"; 
            applyBtn.disabled = true; 
        } else { 
            display.textContent = result.efficiency.toFixed(1) + " %"; 
            display.className = "text-3xl font-black text-blue-600 tracking-tight"; 
            applyBtn.disabled = false; 
            applyBtn.dataset.value = result.efficiency.toFixed(1); 
        }
    });
    
    if(applyBtn) applyBtn.addEventListener('click', () => {
        if (currentEfficiencyTargetId && applyBtn.dataset.value) {
            const target = document.getElementById(currentEfficiencyTargetId);
            if (target) { target.value = applyBtn.dataset.value; modal.classList.add('hidden'); document.getElementById('calculateBtn')?.click(); }
        }
    });
}