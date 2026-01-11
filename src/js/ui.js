// src/js/ui.js
// V9.0.0: Internationalization Support

import { ENERGY_DEFAULTS, EFF_CALC_DEFAULTS } from './config.js'; 
import { validateInput } from './ui-validator.js';
import { calculateBoilerEfficiency, fWan, fYuan, fInt, fNum, fTon, fCop, fPercent, fYears } from './utils.js';
import * as Dashboard from './ui-dashboard.js';
import { createCostChart, createLccChart, destroyCharts } from './ui-chart.js';
import { t, getCurrentLanguage } from './i18n.js';

let latestResults = null;
let savedScenarios = []; 
let deletedScenariosBackup = [];

const defAttr = (val) => `value="${val}" data-default="${val}"`;
const LOCAL_CONVERTERS = { 'MJ': 1, 'kJ': 0.001, 'kcal': 0.004186, 'kWh': 3.6 };

// --- 样式常量 - Apple 风格 ---
const INPUT_STYLE = "w-full px-4 md:px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-base md:text-lg font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder-gray-400 h-11 md:h-12 shadow-apple-sm";
const LABEL_STYLE = "block text-sm font-medium text-gray-700 mb-2 md:mb-3 tracking-wide";
const GROUP_STYLE = "bg-white p-1 mb-4 md:mb-6";

// ==========================================
// 1. HTML 生成器 (保持 V19 系列一致)
// ==========================================

function generateProjectInputsHTML() {
    return `
        <div class="${GROUP_STYLE}">
            <label class="${LABEL_STYLE}">${t('project.name')}</label>
            <input type="text" id="projectName" ${defAttr(t('project.namePlaceholder'))} class="${INPUT_STYLE}">
        </div>
        <div class="pt-4 md:pt-6 border-t border-gray-200">
            <label class="${LABEL_STYLE} mb-3 md:mb-4">${t('project.loadMode')}</label>
            <div class="grid grid-cols-3 gap-2 md:gap-3">
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="annual" class="peer sr-only" checked>
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-apple-sm">
                        <span class="text-sm md:text-base font-medium text-gray-800 peer-checked:text-blue-600">${t('project.modeA')}</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">${t('project.annualMethod')}</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="total" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-apple-sm">
                        <span class="text-sm md:text-base font-medium text-gray-800 peer-checked:text-blue-600">${t('project.modeB')}</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">${t('project.totalMethod')}</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="daily" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-apple-sm">
                        <span class="text-sm md:text-base font-medium text-gray-800 peer-checked:text-blue-600">${t('project.modeC')}</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">${t('project.intermittentMethod')}</span>
                    </div>
                </label>
            </div>
        </div>
        <div id="input-group-load" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${LABEL_STYLE} !mb-0">${t('project.heatingLoad')}</label>
                    <select id="heatingLoadUnit" class="text-xs md:text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-100 transition"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </div>
                <input type="number" id="heatingLoad" ${defAttr("1000")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-hours-a" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <label class="${LABEL_STYLE}">${t('project.operatingHours')}</label>
                <input type="number" id="operatingHours" ${defAttr("2000")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-total" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${LABEL_STYLE} !mb-0">${t('project.annualHeating')}</label>
                    <select id="annualHeatingUnit" class="text-xs md:text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-2 py-1 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </div>
                <input type="number" id="annualHeating" ${defAttr("2000000")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
            <div>
                <label class="${LABEL_STYLE}">${t('project.operatingHoursReverse')}</label>
                <input type="number" id="operatingHours_B" ${defAttr("2000")} class="${INPUT_STYLE}" placeholder="自动计算">
            </div>
        </div>
        <div id="input-group-daily" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${LABEL_STYLE}">${t('project.dailyHours')}</label>
                    <input type="number" id="dailyHours" ${defAttr("8")} class="${INPUT_STYLE}">
                </div>
                <div>
                    <label class="${LABEL_STYLE}">${t('project.annualDays')}</label>
                    <input type="number" id="annualDays" ${defAttr("300")} class="${INPUT_STYLE}">
                </div>
            </div>
            <div>
                <label class="${LABEL_STYLE}">${t('project.loadFactor')}</label>
                <input type="number" id="loadFactor" ${defAttr("70")} class="${INPUT_STYLE}">
            </div>
        </div>
    `;
}

function generateSchemeInputsHTML() {
    return `
        <div class="mb-6">
            <label class="${LABEL_STYLE} mb-3">${t('scheme.systemMode')}</label>
            <div class="flex bg-gray-100 p-1 rounded-xl">
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="systemMode" value="pure" class="peer sr-only" checked>
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-blue-500 peer-checked:shadow-apple-sm transition-all">${t('scheme.pureHP')}</span>
                </label>
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="systemMode" value="hybrid" class="peer sr-only">
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-blue-500 peer-checked:shadow-apple-sm transition-all">${t('scheme.hybrid')}</span>
                </label>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <div>
                <label class="${LABEL_STYLE}">${t('scheme.hpInvestment')}</label>
                <input type="number" id="hpCapex" ${defAttr(ENERGY_DEFAULTS.hp.capex || "200")} class="${INPUT_STYLE}" data-validation="isPositive">
            </div>
            <div>
                <label class="${LABEL_STYLE}">${t('scheme.storageInvestment')}</label>
                <input type="number" id="storageCapex" ${defAttr("0")} class="${INPUT_STYLE}">
            </div>
        </div>
        <div id="hybrid-params" class="hidden mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl animate-fadeIn">
             <h4 class="text-sm font-semibold text-orange-800 mb-4 flex items-center"><span class="mr-2">🔥</span>${t('scheme.hybridConfig')}</h4>
             <div class="space-y-4">
                 <div>
                    <label class="${LABEL_STYLE} text-orange-900">${t('scheme.auxHeaterType')}</label>
                    <select id="hybridAuxHeaterType" class="w-full px-3 py-2 border border-orange-200 rounded-xl text-base font-medium text-orange-900 focus:ring-2 focus:ring-orange-500 bg-white">
                        <option value="electric">${t('operating.electricAux')}</option>
                        <option value="gas">${t('operating.gasBoiler')}</option>
                        <option value="coal">${t('operating.coalBoiler')}</option>
                        <option value="fuel">${t('operating.fuelBoiler')}</option>
                        <option value="biomass">${t('operating.biomassBoiler')}</option>
                        <option value="steam">${t('operating.steamNetwork')}</option>
                    </select>
                 </div>
                 <div>
                    <label class="${LABEL_STYLE} flex justify-between text-orange-900">
                        <span>${t('scheme.hpLoadShare')}</span>
                        <span class="text-xs text-orange-600 font-normal">${t('scheme.auxLoadNote')}</span>
                    </label>
                    <input type="number" id="hybridLoadShare" ${defAttr("50")} class="${INPUT_STYLE} border-orange-200 focus:border-orange-500 text-orange-900">
                 </div>
                 <div class="grid grid-cols-2 gap-3">
                     <div>
                        <label class="${LABEL_STYLE} text-orange-900">${t('scheme.auxHeaterInvestment')}</label>
                        <input type="number" id="hybridAuxHeaterCapex" ${defAttr("30")} class="${INPUT_STYLE} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                     <div>
                        <label class="${LABEL_STYLE} text-orange-900">${t('scheme.auxHeaterOpex')}</label>
                        <input type="number" id="hybridAuxHeaterOpex" ${defAttr("0.5")} class="${INPUT_STYLE} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                 </div>
             </div>
        </div>
        <div class="pt-4 md:pt-6 border-t border-gray-200">
             <label class="block text-base font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                <span class="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>${t('scheme.comparisonConfig')}
             </label>
             <div class="space-y-2 md:space-y-3">
                ${[
                    {k:'gas', key:'gas'}, {k:'coal', key:'coal'}, {k:'electric', key:'electric'}, 
                    {k:'steam', key:'steam'}, {k:'fuel', key:'fuel'}, {k:'biomass', key:'biomass'}
                ].map(item => {
                    const defCapex = ENERGY_DEFAULTS[item.k].capex;
                    return `
                    <div class="flex items-center justify-between group related-to-${item.k} transition-all duration-200 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${item.k}" data-target="${item.k}" class="comparison-toggle w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" checked>
                            <label for="compare_${item.k}" class="ml-3 text-sm md:text-base font-medium text-gray-700 cursor-pointer select-none">${t(`scheme.${item.key}`)}</label>
                        </div>
                        <div class="flex items-center gap-2 md:gap-3">
                            <span class="text-xs text-gray-400 font-bold hidden md:inline">${t('scheme.investment')}</span>
                            <div class="relative w-20 md:w-24">
                                <input type="number" id="${item.k}BoilerCapex" ${defAttr(defCapex)} class="w-full px-2 py-1.5 border border-gray-200 rounded-xl text-sm md:text-base font-medium text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all text-gray-700" placeholder="0">
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
                <span>${t('operating.hpSPF')}</span>
                <span class="text-blue-500 text-[10px] md:text-xs font-medium bg-blue-100 px-2 py-0.5 rounded-lg">${t('operating.keyIndicator')}</span>
            </label>
            <input type="number" id="hpCop" ${defAttr(ENERGY_DEFAULTS.hp.cop)} step="0.1" class="${INPUT_STYLE} !text-xl md:!text-2xl !text-blue-600" data-validation="isStrictlyPositive">
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200 space-y-4 md:space-y-6">
             <div>
                <div class="flex justify-between items-center mb-2 md:mb-4">
                    <label class="${LABEL_STYLE} !mb-0">${t('operating.priceConfig')}</label>
                    <button type="button" id="addPriceTierBtn" class="text-[10px] md:text-xs font-medium text-blue-500 bg-white border border-blue-200 hover:bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg transition">+ ${t('button.add')}</button>
                </div>
                <div id="priceTiersContainer" class="space-y-2 md:space-y-3 mb-2 md:mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${ENERGY_DEFAULTS.electric.price}" class="track-change"> 
                <label class="flex items-center cursor-pointer p-2 md:p-3 bg-green-50/50 border border-green-200 rounded-xl hover:border-green-300 transition">
                    <input type="checkbox" id="greenPowerToggle" class="w-4 h-4 md:w-5 md:h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 track-change">
                    <span class="ml-2 md:ml-3 text-sm md:text-base font-medium text-green-800">${t('operating.greenPower')}</span>
                </label>
             </div>
             <div class="grid grid-cols-2 gap-3 md:gap-4">
                 <div class="related-to-gas"><label class="${LABEL_STYLE}">${t('operating.gasPrice')}</label><input type="number" id="gasPrice" ${defAttr(ENERGY_DEFAULTS.gas.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-coal"><label class="${LABEL_STYLE}">${t('operating.coalPrice')}</label><input type="number" id="coalPrice" ${defAttr(ENERGY_DEFAULTS.coal.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-steam"><label class="${LABEL_STYLE}">${t('operating.steamPrice')}</label><input type="number" id="steamPrice" ${defAttr(ENERGY_DEFAULTS.steam.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-fuel"><label class="${LABEL_STYLE}">${t('operating.fuelPrice')}</label><input type="number" id="fuelPrice" ${defAttr(ENERGY_DEFAULTS.fuel.price)} class="${INPUT_STYLE}"></div>
                 <div class="related-to-biomass"><label class="${LABEL_STYLE}">${t('operating.biomassPrice')}</label><input type="number" id="biomassPrice" ${defAttr(ENERGY_DEFAULTS.biomass.price)} class="${INPUT_STYLE}"></div>
             </div>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${LABEL_STYLE} mb-2 md:mb-4">${t('operating.boilerEfficiency')}</label>
            <div class="space-y-2 md:space-y-3">
                ${[
                    {id:'gas', key:'gas'}, 
                    {id:'coal', key:'coal'}, 
                    {id:'electric', key:'electric'}, 
                    {id:'steam', key:'pipeSteam'}, 
                    {id:'fuel', key:'fuel'}, 
                    {id:'biomass', key:'biomass'}
                ].map(item => {
                    const labelMap = {
                        gas: t('scheme.gas'),
                        coal: t('scheme.coal'),
                        electric: t('scheme.electric'),
                        pipeSteam: t('operating.pipeSteam'),
                        fuel: t('scheme.fuel'),
                        biomass: t('scheme.biomass')
                    };
                    const valMap = {
                        gas: ENERGY_DEFAULTS.gas.boilerEff,
                        coal: ENERGY_DEFAULTS.coal.boilerEff,
                        electric: ENERGY_DEFAULTS.electric.boilerEff,
                        pipeSteam: ENERGY_DEFAULTS.steam.boilerEff,
                        fuel: ENERGY_DEFAULTS.fuel.boilerEff,
                        biomass: ENERGY_DEFAULTS.biomass.boilerEff
                    };
                    const hasBtnMap = {
                        gas: true,
                        coal: true,
                        electric: false,
                        pipeSteam: false,
                        fuel: true,
                        biomass: true
                    };
                    const val = valMap[item.key] || valMap[item.id];
                    const hasBtn = hasBtnMap[item.key] !== undefined ? hasBtnMap[item.key] : hasBtnMap[item.id];
                    const label = labelMap[item.key] || labelMap[item.id];
                    return `
                    <div class="flex items-center gap-2 related-to-${item.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-16 md:w-24 shrink-0 text-right pr-2">${label}</span>
                        <div class="flex-1 flex items-center gap-2 min-w-0">
                            <input type="number" id="${item.id}BoilerEfficiency" ${defAttr(val)} class="flex-1 px-2 md:px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-base md:text-lg font-medium text-gray-800 focus:bg-white focus:border-blue-500 transition-all text-center h-9 md:h-10 min-w-0">
                            ${hasBtn ? `<button type="button" class="eff-calc-btn shrink-0 text-blue-500 bg-blue-50 hover:bg-blue-100 text-[10px] md:text-xs font-medium px-2 md:px-3 py-2 rounded-lg border border-blue-100 transition-colors whitespace-nowrap" data-target="${item.id}BoilerEfficiency" data-fuel="${item.id}">${t('operating.reverseCalc')}</button>` : ''}
                        </div>
                    </div>
                `;
                }).join('')}
            </div>
        </div>
        <div class="mt-4 md:mt-6 pt-4 border-t border-dashed border-gray-200">
            <details class="group">
                <summary class="flex justify-between items-center font-medium cursor-pointer list-none text-gray-600 hover:text-blue-500 transition-colors text-sm md:text-base select-none py-2 bg-gray-50 rounded-xl px-3">
                    <span>⚙️ ${t('operating.advancedParams')}</span>
                    <span class="transition group-open:rotate-180"><svg fill="none" height="20" width="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span>
                </summary>
                <div class="text-gray-500 mt-3 grid grid-cols-1 gap-3 animate-fadeIn">
                    <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200">
                        <span class="text-xs md:text-sm font-medium text-gray-700">${t('operating.electricAux').replace(' (Electric)', '')} (Electric)</span>
                        <div class="flex items-center"><span class="text-[10px] md:text-xs mr-2 font-bold">${t('operating.emission')}</span><input id="gridFactor" type="number" ${defAttr(ENERGY_DEFAULTS.electric.factor)} class="w-16 md:w-20 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-xs md:text-sm"><span class="ml-1 md:ml-2 text-[10px] md:text-xs font-bold">kg/kWh</span></div>
                    </div>
                    ${[
                        {k:'gas', labelKey:'gas', u:'m³'}, 
                        {k:'coal', labelKey:'coal', u:'kg'}, 
                        {k:'fuel', labelKey:'fuel', u:'kg'}, 
                        {k:'biomass', labelKey:'biomass', u:'kg'}, 
                        {k:'steam', labelKey:'steam', u:'kg'}
                    ].map(item => {
                        const n = t(`common.fuelShort.${item.k}`);
                        return `
                        <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200 related-to-${item.k}">
                            <span class="text-xs md:text-sm font-medium text-gray-700">${n}</span>
                            <div class="flex items-center gap-1 md:gap-2">
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold">${t('operating.calorific')}</span>
                                    <input id="${item.k}Calorific" type="number" ${defAttr(ENERGY_DEFAULTS[item.k].calorific)} class="w-12 md:w-16 p-1 border border-gray-300 rounded-lg text-right font-medium text-gray-900 text-[10px] md:text-sm">
                                    <select id="${item.k}CalorificUnit" class="ml-0.5 md:ml-1 p-1 border border-gray-300 rounded-lg bg-white text-[10px] md:text-xs font-medium w-12 md:w-16 track-change unit-converter" data-target-input="${item.k}Calorific">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                    </select>
                                    <span class="text-xs font-medium text-gray-500 ml-1">/${item.u}</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-medium hidden lg:inline">${t('operating.emission')}</span>
                                    <input id="${item.k}Factor" type="number" ${defAttr(ENERGY_DEFAULTS[item.k].factor)} class="w-12 md:w-16 p-1 border border-gray-300 rounded-lg text-right font-medium text-gray-900 text-[10px] md:text-sm">
                                    <span class="text-[10px] md:text-xs font-medium text-gray-500 ml-0.5">kg/${item.u}</span>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </details>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${LABEL_STYLE} mb-3 md:mb-4">${t('operating.opex')}</label>
            <div class="space-y-3 md:space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm md:text-base font-medium text-blue-600 w-20 md:w-24">${t('operating.hpOpex')}</span>
                    <input type="number" id="hpOpexCost" ${defAttr(ENERGY_DEFAULTS.hp.opex)} class="flex-1 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-base md:text-lg font-medium text-blue-700 text-center h-10 md:h-12 shadow-apple-sm">
                </div>
                ${[
                    {id:'gas', key:'gas'}, 
                    {id:'coal', key:'coal'},
                    {id:'electric', key:'electric'}, 
                    {id:'steam', key:'steam'},
                    {id:'fuel', key:'fuel'}, 
                    {id:'biomass', key:'biomass'}
                ].map(item => {
                    const labelMap = {
                        gas: t('scheme.gas'),
                        coal: t('scheme.coal'),
                        electric: t('scheme.electric'),
                        steam: t('scheme.steam'),
                        fuel: t('scheme.fuel'),
                        biomass: t('scheme.biomass')
                    };
                    const valMap = {
                        gas: ENERGY_DEFAULTS.gas.opex,
                        coal: ENERGY_DEFAULTS.coal.opex,
                        electric: ENERGY_DEFAULTS.electric.opex,
                        steam: ENERGY_DEFAULTS.steam.opex,
                        fuel: ENERGY_DEFAULTS.fuel.opex,
                        biomass: ENERGY_DEFAULTS.biomass.opex
                    };
                    const label = labelMap[item.key] || labelMap[item.id];
                    const val = valMap[item.key] || valMap[item.id];
                    return `
                    <div class="flex items-center justify-between related-to-${item.id}">
                        <span class="text-sm md:text-base font-medium text-gray-600 w-20 md:w-24">${label}</span>
                        <input type="number" id="${item.id}OpexCost" ${defAttr(val)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-base md:text-lg font-medium text-gray-700 text-center h-10 md:h-12">
                    </div>
                `;
                }).join('')}
            </div>
        </div>
    `;
}

function generateFinancialInputsHTML() {
    return `
        <div class="mb-6">
            <label class="${LABEL_STYLE} mb-3">${t('financial.businessModel')}</label>
            <div class="flex bg-gray-100 p-1 rounded-xl">
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="financeMode" value="self" class="peer sr-only" checked>
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-purple-600 peer-checked:shadow-apple-sm transition-all">${t('financial.selfInvest')}</span>
                </label>
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="financeMode" value="bot" class="peer sr-only">
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-purple-600 peer-checked:shadow-apple-sm transition-all">${t('financial.bot')}</span>
                </label>
            </div>
        </div>
        <div class="space-y-4 md:space-y-6">
            <div>
                <label class="${LABEL_STYLE}">${t('financial.analysisYears')}</label>
                <input type="number" id="lccYears" ${defAttr("15")} class="${INPUT_STYLE}">
            </div>
            <div>
                <label class="${LABEL_STYLE}">${t('financial.discountRate')}</label>
                <input type="number" id="discountRate" ${defAttr("8")} class="${INPUT_STYLE}">
            </div>
            <div id="bot-params" class="hidden p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-4 animate-fadeIn">
                <h4 class="text-sm font-semibold text-purple-800 mb-2 flex items-center"><span class="mr-2">💰</span>${t('financial.botParams')}</h4>
                <div><label class="${LABEL_STYLE}">${t('financial.annualRevenue')}</label><input type="number" id="botAnnualRevenue" ${defAttr("150")} class="${INPUT_STYLE} border-purple-200 focus:border-purple-500 text-purple-900"></div>
                <div><label class="${LABEL_STYLE}">${t('financial.equityRatio')}</label><input type="number" id="botEquityRatio" ${defAttr("30")} class="${INPUT_STYLE} border-purple-200 focus:border-purple-500 text-purple-900"></div>
            </div>
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${LABEL_STYLE}">${t('financial.energyInflation')}</label>
                    <input type="number" id="energyInflationRate" ${defAttr("3")} class="${INPUT_STYLE}">
                </div>
                <div>
                    <label class="${LABEL_STYLE}">${t('financial.opexInflation')}</label>
                    <input type="number" id="opexInflationRate" ${defAttr("5")} class="${INPUT_STYLE}">
                </div>
            </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-200 text-center pb-24">
            <p class="text-sm font-medium text-gray-700">${t('financial.author')}</p>
            <p id="usage-counter" class="text-xs text-blue-500 font-medium mt-1">${t('financial.usageCounter', {count: 0})}</p>
            <p class="text-[10px] text-gray-400 mt-2 leading-tight px-4">${t('financial.disclaimer')}</p>
        </div>
    `;
}

// ==========================================
// 2. 初始化与逻辑处理
// ==========================================

export function initializeUI(handleCalculate) {
    injectAccordionContent('accordion-project', t('accordion.project'), generateProjectInputsHTML());
    injectAccordionContent('accordion-scheme', t('accordion.scheme'), generateSchemeInputsHTML());
    injectAccordionContent('accordion-operating', t('accordion.operating'), generateOperatingInputsHTML());
    injectAccordionContent('accordion-financial', t('accordion.financial'), generateFinancialInputsHTML());

    Dashboard.initializeDashboard();
    setupInputMonitoring(); 
    setupUnitAutoConverters(); 
    updateUsageDisplay();
    setupModeToggles(); 
    setupScenarioLogic(); 


    // [新增] 优化右侧空白页的提示语 (Empty State)
    const placeholder = document.getElementById('report-placeholder');
    if(placeholder) {
        placeholder.innerHTML = `
            <div class="flex flex-col items-center justify-center p-10 opacity-60">
                <svg class="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 17h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <h3 class="text-2xl font-bold text-gray-400 mb-2">${t('message.noData')}</h3>
                <p class="text-gray-400">${t('message.noDataPrompt')}</p>
            </div>
        `;
    }

    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) calcBtn.addEventListener('click', () => {
        incrementUsageCounter();
        handleCalculate();
    });

    setupSimpleUnitConverter('heatingLoadUnit', 'heatingLoad', {'kW': 1, 'kcal/h': 1/1.163}); 

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

// src/js/ui.js 中需要修改的两个函数

// 1. 补全表头：增加折算成本、节能率、年节省、回收期、碳减排等列
function setupScenarioLogic() {
    let tableWrapper = document.getElementById('scenario-table-wrapper');
    // 强制重置 HTML 以更新表头结构
    const scenarioTab = document.getElementById('tab-scenarios');
    if (scenarioTab) {
        scenarioTab.innerHTML = `
             <div id="scenario-table-wrapper" class="hidden overflow-x-auto">
                 <table class="min-w-full divide-y divide-gray-200" id="scenario-comparison-table">
                     <thead class="bg-gray-100">
                         <tr>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.scenarioName')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.unitSteamCost')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.savingRate')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.investment')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.annualTotalCost')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.annualSaving')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.dynamicPayback')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">IRR</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.lccTotal')}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${t('table.co2Reduction')}</th>
                             <th class="px-4 py-3"><span class="sr-only">${t('table.action')}</span></th>
                         </tr>
                     </thead>
                     <tbody class="bg-white divide-y divide-gray-100 text-lg font-medium"></tbody>
                 </table>
             </div>
             <div id="scenario-empty-msg" class="text-center text-gray-400 py-10 text-lg font-medium">${t('scenario.empty')}</div>
             <div class="mt-8 flex justify-end gap-4">
                 <button id="undoClearBtn" class="hidden text-base font-bold text-blue-600 hover:text-blue-800">${t('button.undo')}</button>
                 <button id="clearScenariosBtn" class="hidden text-base font-bold text-red-600 hover:text-red-800">${t('button.clear')}</button>
             </div>
        `;
        tableWrapper = document.getElementById('scenario-table-wrapper');
    }

    // 重新绑定保存按钮
    const saveBtn = document.getElementById('saveScenarioBtn');
    if (saveBtn) {
        // 移除旧监听器（通过克隆节点）防止重复绑定
        const newBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newBtn, saveBtn);
        
        newBtn.addEventListener('click', () => {
            if (!latestResults) {
                alert(t('message.pleaseCalculateFirst'));
                return;
            }
            
            let modeName = t('scenario.modePure');
            if (latestResults.inputs.isHybridMode) modeName = t('scenario.modeHybrid');
            if (latestResults.inputs.isBOTMode) modeName += t('scenario.modeBOT');
            
            const bestComp = latestResults.comparisons.sort((a, b) => b.annualSaving - a.annualSaving)[0];
            
            // 抓取全量数据快照
            const snapshot = {
                id: Date.now(),
                name: `${t('scenario.scenario')}${savedScenarios.length + 1}：${latestResults.inputs.projectName} [${modeName}]`,
                unitSteamCost: latestResults.hp.unitSteamCost,
                savingRate: bestComp ? bestComp.savingRate : 0,
                invest: latestResults.hp.initialInvestment,
                annualTotalCost: latestResults.hp.annualTotalCost,
                annualSaving: bestComp ? bestComp.annualSaving : 0,
                dynamicPBP: bestComp ? bestComp.dynamicPBP : '-',
                irr: bestComp ? bestComp.irr : null,
                lcc: latestResults.hp.lcc.total,
                co2: bestComp ? bestComp.co2Reduction : 0,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            savedScenarios.push(snapshot);
            updateScenarioTable();
            Dashboard.switchTab('scenarios');
            
            if(Dashboard.showGlobalNotification) {
                Dashboard.showGlobalNotification(t('scenario.saved'), 'success');
            }
        });
    }
    
    // 重新绑定清空逻辑
    const scenariosTab = document.getElementById('tab-scenarios');
    if(scenariosTab) {
        scenariosTab.onclick = (e) => {
            if (e.target.id === 'clearScenariosBtn') {
                if (savedScenarios.length === 0) return;
                if (confirm(t('scenario.clearConfirm'))) {
                    deletedScenariosBackup = [...savedScenarios];
                    savedScenarios = [];
                    updateScenarioTable();
                    const uBtn = document.getElementById('undoClearBtn');
                    if(uBtn) {
                        uBtn.classList.remove('hidden');
                        setTimeout(() => uBtn.classList.add('hidden'), 5000);
                    }
                }
            }
            if (e.target.id === 'undoClearBtn') {
                savedScenarios = [...deletedScenariosBackup];
                deletedScenariosBackup = [];
                updateScenarioTable();
                e.target.classList.add('hidden');
            }
        };
    }
}

// 2. 补全数据列：填充所有对应数据
function updateScenarioTable() {
    const tbody = document.querySelector('#scenario-comparison-table tbody');
    const wrapper = document.getElementById('scenario-table-wrapper');
    const emptyMsg = document.getElementById('scenario-empty-msg');
    const clearBtn = document.getElementById('clearScenariosBtn');
    
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (savedScenarios.length === 0) {
        if(wrapper) wrapper.classList.add('hidden');
        if(emptyMsg) emptyMsg.classList.remove('hidden');
        if(clearBtn) clearBtn.classList.add('hidden');
        return;
    }
    
    if(wrapper) wrapper.classList.remove('hidden');
    if(emptyMsg) emptyMsg.classList.add('hidden');
    if(clearBtn) clearBtn.classList.remove('hidden');
    
    savedScenarios.forEach((s, index) => {
        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tr.innerHTML = `
            <td class="px-4 py-3 text-sm font-bold text-gray-800 whitespace-nowrap">${s.name} <span class="text-xs text-gray-400 ml-1">${s.timestamp}</span></td>
            <td class="px-4 py-3 text-sm text-blue-600 font-bold whitespace-nowrap">${fYuan(s.unitSteamCost, 1)}</td>
            <td class="px-4 py-3 text-sm text-green-600 font-bold whitespace-nowrap">${fPercent(s.savingRate)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${fWan(s.invest)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${fWan(s.annualTotalCost)}</td>
            <td class="px-4 py-3 text-sm font-bold text-green-600 whitespace-nowrap">${fWan(s.annualSaving)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap text-center">${s.dynamicPBP} 年</td>
            <td class="px-4 py-3 text-sm font-bold whitespace-nowrap text-center ${s.irr > 0.08 ? 'text-green-600' : 'text-yellow-600'}">${s.irr ? fPercent(s.irr) : '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${fWan(s.lcc)}</td>
            <td class="px-4 py-3 text-sm text-green-600 whitespace-nowrap">${fNum(s.co2, 1)}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
                <button class="text-red-400 hover:text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded" onclick="removeScenario(${s.id})">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.removeScenario = function(id) {
    savedScenarios = savedScenarios.filter(s => s.id !== id);
    updateScenarioTable();
};

function setupModeToggles() {
    const modeRadios = document.querySelectorAll('input[name="calcMode"]');
    modeRadios.forEach(r => r.addEventListener('change', updateCalcModeUI));
    updateCalcModeUI(); 

    const toggles = document.querySelectorAll('.comparison-toggle');
    toggles.forEach(t => t.addEventListener('change', updateComparisonStyles));
    updateComparisonStyles();

    const systemRadios = document.querySelectorAll('input[name="systemMode"]');
    systemRadios.forEach(r => r.addEventListener('change', (e) => {
        const val = e.target.value;
        const hybridDiv = document.getElementById('hybrid-params');
        if(val === 'hybrid') {
            hybridDiv.classList.remove('hidden');
        } else {
            hybridDiv.classList.add('hidden');
        }
    }));

    const financeRadios = document.querySelectorAll('input[name="financeMode"]');
    financeRadios.forEach(r => r.addEventListener('change', (e) => {
        const val = e.target.value;
        const botDiv = document.getElementById('bot-params');
        if(val === 'bot') {
            botDiv.classList.remove('hidden');
        } else {
            botDiv.classList.add('hidden');
        }
    }));
}

function incrementUsageCounter() {
    let count = parseInt(localStorage.getItem('heat_pump_usage_count') || '0');
    count++;
    localStorage.setItem('heat_pump_usage_count', count);
    updateUsageDisplay(count);
}

function updateUsageDisplay(count = null) {
    if (count === null) count = parseInt(localStorage.getItem('heat_pump_usage_count') || '0');
    const el = document.querySelectorAll('#usage-counter');
    el.forEach(e => e.textContent = t('financial.usageCounter', {count: count}));
}

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
        if (container.children.length > 1) { div.remove(); document.getElementById('calculateBtn')?.click(); } else { alert(t('message.keepOneTier')); }
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
            <span class="text-lg font-semibold text-gray-900 tracking-wide">${title}</span>
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

function resetParams() { if(confirm(t('message.resetConfirm'))) location.reload(); }

function setupExportButton() {
    const btn = document.getElementById('export-report-btn');
    if (btn) btn.addEventListener('click', () => { if (!latestResults) { alert(t('message.pleaseCalculate')); return; } buildPrintReport(latestResults); setTimeout(() => { window.print(); }, 500); });
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
    
    const isHybrid = document.querySelector('input[name="systemMode"]:checked').value === 'hybrid';
    const isBOT = document.querySelector('input[name="financeMode"]:checked').value === 'bot';
    const hybridAuxType = document.getElementById('hybridAuxHeaterType')?.value || 'electric';

    return {
        projectName: document.getElementById('projectName').value, 
        analysisMode: 'standard', 
        
        isHybridMode: isHybrid, 
        hybridLoadShare: isHybrid ? getVal('hybridLoadShare') : 100,
        hybridAuxHeaterCapex: isHybrid ? getVal('hybridAuxHeaterCapex') * 10000 : 0,
        hybridAuxHeaterType: hybridAuxType,
        hybridAuxHeaterOpex: isHybrid ? getVal('hybridAuxHeaterOpex') * 10000 : 0,
        
        isBOTMode: isBOT,
        botAnnualRevenue: getVal('botAnnualRevenue') * 10000,
        botEquityRatio: getVal('botEquityRatio') / 100,

        priceTiers, heatingLoad, operatingHours, annualHeatingDemandKWh,
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
    
    const saveBtn = document.getElementById('saveScenarioBtn');
    if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        saveBtn.classList.add('hover:bg-gray-200');
    }

    const bestComp = results.comparisons.sort((a, b) => b.annualSaving - a.annualSaving)[0];
    
    const kpiClass = "text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-semibold text-gray-900 mt-2 md:mt-3 tracking-tight truncate";

    if (bestComp) {
        Dashboard.updateResultCard('annual-saving', `${fWan(bestComp.annualSaving)} ${t('common.unit.tenThousand')}`, kpiClass);
        let irrText = '--'; 
        if (bestComp.irr === null || bestComp.irr === -Infinity || bestComp.irr < -1) { irrText = t('dataTable.cannotRecover'); } 
        else { irrText = fPercent(bestComp.irr); }
        Dashboard.updateResultCard('irr', irrText, kpiClass);
        Dashboard.updateResultCard('pbp', `${bestComp.dynamicPBP} ${t('dataTable.year')}`, kpiClass);
        Dashboard.updateResultCard('co2-reduction', `${fNum(bestComp.co2Reduction, 1)} ${t('common.unit.ton')}`, kpiClass);
    } else {
        Dashboard.updateResultCard('annual-saving', '--', kpiClass); Dashboard.updateResultCard('irr', '--', kpiClass);
    }
    
    setTimeout(() => {
        destroyCharts();
        const labels = [t('scenario.modePure'), ...results.comparisons.map(c => c.name)];
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
                <table class="min-w-full text-base md:text-lg text-left text-gray-700">
                    <thead class="text-sm md:text-base font-semibold text-gray-900 uppercase bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th class="px-4 py-4 whitespace-nowrap">${t('table.scenarioName')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${t('table.unitSteamCost')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${t('table.savingRate')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${t('table.annualTotalCost')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${t('table.annualSaving')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">${t('table.staticPayback')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">${t('table.dynamicPayback')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">IRR</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${t('table.lccTotalFull')}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${t('table.co2Reduction')}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr class="bg-blue-50/50 border-b border-gray-100 font-semibold text-gray-900">
                            <td class="px-4 py-4 whitespace-nowrap">${t('dataTable.hpScheme')}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-blue-600">${fYuan(results.hp.unitSteamCost, 1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">${fWan(results.hp.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${fWan(results.hp.lcc.total)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${results.comparisons.map(c => `
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-4 whitespace-nowrap font-semibold text-gray-800">${c.name}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${fYuan(c.unitSteamCost, 1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-semibold text-green-600">${fPercent(c.savingRate)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${fWan(c.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-semibold text-green-600">${fWan(c.annualSaving)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-medium">${c.paybackPeriod || '-'}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-medium">${c.dynamicPBP} ${t('dataTable.year')}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-semibold text-blue-500">${
                                c.irr === null || c.irr < -1 ? '<span class="text-gray-400">N/A</span>' : fPercent(c.irr)
                            }</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium hidden lg:table-cell">${fWan(c.lccTotal)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-green-600 font-semibold hidden lg:table-cell">${fNum(c.co2Reduction, 1)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="text-sm text-gray-400 mt-4 md:mt-6">* ${t('dataTable.note1')} ${fPercent(results.inputs.discountRate)}。<br>* ${t('dataTable.note2')}</p>
        `;
    }
    
    const conclusionTab = document.getElementById('tab-conclusion');
    if (conclusionTab && bestComp) {
        const isGood = bestComp.irr > 0.08;
        conclusionTab.innerHTML = `
            <div class="p-6 md:p-8 ${isGood ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'} rounded-2xl">
                <h3 class="text-xl md:text-3xl font-semibold ${isGood ? 'text-green-800' : 'text-yellow-800'} mb-4">${isGood ? t('conclusion.recommend') : t('conclusion.average')}</h3>
                <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                    ${t('conclusion.compared')} <strong>${bestComp.name}</strong>，${t('conclusion.hpScheme')} <strong>${fWan(bestComp.annualSaving)} ${t('conclusion.yuan')}</strong>，${t('conclusion.savingRateText')} <strong>${fPercent(bestComp.savingRate)}</strong>。
                    <br><br>
                    ${t('conclusion.hpCost')} <strong>${fYuan(results.hp.unitSteamCost, 1)} ${t('conclusion.perTonSteam')}</strong>，${bestComp.name}${t('conclusion.cost')} <strong>${fYuan(bestComp.unitSteamCost, 1)} ${t('conclusion.perTon')}</strong>。
                    <br><br>
                    ${t('conclusion.lifetimeSaving', {years: results.inputs.lccYears})} <strong>${fWan(bestComp.lccSaving)} ${t('conclusion.yuan')}</strong>。${t('conclusion.dynamicPaybackText')} ${bestComp.dynamicPBP} ${t('dataTable.year')}。
                </p>
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
            display.className = "text-3xl font-semibold text-blue-500 tracking-tight"; 
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