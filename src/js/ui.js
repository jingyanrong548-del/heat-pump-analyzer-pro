// src/js/ui.js
// V18.5.1 Fix: Added missing renderDashboard export

import { ENERGY_DEFAULTS, EFF_CALC_DEFAULTS } from './config.js'; 
import { validateInput } from './ui-validator.js';
import { calculateBoilerEfficiency, fWan, fYuan, fInt, fNum, fTon, fCop, fPercent, fYears } from './utils.js';
import * as Dashboard from './ui-dashboard.js';
import { createCostChart, createLccChart, destroyCharts } from './ui-chart.js';

let latestResults = null;
const defAttr = (val) => `value="${val}" data-default="${val}"`;

// --- 1. HTML 生成器 ---

function generateProjectInputsHTML() {
    return `
        <div class="mb-6 md:mb-8">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">项目名称</label>
            <input type="text" id="projectName" ${defAttr("示例项目")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 track-change shadow-sm text-gray-600 transition-colors">
        </div>
        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-300">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">计算模式</label>
            <div class="grid grid-cols-3 gap-3 md:gap-6">
                <label class="cursor-pointer flex flex-col items-center p-3 md:p-6 border-2 md:border-4 border-gray-100 rounded-2xl md:rounded-3xl hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-600 transition-all">
                    <input type="radio" name="calcMode" value="annual" class="mb-2 md:mb-3 w-6 h-6 md:w-8 md:h-8 accent-blue-600" checked>
                    <span class="text-base md:text-2xl font-bold text-gray-800">模式A</span>
                    <span class="text-sm md:text-lg text-gray-500 mt-1 md:mt-2 font-bold">(年时)</span>
                </label>
                <label class="cursor-pointer flex flex-col items-center p-3 md:p-6 border-2 md:border-4 border-gray-100 rounded-2xl md:rounded-3xl hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-600 transition-all">
                    <input type="radio" name="calcMode" value="total" class="mb-2 md:mb-3 w-6 h-6 md:w-8 md:h-8 accent-blue-600">
                    <span class="text-base md:text-2xl font-bold text-gray-800">模式B</span>
                    <span class="text-sm md:text-lg text-gray-500 mt-1 md:mt-2 font-bold">(总量)</span>
                </label>
                <label class="cursor-pointer flex flex-col items-center p-3 md:p-6 border-2 md:border-4 border-gray-100 rounded-2xl md:rounded-3xl hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-600 transition-all">
                    <input type="radio" name="calcMode" value="daily" class="mb-2 md:mb-3 w-6 h-6 md:w-8 md:h-8 accent-blue-600">
                    <span class="text-base md:text-2xl font-bold text-gray-800">模式C</span>
                    <span class="text-sm md:text-lg text-gray-500 mt-1 md:mt-2 font-bold">(间歇)</span>
                </label>
            </div>
        </div>
        <div id="input-group-load" class="space-y-6 md:space-y-8 mt-6 md:mt-8">
            <div>
                <label class="flex justify-between items-center text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">
                    <span>制热负荷 (设计值)</span>
                    <select id="heatingLoadUnit" class="text-xl md:text-3xl font-extrabold border-none bg-transparent p-0 text-blue-600 focus:ring-0 cursor-pointer hover:text-blue-800"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </label>
                <input type="number" id="heatingLoad" ${defAttr("1000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-hours-a" class="space-y-6 md:space-y-8 mt-6 md:mt-8">
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">年运行小时 (h)</label>
                <input type="number" id="operatingHours" ${defAttr("2000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-total" class="space-y-6 md:space-y-8 mt-6 md:mt-8 hidden">
            <div>
                <label class="flex justify-between items-center text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">
                    <span>年总加热量</span>
                    <select id="annualHeatingUnit" class="text-xl md:text-3xl font-extrabold border-none bg-transparent p-0 text-blue-600 focus:ring-0 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </label>
                <input type="number" id="annualHeating" ${defAttr("2000000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" data-validation="isPositive">
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">年运行小时 (反推)</label>
                <input type="number" id="operatingHours_B" ${defAttr("2000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" placeholder="输入小时数">
            </div>
        </div>
        <div id="input-group-daily" class="space-y-6 md:space-y-8 mt-6 md:mt-8 hidden">
            <div class="grid grid-cols-2 gap-4 md:gap-8">
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">日运行 (h)</label>
                    <input type="number" id="dailyHours" ${defAttr("8")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">年天数 (d)</label>
                    <input type="number" id="annualDays" ${defAttr("300")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">平均负荷率 (%)</label>
                <input type="number" id="loadFactor" ${defAttr("70")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
        </div>
    `;
}

function generateSchemeInputsHTML() {
    return `
        <div class="hidden">
            <input type="radio" id="modeStandard" name="schemeAMode" value="standard" checked>
        </div>
        <div class="grid grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">热泵投资 (万)</label>
                <div class="relative">
                    <input type="number" id="hpCapex" ${defAttr(ENERGY_DEFAULTS.hp.capex || "200")} class="w-full pl-4 md:pl-6 pr-4 md:pr-10 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-shadow track-change shadow-sm text-gray-600" data-validation="isPositive">
                </div>
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">储能投资 (万)</label>
                <input type="number" id="storageCapex" ${defAttr("0")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
        </div>
        <div class="pt-6 md:pt-8 border-t-2 border-gray-200">
             <label class="block text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center">
                <span class="w-2 md:w-3 h-6 md:h-8 bg-blue-600 rounded-full mr-3 md:mr-4"></span>对比基准配置
             </label>
             <div class="space-y-4 md:space-y-6">
                ${[
                    {k:'gas', n:'天然气'}, {k:'coal', n:'燃煤'}, {k:'electric', n:'电锅炉'}, 
                    {k:'steam', n:'蒸汽'}, {k:'fuel', n:'燃油'}, {k:'biomass', n:'生物质'}
                ].map(item => {
                    const defCapex = ENERGY_DEFAULTS[item.k].capex;
                    return `
                    <div class="flex items-center justify-between group related-to-${item.k} transition-all duration-300 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-transparent hover:border-blue-100 hover:bg-blue-50/50">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${item.k}" data-target="${item.k}" class="comparison-toggle h-8 w-8 md:h-10 md:w-10 text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-500 track-change cursor-pointer accent-blue-600" checked>
                            <label for="compare_${item.k}" class="ml-3 md:ml-5 text-lg md:text-2xl text-gray-700 font-bold cursor-pointer select-none">${item.n}</label>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm md:text-xl text-gray-400 mr-2 md:mr-4 font-bold hidden md:inline">投资(万)</span>
                            <div class="relative w-28 md:w-44">
                                <input type="number" id="${item.k}BoilerCapex" ${defAttr(defCapex)} class="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl text-lg md:text-2xl text-right track-change focus:ring-2 focus:ring-blue-500 bg-white focus:bg-white transition-colors font-medium shadow-sm text-gray-600" placeholder="0">
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
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4 tooltip-container">
                工业热泵 SPF (能效)
                <span class="tooltip-text text-sm md:text-lg p-2 md:p-4">全年综合性能系数</span>
            </label>
            <input type="number" id="hpCop" ${defAttr(ENERGY_DEFAULTS.hp.cop)} step="0.1" class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-blue-300 bg-blue-50 rounded-xl md:rounded-2xl text-3xl md:text-4xl font-bold text-blue-800 track-change shadow-sm" data-validation="isStrictlyPositive">
        </div>

        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-200 space-y-6 md:space-y-8">
             <div>
                <div class="flex justify-between items-center mb-2 md:mb-4">
                    <label class="block text-lg md:text-2xl font-bold text-gray-700">电价配置 (元/kWh)</label>
                    <button type="button" id="addPriceTierBtn" class="text-sm md:text-lg text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-3 md:px-5 py-2 rounded-lg md:rounded-xl border-2 border-blue-100">+ 添加时段</button>
                </div>
                <div id="priceTiersContainer" class="space-y-2 md:space-y-4 mb-2 md:mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${ENERGY_DEFAULTS.electric.price}" class="track-change"> 
                
                <label class="flex items-center mt-4 cursor-pointer p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition">
                    <input type="checkbox" id="greenPowerToggle" class="h-6 w-6 text-green-600 rounded focus:ring-green-500 track-change">
                    <span class="ml-3 text-lg font-bold text-green-800">使用绿电 (零碳排放)</span>
                </label>
             </div>

             <div class="grid grid-cols-2 gap-4 md:gap-8">
                 <div class="related-to-gas">
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">气价 (元/m³)</label>
                    <input type="number" id="gasPrice" ${defAttr(ENERGY_DEFAULTS.gas.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
                <div class="related-to-coal"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">煤价 (元/t)</label><input type="number" id="coalPrice" ${defAttr(ENERGY_DEFAULTS.coal.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
                <div class="related-to-steam"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">汽价 (元/t)</label><input type="number" id="steamPrice" ${defAttr(ENERGY_DEFAULTS.steam.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
                <div class="related-to-fuel"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">油价 (元/t)</label><input type="number" id="fuelPrice" ${defAttr(ENERGY_DEFAULTS.fuel.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
                <div class="related-to-biomass"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">生物质 (元/t)</label><input type="number" id="biomassPrice" ${defAttr(ENERGY_DEFAULTS.biomass.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
             </div>
        </div>

        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-200">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">锅炉效率 (%)</label>
            <div class="space-y-4 md:space-y-6">
                ${[
                    {id:'gas', label:'气', val:ENERGY_DEFAULTS.gas.boilerEff}, {id:'coal', label:'煤', val:ENERGY_DEFAULTS.coal.boilerEff}, 
                    {id:'fuel', label:'油', val:ENERGY_DEFAULTS.fuel.boilerEff}, {id:'biomass', label:'生物', val:ENERGY_DEFAULTS.biomass.boilerEff}
                ].map(item => `
                    <div class="flex items-center justify-between related-to-${item.id}">
                        <span class="text-lg md:text-2xl font-bold text-gray-600 w-12 md:w-20">${item.label}</span>
                        <div class="flex-1 flex items-center space-x-2 md:space-x-4">
                            <input type="number" id="${item.id}BoilerEfficiency" ${defAttr(item.val)} class="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl text-lg md:text-2xl track-change shadow-sm text-gray-600">
                            <button type="button" class="eff-calc-btn text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg border-2 border-blue-200 font-bold transition-colors" data-target="${item.id}BoilerEfficiency" data-fuel="${item.id}">反推</button>
                        </div>
                    </div>
                `).join('')}
                <div class="hidden">
                    <input type="number" id="electricBoilerEfficiency" value="98">
                    <input type="number" id="steamEfficiency" value="98">
                </div>
            </div>
        </div>

        <div class="mt-6 md:mt-8 pt-6 border-t-2 border-dashed border-gray-200">
            <details class="group">
                <summary class="flex justify-between items-center font-bold cursor-pointer list-none text-gray-500 hover:text-blue-600 transition-colors">
                    <span class="text-lg md:text-2xl">⚙️ 高级能源参数 (热值 & 排放)</span>
                    <span class="transition group-open:rotate-180">
                        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                </summary>
                <div class="text-gray-500 mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fadeIn">
                    <div class="bg-gray-50 p-4 rounded-xl space-y-4">
                        <h4 class="font-bold text-gray-700 text-lg">电 (Electric)</h4>
                        <div class="flex justify-between items-center"><label>排放因子</label><input id="gridFactor" type="number" ${defAttr(ENERGY_DEFAULTS.electric.factor)} class="w-24 p-2 border rounded text-right track-change text-gray-600"><span class="ml-2 text-sm">kgCO₂/kWh</span></div>
                    </div>
                    ${['gas|气|m³', 'coal|煤|kg', 'fuel|油|kg', 'biomass|生物|kg', 'steam|蒸汽|kg'].map(item => {
                        const [k, n, u] = item.split('|');
                        return `
                        <div class="bg-gray-50 p-4 rounded-xl space-y-3 related-to-${k}">
                            <h4 class="font-bold text-gray-700 text-lg">${n} (${k})</h4>
                            <div class="flex justify-between items-center">
                                <label class="w-16">热值</label>
                                <div class="flex flex-1 items-center gap-2">
                                    <input id="${k}Calorific" type="number" ${defAttr(ENERGY_DEFAULTS[k].calorific)} class="w-20 p-2 border rounded text-right track-change text-gray-600">
                                    <select id="${k}CalorificUnit" class="p-2 border rounded bg-white text-sm w-20 track-change">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                        <option value="kJ">kJ</option>
                                    </select>
                                    <span class="text-sm">/${u}</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <label class="w-16">排放</label>
                                <div class="flex flex-1 items-center gap-2">
                                    <input id="${k}Factor" type="number" ${defAttr(ENERGY_DEFAULTS[k].factor)} class="w-20 p-2 border rounded text-right track-change text-gray-600">
                                    <span class="text-sm">kgCO₂/${u}</span>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </details>
        </div>

        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-200">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">运维成本 (万/年)</label>
            <div class="space-y-4 md:space-y-6">
                <div class="flex items-center justify-between">
                    <span class="text-lg md:text-2xl font-bold text-blue-600 w-24 md:w-32">工业热泵</span>
                    <input type="number" id="hpOpexCost" ${defAttr(ENERGY_DEFAULTS.hp.opex)} class="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-blue-200 bg-blue-50 rounded-xl md:rounded-2xl text-lg md:text-2xl track-change shadow-sm font-bold text-blue-800">
                </div>
                ${[
                    {id:'gas', label:'天然气', val:ENERGY_DEFAULTS.gas.opex}, {id:'coal', label:'燃煤', val:ENERGY_DEFAULTS.coal.opex},
                    {id:'electric', label:'电锅炉', val:ENERGY_DEFAULTS.electric.opex}, {id:'steam', label:'蒸汽', val:ENERGY_DEFAULTS.steam.opex},
                    {id:'fuel', label:'燃油', val:ENERGY_DEFAULTS.fuel.opex}, {id:'biomass', label:'生物质', val:ENERGY_DEFAULTS.biomass.opex}
                ].map(item => `
                    <div class="flex items-center justify-between related-to-${item.id}">
                        <span class="text-lg md:text-2xl font-bold text-gray-600 w-24 md:w-32">${item.label}</span>
                        <input type="number" id="${item.id}OpexCost" ${defAttr(item.val)} class="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl text-lg md:text-2xl track-change shadow-sm text-gray-600">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateFinancialInputsHTML() {
    return `
        <div class="space-y-6 md:space-y-8">
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">分析年限 (年)</label>
                <input type="number" id="lccYears" ${defAttr("15")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">折现率 (%)</label>
                <input type="number" id="discountRate" ${defAttr("8")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
            <div class="grid grid-cols-2 gap-4 md:gap-8">
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">能源涨幅(%)</label>
                    <input type="number" id="energyInflationRate" ${defAttr("3")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">运维涨幅(%)</label>
                    <input type="number" id="opexInflationRate" ${defAttr("5")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
            </div>
        </div>
    `;
}

// --- 初始化与逻辑 ---

export function initializeUI(handleCalculate) {
    injectAccordionContent('accordion-project', '1. 项目与负荷', generateProjectInputsHTML());
    injectAccordionContent('accordion-scheme', '2. 方案与投资', generateSchemeInputsHTML());
    injectAccordionContent('accordion-operating', '3. 运行参数', generateOperatingInputsHTML());
    injectAccordionContent('accordion-financial', '4. 财务模型', generateFinancialInputsHTML());

    Dashboard.initializeDashboard();
    setupInputMonitoring(); 

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
    
    // 监听启用对比开关
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

function setupInputMonitoring() {
    document.querySelectorAll('input[data-default], select[data-default]').forEach(el => {
        el.addEventListener('input', () => {
            if(el.type === 'checkbox') return;
            const isModified = el.value != el.dataset.default;
            if(isModified) {
                el.classList.add('text-blue-600', 'font-bold');
                el.classList.remove('text-gray-600');
            } else {
                el.classList.remove('text-blue-600', 'font-bold');
                el.classList.add('text-gray-600');
            }
        });
    });
}

function addNewPriceTier(name = "", price = "", dist = "") {
    const container = document.getElementById('priceTiersContainer');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'price-tier-entry flex gap-2 md:gap-4 items-center mb-2 md:mb-4';
    div.innerHTML = `
        <input type="text" class="tier-name w-1/3 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl text-lg md:text-xl" placeholder="时段名" value="${name}">
        <input type="number" class="tier-price w-1/4 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl text-lg md:text-xl" placeholder="价格" value="${price}">
        <span class="text-gray-400 text-lg md:text-xl font-bold">@</span>
        <input type="number" class="tier-dist w-1/4 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl text-lg md:text-xl" placeholder="比例%" value="${dist}">
        <button type="button" class="text-red-500 hover:text-red-700 px-2 md:px-4 text-2xl md:text-3xl font-bold remove-tier-btn">×</button>
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
        <button class="accordion-header flex justify-between items-center w-full px-4 md:px-8 py-4 md:py-6 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200 cursor-pointer" type="button" aria-expanded="true" aria-controls="${containerId}-content">
            <span class="text-xl md:text-3xl font-extrabold text-gray-900">${title}</span>
            <svg class="accordion-icon w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div id="${containerId}-content" class="accordion-content open px-4 md:px-8 py-4 md:py-8 border-t-2 border-gray-100">
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

function buildPrintReport(results) {
    const container = document.getElementById('print-report-container');
    if (!container) return;
    const dateStr = new Date().toLocaleString('zh-CN');
    const bestComp = results.comparisons.sort((a, b) => b.annualSaving - a.annualSaving)[0];
    let costChartImg = '', lccChartImg = '';
    const chart1 = document.getElementById('costComparisonChart');
    const chart2 = document.getElementById('lccBreakdownChart');
    if(chart1) costChartImg = chart1.toDataURL();
    if(chart2) lccChartImg = chart2.toDataURL();
    let irrDisplay = '--';
    if(bestComp) { irrDisplay = (bestComp.irr === null || bestComp.irr === -Infinity || bestComp.irr < -1) ? '无法回收' : fPercent(bestComp.irr); }

    const html = `
        <div class="print-header text-center mb-8 border-b pb-4">
            <h1 class="text-3xl font-bold mb-2">工业热泵经济与环境效益分析报告</h1>
            <p class="text-sm text-gray-500">项目：${results.inputs.projectName} | 生成日期: ${dateStr}</p>
        </div>
        <div class="print-section mb-8">
            <h3 class="text-xl font-bold border-l-4 border-black pl-3 mb-4 bg-gray-100 py-1">1. 分析结论摘要</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="border p-4 rounded"><p class="text-gray-500">年节省金额</p><p class="text-2xl font-bold">${bestComp ? fWan(bestComp.annualSaving) : '-'} 万</p></div>
                <div class="border p-4 rounded"><p class="text-gray-500">内部收益率 (IRR)</p><p class="text-2xl font-bold">${irrDisplay}</p></div>
                <div class="border p-4 rounded"><p class="text-gray-500">动态回收期</p><p class="text-2xl font-bold">${bestComp ? bestComp.dynamicPBP : '-'} 年</p></div>
                <div class="border p-4 rounded"><p class="text-gray-500">年碳减排</p><p class="text-2xl font-bold">${bestComp ? fNum(bestComp.co2Reduction, 1) : '-'} 吨</p></div>
            </div>
        </div>
        <div class="print-section mb-8">
            <h3 class="text-xl font-bold border-l-4 border-black pl-3 mb-4 bg-gray-100 py-1">2. 核心图表分析</h3>
            <div class="flex justify-between items-start gap-4">
                <div style="width: 48%; border:1px solid #eee; padding:10px;"><h4 class="text-center font-bold mb-2">年度成本对比</h4><img src="${costChartImg}" style="width:100%;"></div>
                <div style="width: 48%; border:1px solid #eee; padding:10px;"><h4 class="text-center font-bold mb-2">LCC 成本构成</h4><img src="${lccChartImg}" style="width:100%;"></div>
            </div>
        </div>
        <div class="print-section">
            <h3 class="text-xl font-bold border-l-4 border-black pl-3 mb-4 bg-gray-100 py-1">3. 详细数据对比表</h3>
            <table class="print-table w-full text-xs border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="border p-2">方案名称</th><th class="border p-2">折算吨汽成本</th><th class="border p-2">节能率</th><th class="border p-2">投资(万)</th><th class="border p-2">年总成本</th><th class="border p-2">年节省</th><th class="border p-2">回收期(年)</th><th class="border p-2">IRR</th><th class="border p-2">LCC总值</th><th class="border p-2">减排(t)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border p-2 font-bold">工业热泵</td><td class="border p-2">${fYuan(results.hp.unitSteamCost, 1)}</td><td class="border p-2">-</td><td class="border p-2">${fWan(results.hp.initialInvestment)}</td><td class="border p-2">${fWan(results.hp.annualTotalCost)}</td><td class="border p-2">-</td><td class="border p-2">-</td><td class="border p-2">-</td><td class="border p-2">${fWan(results.hp.lcc.total)}</td><td class="border p-2">-</td>
                    </tr>
                    ${results.comparisons.map(c => `<tr><td class="border p-2">${c.name}</td><td class="border p-2">${fYuan(c.unitSteamCost, 1)}</td><td class="border p-2 font-bold">${fPercent(c.savingRate)}</td><td class="border p-2">${fWan(c.initialInvestment)}</td><td class="border p-2">${fWan(c.annualTotalCost)}</td><td class="border p-2 font-bold">${fWan(c.annualSaving)}</td><td class="border p-2">${c.dynamicPBP}</td><td class="border p-2">${c.irr === null || c.irr < -1 ? 'N/A' : fPercent(c.irr)}</td><td class="border p-2">${fWan(c.lccTotal)}</td><td class="border p-2">${fNum(c.co2Reduction, 1)}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-8 text-xs text-gray-400 text-center border-t pt-2">Powered by Phoenix Plan V18.5</div>
    `;
    container.innerHTML = html;
}

// 恢复 readAllInputs (V18.5 包含绿电与单位读取)
export function readAllInputs(showErrorCallback) {
    const getVal = (id) => { const el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : 0; };
    const getValByUnit = (id, unitId) => {
        let val = getVal(id);
        const unitEl = document.getElementById(unitId);
        if (unitEl && val > 0) {
            return { value: val, unit: unitEl.value };
        }
        return { value: val, unit: 'MJ' }; // 默认
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
        steamCapex: getVal('steamCapex') * 10000, steamSalvageRate: 0, steamEfficiency: 0.98, steamPrice: getVal('steamPrice'), steamOpexCost: getVal('steamOpexCost') * 10000,
        compare: { gas: document.getElementById('compare_gas').checked, coal: document.getElementById('compare_coal').checked, fuel: document.getElementById('compare_fuel').checked, electric: document.getElementById('compare_electric').checked, steam: document.getElementById('compare_steam').checked, biomass: document.getElementById('compare_biomass').checked },
        biomassBoilerCapex: getVal('biomassBoilerCapex') * 10000, biomassSalvageRate: 0, biomassBoilerEfficiency: getVal('biomassBoilerEfficiency')/100, biomassPrice: getVal('biomassPrice'), biomassOpexCost: getVal('biomassOpexCost') * 10000,
        electricBoilerCapex: getVal('electricBoilerCapex') * 10000, electricSalvageRate: 0.05, electricBoilerEfficiency: getVal('electricBoilerEfficiency')/100, electricOpexCost: getVal('electricOpexCost') * 10000, isGreenElectricity: isGreenPower
    };
}

// 恢复 renderDashboard (V18.3+ 样式)
export function renderDashboard(results) {
    latestResults = results;
    Dashboard.showResultsContent(); Dashboard.scrollToResults(); Dashboard.setExportButtonState(true);
    const bestComp = results.comparisons.sort((a, b) => b.annualSaving - a.annualSaving)[0];
    
    if (bestComp) {
        Dashboard.updateResultCard('annual-saving', `${fWan(bestComp.annualSaving)} 万`);
        let irrText = '--'; let irrClass = 'text-gray-500';
        if (bestComp.irr === null || bestComp.irr === -Infinity || bestComp.irr < -1) { irrText = '无法回收'; irrClass = 'text-gray-500'; } 
        else { irrText = fPercent(bestComp.irr); irrClass = bestComp.irr > 0.08 ? 'text-green-600' : (bestComp.irr > 0 ? 'text-yellow-600' : 'text-gray-500'); }
        Dashboard.updateResultCard('irr', irrText, irrClass);
        Dashboard.updateResultCard('pbp', `${bestComp.dynamicPBP} 年`);
        Dashboard.updateResultCard('co2-reduction', `${fNum(bestComp.co2Reduction, 1)} 吨`);
    } else {
        Dashboard.updateResultCard('annual-saving', '--'); Dashboard.updateResultCard('irr', '--');
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
        dataTab.innerHTML = `
            <div class="overflow-x-auto pb-6">
                <table class="min-w-full text-base md:text-xl text-left text-gray-700">
                    <thead class="text-sm md:text-lg font-extrabold text-gray-900 uppercase bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap">方案名称</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">折算吨汽成本(元)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">综合节能率</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">年总成本(万)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">年节省(万)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">动态回收期</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">IRR</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">LCC总值(万)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">碳减排(吨)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-2 divide-gray-100">
                        <tr class="bg-blue-50/50 border-b-2 border-gray-200 font-bold text-gray-900">
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap">工业热泵 (本方案)</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right text-blue-800">${fYuan(results.hp.unitSteamCost, 1)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">${fWan(results.hp.annualTotalCost)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">${fWan(results.hp.lcc.total)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${results.comparisons.map(c => `
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap font-bold text-gray-800">${c.name}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-medium">${fYuan(c.unitSteamCost, 1)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-bold text-green-600">${fPercent(c.savingRate)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-medium">${fWan(c.annualTotalCost)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-bold text-green-600">${fWan(c.annualSaving)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center font-medium">${c.dynamicPBP} 年</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center font-bold text-blue-600">${
                                c.irr === null || c.irr < -1 ? '<span class="text-gray-400">N/A</span>' : fPercent(c.irr)
                            }</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-medium hidden lg:table-cell">${fWan(c.lccTotal)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right text-green-600 font-bold hidden lg:table-cell">${fNum(c.co2Reduction, 1)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="text-sm md:text-lg text-gray-400 mt-4 md:mt-6">* 注：LCC (全生命周期成本) 已包含资金时间价值，折现率 ${fPercent(results.inputs.discountRate)}。<br>* 折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。</p>
        `;
    }
    
    const conclusionTab = document.getElementById('tab-conclusion');
    if (conclusionTab && bestComp) {
        const isGood = bestComp.irr > 0.08;
        conclusionTab.innerHTML = `
            <div class="p-6 md:p-10 ${isGood ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'} border rounded-2xl md:rounded-3xl">
                <h3 class="text-2xl md:text-4xl font-extrabold ${isGood ? 'text-green-800' : 'text-yellow-800'} mb-4 md:mb-6">${isGood ? '🚀 推荐投资' : '⚖️ 投资回报一般'}</h3>
                <p class="text-lg md:text-2xl text-gray-700 leading-relaxed font-medium">
                    相比于 <strong>${bestComp.name}</strong>，工业热泵方案预计每年可节省 <strong>${fWan(bestComp.annualSaving)} 万元</strong>，综合费用节能率达 <strong>${fPercent(bestComp.savingRate)}</strong>。
                    <br><br>
                    您的热泵供热成本相当于 <strong>${fYuan(results.hp.unitSteamCost, 1)} 元/吨蒸汽</strong>，而${bestComp.name}的成本为 <strong>${fYuan(bestComp.unitSteamCost, 1)} 元/吨</strong>。
                    <br><br>
                    全生命周期（${results.inputs.lccYears}年）累计节省 <strong>${fWan(bestComp.lccSaving)} 万元</strong>。动态回收期为 ${bestComp.dynamicPBP} 年。
                </p>
            </div>`;
    }
}

// 恢复 setupEfficiencyCalculator
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