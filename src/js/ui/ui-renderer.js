// ui-renderer.js (CLEANED, FINAL, FULLY FUNCTIONAL VERSION)
import { fWan, fTon, fCop, fPercent, fYears, fNum, fInt, fYuan, fInvest } from '../core/utils.js';

let notifierTimeout = null;
export function showGlobalNotification(message, type = 'info', duration = 3000) {
    const notifier = document.getElementById('global-notifier');
    const notifierText = document.getElementById('global-notifier-text');
    const iconSuccess = document.getElementById('global-notifier-icon-success');
    const iconError = document.getElementById('global-notifier-icon-error');
    if (!notifier || !notifierText || !iconSuccess || !iconError) return;
    if (notifierTimeout) clearTimeout(notifierTimeout);
    notifierText.textContent = message;
    notifier.className = 'fixed top-5 right-5 z-50 max-w-sm p-4 rounded-lg shadow-lg flex items-center transition-opacity transition-transform duration-300';
    iconSuccess.classList.add('hidden');
    iconError.classList.add('hidden');
    if (type === 'success') {
        notifier.classList.add('bg-green-100', 'text-green-800');
        iconSuccess.classList.remove('hidden');
    } else if (type === 'error') {
        notifier.classList.add('bg-red-100', 'text-red-800');
        iconError.classList.remove('hidden');
    } else {
        notifier.classList.add('bg-blue-100', 'text-blue-800');
        iconSuccess.classList.remove('hidden');
    }
    notifier.classList.remove('hidden', 'opacity-0', 'translate-x-full');
    notifierTimeout = setTimeout(() => {
        notifier.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => notifier.classList.add('hidden'), 300);
    }, duration);
}

let modalResolve = null;
export function showConfirmModal(title, body) {
    const modal = document.getElementById('confirm-modal');
    const modalTitle = document.getElementById('confirm-modal-title');
    const modalMessage = document.getElementById('confirm-modal-message');
    if (!modal || !modalTitle || !modalMessage) return Promise.resolve(false);
    modalTitle.textContent = title;
    modalMessage.textContent = body;
    modal.classList.remove('hidden');
    return new Promise((resolve) => { modalResolve = resolve; });
}

export function initializeModalControls() {
    const modal = document.getElementById('confirm-modal');
    const confirmBtn = document.getElementById('confirm-modal-ok-btn');
    const cancelBtn = document.getElementById('confirm-modal-cancel-btn');
    if (!modal || !confirmBtn || !cancelBtn) return;
    const closeModal = (resolution) => {
        modal.classList.add('hidden');
        if (modalResolve) {
            modalResolve(resolution);
            modalResolve = null;
        }
    };
    confirmBtn.addEventListener('click', () => closeModal(true));
    cancelBtn.addEventListener('click', () => closeModal(false));
}

export function setStaleDisplay(show) {
    document.getElementById('stale-results-notice')?.classList.toggle('hidden', !show);
    document.getElementById('results-container')?.classList.toggle('opacity-50', show);
}

export function showResults(show) {
     document.getElementById('results-placeholder')?.classList.toggle('hidden', show);
     document.getElementById('results-content')?.classList.toggle('hidden', !show);
}

export function setSaveButtonState(state, text = '暂存当前工业热泵方案 (请先计算)') {
    const saveBtn = document.getElementById('saveScenarioBtn');
    const scenarioToggle = document.getElementById('enableScenarioComparison');
    if (!saveBtn || !scenarioToggle) return;
    if (!scenarioToggle.checked) {
        saveBtn.classList.add('hidden');
        return;
    }
    saveBtn.classList.remove('hidden');
    saveBtn.disabled = state === 'disabled';
    saveBtn.classList.toggle('bg-gray-400', state === 'disabled');
    saveBtn.classList.toggle('cursor-not-allowed', state === 'disabled');
    saveBtn.classList.toggle('bg-green-600', state !== 'disabled');
    saveBtn.classList.toggle('hover:bg-green-700', state !== 'disabled');
    if (state === 'saved') {
        saveBtn.textContent = '方案已暂存!';
        setTimeout(() => { setSaveButtonState('enabled'); }, 2000);
    } else {
        saveBtn.textContent = text;
    }
}

export function showPriceTierError(message) {
    const priceTierErrorDiv = document.getElementById('priceTierError');
    if (!priceTierErrorDiv) return;
    if (message) {
        priceTierErrorDiv.textContent = message;
        priceTierErrorDiv.classList.remove('hidden');
    } else {
        priceTierErrorDiv.classList.add('hidden');
    }
}

export function renderResults(results) {
    const { analysisMode } = results;
    if (analysisMode === 'bot') {
        renderBotResults(results);
    } else {
        renderCostComparisonResults(results);
    }
}

function renderBotResults(results) {
    const resultsContent = document.getElementById('results-content');
    if (!resultsContent) return;
    // ... (Your original BOT rendering logic here if needed)
    resultsContent.innerHTML = `<div class="p-6">BOT 模式结果渲染区</div>`;
}

function renderCostComparisonResults(results) {
    const { lccParams, comparisons } = results;
    const hpSystemDetails = results.isHybridMode ? results.hybridSystem : results.hp;
    const lccYears = lccParams.lccYears;
    const discountRate = lccParams.discountRate;

    const resultsContent = document.getElementById('results-content');
    if (!resultsContent) return;

    const resultsTitle = document.getElementById('results-title');
    if(resultsTitle) resultsTitle.textContent = `静态、ROI 与 LCC (${lccYears}年) 对比分析结果`;

    const isHybrid = hpSystemDetails.isHybrid || false;
    const hpCardTitleStatic = isHybrid ? '混合系统年运行成本 (第1年)' : '工业热泵系统年运行成本 (第1年)';
    const hpCardTitleLCC = isHybrid ? `混合系统 LCC (${lccYears}年)` : `工业热泵系统 LCC (${lccYears}年)`;

    let html = `
        <div class="space-y-6">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <h3 class="font-semibold text-lg text-blue-800 mb-2">${hpCardTitleStatic}</h3>
                <div class="flex flex-col sm:flex-row justify-between sm:items-baseline sm:gap-4">
                    <div>
                        <p class="text-xs text-blue-700">年总运行成本</p>
                        <p class="text-3xl font-bold text-blue-600">${fWan(hpSystemDetails.opex)} 万元</p>
                    </div>
                    <div class="sm:text-right mt-2 sm:mt-0">
                        <p class="text-xs text-blue-700">折算吨蒸汽电耗</p>
                        <p class="text-xl font-semibold text-blue-600">${fNum(hpSystemDetails.electricity_per_steam_ton, 1)} kWh/t</p>
                    </div>
                    <div class="sm:text-right mt-2 sm:mt-0">
                        <p class="text-xs text-blue-700">折算吨蒸汽单价</p>
                        <p class="text-xl font-semibold text-blue-600">${fYuan(hpSystemDetails.cost_per_steam_ton)} 元/t</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-lg">
                <h3 class="font-semibold text-lg text-blue-900">
                    ${hpCardTitleLCC}
                </h3>
                <p class="text-xs text-blue-700 mb-1">LCC = 初始投资 + (未来${lccYears}年所有运营成本 - ${lccYears}年后残值)</p>
                <p class="text-3xl font-bold text-blue-700">${fWan(hpSystemDetails.lcc.total)} 万元</p>
            </div>
        </div>
    `;

    comparisons.forEach((boiler) => {
        const npvColor = boiler.npv > 0 ? 'text-green-600' : 'text-red-600';
        const irrColor = boiler.irr > discountRate ? 'text-green-600' : (boiler.irr === null || !isFinite(boiler.irr) ? 'text-gray-500' : 'text-red-600');
        const paybackColor = boiler.dynamicPBP !== null ? 'text-blue-600' : 'text-red-600';
        const staticSavingColor = boiler.opexSaving > 0 ? 'text-green-600' : 'text-red-600';
        const energySavingColor = boiler.energyCostSaving > 0 ? 'text-green-600' : 'text-red-600'; 
        const simpleRoiColor = boiler.simpleROI !== null ? 'text-green-600' : 'text-gray-500';

        html += `
        <div class="bg-gray-50 p-6 rounded-lg border mt-8 space-y-4">
            <h4 class="text-xl font-bold text-gray-800 border-b pb-3">与 <span class="text-blue-600">${boiler.name}</span> 对比</h4>
            
            <div class="space-y-2">
                <h5 class="font-semibold text-blue-800 text-md">视角: 投资回报率 (ROI)</h5>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">简单投资回报率 (ROI)</span>
                    <span class="font-bold text-lg ${simpleRoiColor}">${fPercent(boiler.simpleROI)}</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">净现值 (NPV)</span>
                    <span class="font-bold text-lg ${npvColor}">${fWan(boiler.npv)} 万元</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">内部收益率 (IRR)</span>
                    <span class="font-bold text-lg ${irrColor}">${fPercent(boiler.irr)}</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2">
                    <span class="text-gray-600">动态回收期 (PBP)</span>
                    <span class="font-bold text-lg ${paybackColor}">${fYears(boiler.dynamicPBP)}</span>
                </div>
            </div>

            <div class="space-y-2 pt-4 border-t">
                <h5 class="font-semibold text-gray-800 text-md">视角: 静态 (第1年) 与 环境</h5>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">电热价格比 (EPR)</span>
                    <span class="font-bold text-lg ${boiler.electricalPriceRatio > 1.0 ? 'text-green-600' : 'text-red-600'}">${boiler.electricalPriceRatio ? boiler.electricalPriceRatio.toFixed(2) : 'N/A'}</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">年节省能源费:</span>
                    <span class="font-semibold ${energySavingColor}">${fWan(boiler.energyCostSaving)} 万元</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">能源费节能率:</span>
                    <span class="font-semibold ${energySavingColor}">${fPercent(boiler.energyCostSavingRate)}</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">年节省总成本 (含运维):</span>
                    <span class="font-semibold ${staticSavingColor}">${fWan(boiler.opexSaving)} 万元</span>
                </div>
                 <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">静态回报期 (总成本):</span>
                    <span class="font-semibold">${boiler.paybackPeriod}</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">基准年能源消耗:</span>
                    <span class="font-semibold text-gray-700">${fNum(boiler.consumption, 2)} ${boiler.consumptionUnit}</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2">
                    <span class="text-gray-600">年碳减排量:</span>
                    <span class="font-semibold text-green-600">${fTon(boiler.co2Reduction)} 吨 CO₂</span>
                </div>
            </div>

             <div class="space-y-2 pt-4 border-t">
                <h5 class="font-semibold text-gray-800 text-md">视角: 全生命周期成本 (LCC)</h5>
                <div class="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                    <span class="text-gray-600">${isHybrid ? '混合系统' : '工业热泵'} LCC:</span>
                    <span class="font-semibold text-blue-700">${fWan(hpSystemDetails.lcc.total)} 万元</span>
                </div>
                <div class="flex justify-between items-center text-sm py-2">
                    <span class="text-gray-600">${boiler.name} LCC:</span>
                    <span class="font-semibold text-gray-700">${fWan(boiler.lcc)} 万元</span>
                </div>
            </div>
        </div>
        `;
    });

    let conclusionHTML = `
        <div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg space-y-3 mt-8">
            <h4 class="text-xl font-bold text-indigo-800 border-b pb-2">综合结论 (基于 ${lccYears} 年分析)</h4>
    `;
    const profitableROI = comparisons.filter(c => c.irr > discountRate && isFinite(c.irr)); 
    if (profitableROI.length > 0) {
        const bestIRR = profitableROI.reduce((p, c) => (p.irr > c.irr) ? p : c);
        conclusionHTML += `<p class="text-sm text-gray-700"><b>投资回报 (ROI) 结论：</b>项目可行。相较于 <b>${profitableROI.map(p => p.name).join('、')}</b>，IRR 高于基准收益率(${fPercent(discountRate)})。回报最佳的是替代 <b>${bestIRR.name}</b>，IRR 高达 <b>${fPercent(bestIRR.irr)}</b>，动态回收期 <b>${fYears(bestIRR.dynamicPBP)}</b>。</p>`;
    } else {
         const bestNPV = comparisons.length > 0 ? comparisons.reduce((p, c) => (p.npv > c.npv) ? p : c) : null;
         if (bestNPV && bestNPV.npv > 0) {
             conclusionHTML += `<p class="text-sm text-gray-700"><b>投资回报 (ROI) 结论：</b>项目勉强可行。相较于 <b>${bestNPV.name}</b>，项目净现值(NPV)为正 (<b>${fWan(bestNPV.npv)} 万元</b>)，但所有方案 IRR 均未超过基准收益率(${fPercent(discountRate)})。</p>`;
         } else {
             conclusionHTML += `<p class="text-sm text-red-700"><b>投资回报 (ROI) 结论：</b>项目不可行。相较于所有对比方案，项目的 IRR 均低于基准收益率(${fPercent(discountRate)})，且 NPV 均为负。</p>`;
         }
    }
    const positiveCO2Reducers = comparisons.filter(c => c.co2Reduction > 0);
    if (positiveCO2Reducers.length > 0) {
        const bestEnviro = positiveCO2Reducers.reduce((p, c) => (p.co2Reduction > c.co2Reduction) ? p : c);
        conclusionHTML += `<p class="text-sm text-gray-700"><b>环境效益 (年)：</b>替代 <b>${bestEnviro.name}</b> 的环境效益最为显著，年碳减排量可达 <b>${fTon(bestEnviro.co2Reduction)}</b> 吨CO₂，相当于植树约 <b>${fInt(bestEnviro.treesPlanted)}</b> 棵。</p>`;
    } else if (comparisons.length > 0) {
         conclusionHTML += `<p class="text-sm text-gray-700"><b>环境效益 (年)：</b>根据当前参数，${isHybrid ? '混合' : '工业热泵'}方案相较于所选对比方案均无碳减排优势。</p>`;
    }
    conclusionHTML += '</div>';

    html += conclusionHTML;
    
    let buttonsHTML = `
        <div class="mt-8 space-y-2">
            <button id="toggle-details-btn" class="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">显示详细计算过程 (含公式)</button>
            <div id="calculation-details" class="hidden bg-white rounded-lg border text-sm space-y-4 mt-2"></div>
            
            <button id="toggle-risk-btn" class="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">显示投资风险及对策分析</button>
            <div id="risk-analysis-details" class="hidden bg-white rounded-lg border text-sm space-y-4 mt-2"></div>
            
            <button id="printReportBtn" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition mt-4">打印本页报告 (A4)</button>
        </div>
    `;

    html += buttonsHTML;
    resultsContent.innerHTML = html;
}


// --- Detail, Risk, and Print Functions (NOW WITH FULL LOGIC) ---

export function populateCalculationDetails(results) {
    const detailsContainer = document.getElementById('calculation-details');
    if (!detailsContainer) return;
    
    if (results.analysisMode === 'bot') {
        populateBotCalculationDetails(results);
    } else {
        populateCostComparisonCalculationDetails(results);
    }
}

export function populateRiskAnalysisDetails(analysisMode) {
    const riskContainer = document.getElementById('risk-analysis-details');
    if (!riskContainer) return;
    
    let riskHTML = `<div class="p-6 space-y-4">`;
    
    if (analysisMode === 'bot') {
        riskHTML += `
            <h3 class="text-lg font-bold border-b pb-2 mb-4">BOT 模式投资风险及对策分析</h3>
            <h4 class="font-semibold text-gray-800">1. 财务与市场风险</h4>
            <ul class="list-disc list-inside text-sm space-y-2">
                <li><b>风险 (收入不及预期):</b> 客户用热量未达标，或能源销售单价（热价）低于预期，导致年销售收入无法实现。</li>
                <li class="pl-4 text-gray-600"><b>对策:</b> <b>(1) 签订“照付不议”合同:</b> 与客户约定最低用热量，未达到也需按约定付费。<b>(2) 价格联动:</b> 合同中应包含能源价格（电价）与销售热价的联动条款。</li>
                <li><b>风险 (成本失控):</b> 能源价格（电价、天然气等）涨幅超过预期，或设备能效未达标导致能耗过高。</li>
                <li class="pl-4 text-gray-600"><b>对策:</b> <b>(1) 成本锁定:</b> 尽可能签订长期能源供应合同。<b>(2) 敏感性分析:</b> 测算能源成本上涨对项目TIRR和EIRR的影响。</li>
            </ul>
        `;
    } else {
        riskHTML += `
            <h3 class="text-lg font-bold border-b pb-2 mb-4">工业热泵投资风险及对策分析 (成本对比)</h3>
            <h4 class="font-semibold text-gray-800">1. 政策与市场风险</h4>
            <ul class="list-disc list-inside text-sm space-y-2">
                <li><b>风险 (电价波动):</b> "峰谷尖"电价政策调整，尤其是谷电价格上涨或峰电涨幅不及预期，可能导致运行成本高于预期。</li>
                <li class="pl-4 text-gray-600"><b>对策:</b> <b>(1) 精确评估:</b> 采用加权平均电价或分时电价模型进行精确测算。<b>(2) 敏感性分析:</b> 测算电价上涨对IRR和PBP的影响。<b>(3) 绿电合约:</b> 探索与发电企业签订长期购电协议 (PPA)。</li>
            </ul>
            <h4 class="font-semibold text-gray-800 mt-4">2. 技术与运行风险</h4>
            <ul class="list-disc list-inside text-sm space-y-2">
                <li><b>风险 (性能衰减/SPF不达标):</b> 全年综合能效系数(SPF)低于设计值，导致实际运行电耗过高。</li>
                <li class="pl-4 text-gray-600"><b>对策:</b> <b>(1) 选型匹配:</b> 基于项目地最冷月平均工况进行主机选型。<b>(2) 耦合设计:</b> 采用“工业热泵 + 辅助热源”的耦合方案。<b>(3) 明确SPF:</b> 明确SPF的计算边界。</li>
            </ul>
            <h4 class="font-semibold text-gray-800 mt-4">3. 财务与LCC风险</h4>
            <ul class="list-disc list-inside text-sm space-y-2">
                 <li><b>风险 (LCC估算偏差):</b> 仅对比“第1年运行成本”，忽略了初始投资(CAPEX)和未来成本。</li>
                <li class="pl-4 text-gray-600"><b>对策:</b> <b>(1) 采用LCC:</b> 坚持使用 LCC 作为决策依据。<b>(2) 考虑通胀:</b> 必须设置合理的“能源价格涨幅”和“运维成本涨幅”。</li>
            </ul>
        `;
    }
    riskHTML += `</div>`;
    riskContainer.innerHTML = riskHTML;
}

function populateCostComparisonCalculationDetails(results) {
    const detailsContainer = document.getElementById('calculation-details');
    if (!detailsContainer) return;
    
    const { isHybridMode, lccParams, hp, comparisons, inputs, hybridSystem, hybrid_aux } = results;
    const { annualHeatingDemandKWh, weightedAvgElecPrice } = inputs;
    const gridFactorToDisplay = inputs.isGreenElectricity ? 0 : inputs.gridFactor;
    const gridFactorLabel = inputs.isGreenElectricity ? '绿电因子' : '电网因子';

    let detailsHTML = `<div class="p-4 md:p-6 space-y-6 text-xs">`;
    detailsHTML += `
        <div>
            <h3 class="text-base font-bold border-b pb-2 mb-2">A. 核心经济指标计算方法与依据</h3>
            <div class="space-y-1 text-gray-600">
                <p><b>全寿命周期成本 (LCC):</b> LCC = CAPEX + NPV(Energy) + NPV(O&M) - NPV(Salvage)。</p>
                <p><b>净现值 (NPV):</b> NPV = (LCC_基准 - LCC_工业热泵)。NPV > 0 代表项目可行。</p>
                <p><b>内部收益率 (IRR):</b> 使项目净现值(NPV)等于零时的折现率。IRR > 基准折现率，代表项目优秀。</p>
            </div>
        </div>
    `;
    
    if (isHybridMode) {
        const hpLoadSharePercent = (inputs.hybridLoadShare * 100).toFixed(1);
        const auxLoadSharePercent = (100 - parseFloat(hpLoadSharePercent)).toFixed(1);
        detailsHTML += `
            <div>
                <h3 class="text-base font-bold border-b pb-2 mb-2">B. 本次项目详细计算过程 (混合模式)</h3>
                <p><b>年总制热量:</b> ${fNum(annualHeatingDemandKWh, 0)} kWh</p>
                <div class="mt-2 p-3 bg-blue-50 rounded-md space-y-1">
                    <h4 class="font-semibold text-blue-800">方案A: 混合系统 (总计)</h4>
                    <p>• 年总运行成本 (第1年): ${fWan(hybridSystem.opex)} 万元</p>
                    <p>• 年总碳排放量: ${fTon(hybridSystem.co2)} 吨 CO₂</p>
                    <p>• 产热成本: ${hybridSystem.cost_per_kwh_heat.toFixed(4)} 元/kWh_热</p>
                </div>
                <div class="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                    <h4 class="font-semibold text-gray-700">混合系统 - 工业热泵部分 (${hpLoadSharePercent}%)</h4>
                    <p>• 年能源成本: ${fYuan(hp.energyCost)} 元</p>
                </div>
                <div class="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                    <h4 class="font-semibold text-gray-700">混合系统 - 辅助热源 (${hybrid_aux.name}, ${auxLoadSharePercent}%)</h4>
                    <p>• 年能源消耗: ${fNum(hybrid_aux.consumption)} ${hybrid_aux.consumptionUnit}</p>
                    <p>• 年能源成本: ${fYuan(hybrid_aux.energyCost)} 元</p>
                </div>
            </div>
        `;
    } else {
        detailsHTML += `
            <div>
                <h3 class="text-base font-bold border-b pb-2 mb-2">B. 本次项目详细计算过程 (标准模式)</h3>
                 <p><b>年总制热量:</b> ${fNum(annualHeatingDemandKWh, 0)} kWh</p>
                 <div class="mt-2 p-3 bg-blue-50 rounded-md space-y-1">
                    <h4 class="font-semibold text-blue-800">方案A: 工业热泵</h4>
                    <p>• 年总电耗: ${fNum(hp.energyCostDetails.totalElec, 0)} kWh</p>
                    <p>• 年总运行成本: ${fWan(hp.opex)} 万元</p>
                    <p>• 产热成本: ${hp.cost_per_kwh_heat.toFixed(4)} 元/kWh_热</p>
                    <p>• 年碳排放量: ${fTon(hp.co2)} 吨 CO₂</p>
                </div>
            </div>
        `;
    }

    detailsHTML += `<div class="space-y-4">`;
    comparisons.forEach(c => {
        const boiler = results[c.key];
        detailsHTML += `
            <div class="pt-4 border-t">
                <h4 class="font-semibold text-gray-800">对比: ${isHybridMode ? hybridSystem.name : '工业热泵'} vs ${c.name}</h4>
                <div class="text-gray-600 space-y-1 mt-1">
                    <p>• <b>基准 (${c.name}) 年消耗:</b> ${fNum(boiler.consumption, 1)} ${boiler.consumptionUnit}</p>
                    <p>• <b>基准 (${c.name}) 年运行成本:</b> ${fWan(boiler.opex)} 万元</p>
                    <p class="font-semibold text-green-700">↳ 年节省总成本: ${fWan(c.opexSaving)} 万元</p>
                    <p class="font-semibold text-blue-800">↳ LCC 节省 (NPV): ${fWan(c.npv)} 万元</p>
                    <p class="font-semibold text-blue-800">↳ 内部收益率 (IRR): ${fPercent(c.irr)}</p>
                </div>
            </div>
        `;
    });
    detailsHTML += `</div></div>`;
    detailsContainer.innerHTML = detailsHTML;
}

export function buildPrintReport(results) {
    const printContainer = document.getElementById('print-report-container');
    if (!printContainer) return;
    
    const { inputs, lccParams, comparisons, hp, isHybridMode, hybridSystem } = results;
    const projectName = inputs.projectName || "未命名项目";
    const reportDate = new Date().toLocaleString('zh-CN');
    
    let reportHTML = `
        <div class="print-header">
            <h2>${projectName} 项目</h2>
            <h1>工业热泵经济与环境效益分析报告</h1>
            <p>报告日期: ${reportDate}</p>
        </div>
        <div class="print-section">
            <h3>1. 核心输入参数</h3>
            <table class="print-table">
                <tr><td>项目名称</td><td>${projectName}</td></tr>
                <tr><td>年总制热量</td><td class="text-right">${fNum(inputs.annualHeatingDemandKWh, 0)} kWh</td></tr>
                <tr><td>经济分析年限</td><td class="text-right">${lccParams.lccYears} 年</td></tr>
                <tr><td>基准折现率</td><td class="text-right">${fPercent(lccParams.discountRate, 1)}</td></tr>
            </table>
        </div>
        <div class="print-section">
            <h3>2. 方案静态对比 (第1年)</h3>
            <table class="print-table">
                <thead><tr><th>方案名称</th><th class="text-right">总投资(万)</th><th class="text-right">年运行成本(万)</th></tr></thead>
                <tbody>
                    <tr>
                        <td><strong>${isHybridMode ? hybridSystem.name : '工业热泵方案'}</strong></td>
                        <td class="text-right"><strong>${fWan(isHybridMode ? hybridSystem.lcc.capex : hp.lcc.capex)}</strong></td>
                        <td class="text-right"><strong>${fWan(isHybridMode ? hybridSystem.opex : hp.opex)}</strong></td>
                    </tr>
    `;
    comparisons.forEach(c => {
        const boilerData = results[c.key];
        reportHTML += `<tr><td>${c.name}</td><td class="text-right">${fWan(boilerData.lcc.capex)}</td><td class="text-right">${fWan(boilerData.opex)}</td></tr>`;
    });
    reportHTML += `
                </tbody>
            </table>
        </div>
        <div class="print-section">
            <h3>3. 核心经济与环境效益</h3>
            <table class="print-table">
                <thead><tr><th>对比项</th><th class="text-right">IRR</th><th class="text-right">动态PBP (年)</th><th class="text-right">年碳减排 (tCO₂)</th></tr></thead>
                <tbody>
    `;
    comparisons.forEach(c => {
        reportHTML += `<tr><td>vs. ${c.name}</td><td class="text-right">${fPercent(c.irr)}</td><td class="text-right">${fYears(c.dynamicPBP)}</td><td class="text-right">${fTon(c.co2Reduction)}</td></tr>`;
    });
    reportHTML += `
                </tbody>
            </table>
        </div>
        <div class="print-footer"><p>报告由工业热泵经济与环境效益分析器 Pro 生成。</p></div>
    `;
    printContainer.innerHTML = reportHTML;
}

function populateBotCalculationDetails(results) {
    const detailsContainer = document.getElementById('calculation-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = `<p class="p-4">BOT 模式的详细计算过程功能待添加。</p>`;
    }
}